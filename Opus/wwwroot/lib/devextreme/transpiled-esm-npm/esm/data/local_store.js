import eventsEngine from '../events/core/events_engine';
import domAdapter from '../core/dom_adapter';
import { getWindow } from '../core/utils/window';
var window = getWindow();
import Class from '../core/class';
var abstract = Class.abstract;
import { errors } from './errors';
import ArrayStore from './array_store';
var LocalStoreBackend = Class.inherit({
  ctor: function ctor(store, storeOptions) {
    this._store = store;
    this._dirty = !!storeOptions.data;
    this.save();
    var immediate = this._immediate = storeOptions.immediate;
    var flushInterval = Math.max(100, storeOptions.flushInterval || 10 * 1000);

    if (!immediate) {
      var saveProxy = this.save.bind(this);
      setInterval(saveProxy, flushInterval);
      eventsEngine.on(window, 'beforeunload', saveProxy);

      if (window.cordova) {
        domAdapter.listen(domAdapter.getDocument(), 'pause', saveProxy, false);
      }
    }
  },
  notifyChanged: function notifyChanged() {
    this._dirty = true;

    if (this._immediate) {
      this.save();
    }
  },
  load: function load() {
    this._store._array = this._loadImpl();
    this._dirty = false;
  },
  save: function save() {
    if (!this._dirty) {
      return;
    }

    this._saveImpl(this._store._array);

    this._dirty = false;
  },
  _loadImpl: abstract,
  _saveImpl: abstract
});
var DomLocalStoreBackend = LocalStoreBackend.inherit({
  ctor: function ctor(store, storeOptions) {
    var name = storeOptions.name;

    if (!name) {
      throw errors.Error('E4013');
    }

    this._key = 'dx-data-localStore-' + name;
    this.callBase(store, storeOptions);
  },
  _loadImpl: function _loadImpl() {
    var raw = window.localStorage.getItem(this._key);

    if (raw) {
      return JSON.parse(raw);
    }

    return [];
  },
  _saveImpl: function _saveImpl(array) {
    if (!array.length) {
      window.localStorage.removeItem(this._key);
    } else {
      window.localStorage.setItem(this._key, JSON.stringify(array));
    }
  }
});
var localStoreBackends = {
  'dom': DomLocalStoreBackend
};
var LocalStore = ArrayStore.inherit({
  ctor: function ctor(options) {
    if (typeof options === 'string') {
      options = {
        name: options
      };
    } else {
      options = options || {};
    }

    this.callBase(options);
    this._backend = new localStoreBackends[options.backend || 'dom'](this, options);

    this._backend.load();
  },
  clear: function clear() {
    this.callBase();

    this._backend.notifyChanged();
  },
  _insertImpl: function _insertImpl(values) {
    var b = this._backend;
    return this.callBase(values).done(b.notifyChanged.bind(b));
  },
  _updateImpl: function _updateImpl(key, values) {
    var b = this._backend;
    return this.callBase(key, values).done(b.notifyChanged.bind(b));
  },
  _removeImpl: function _removeImpl(key) {
    var b = this._backend;
    return this.callBase(key).done(b.notifyChanged.bind(b));
  }
}, 'local');
export default LocalStore;
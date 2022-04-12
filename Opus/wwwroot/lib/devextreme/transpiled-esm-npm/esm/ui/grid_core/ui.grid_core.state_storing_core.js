import eventsEngine from '../../events/core/events_engine';
import { getWindow } from '../../core/utils/window';
import modules from './ui.grid_core.modules';
import errors from '../widget/ui.errors';
import { sessionStorage } from '../../core/utils/storage';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { isDefined, isPlainObject, isEmptyObject } from '../../core/utils/type';
import { fromPromise } from '../../core/utils/deferred';
var DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

var parseDates = function parseDates(state) {
  if (!state) return;
  each(state, function (key, value) {
    if (isPlainObject(value) || Array.isArray(value)) {
      parseDates(value);
    } else if (typeof value === 'string') {
      var date = DATE_REGEX.exec(value);

      if (date) {
        state[key] = new Date(Date.UTC(+date[1], +date[2] - 1, +date[3], +date[4], +date[5], +date[6]));
      }
    }
  });
};

export var StateStoringController = modules.ViewController.inherit(function () {
  var getStorage = function getStorage(options) {
    var storage = options.type === 'sessionStorage' ? sessionStorage() : getWindow().localStorage;

    if (!storage) {
      throw new Error('E1007');
    }

    return storage;
  };

  var getUniqueStorageKey = function getUniqueStorageKey(options) {
    return isDefined(options.storageKey) ? options.storageKey : 'storage';
  };

  return {
    _loadState: function _loadState() {
      var options = this.option('stateStoring');

      if (options.type === 'custom') {
        return options.customLoad && options.customLoad();
      }

      try {
        return JSON.parse(getStorage(options).getItem(getUniqueStorageKey(options)));
      } catch (e) {
        errors.log(e.message);
      }
    },
    _saveState: function _saveState(state) {
      var options = this.option('stateStoring');

      if (options.type === 'custom') {
        options.customSave && options.customSave(state);
        return;
      }

      try {
        getStorage(options).setItem(getUniqueStorageKey(options), JSON.stringify(state));
      } catch (e) {
        errors.log(e.message);
      }
    },
    publicMethods: function publicMethods() {
      return ['state'];
    },
    isEnabled: function isEnabled() {
      return this.option('stateStoring.enabled');
    },
    init: function init() {
      var that = this;
      that._state = {};
      that._isLoaded = false;
      that._isLoading = false;

      that._windowUnloadHandler = function () {
        if (that._savingTimeoutID !== undefined) {
          that._saveState(that.state());
        }
      };

      eventsEngine.on(getWindow(), 'unload', that._windowUnloadHandler);
      return that;
    },
    isLoaded: function isLoaded() {
      return this._isLoaded;
    },
    isLoading: function isLoading() {
      return this._isLoading;
    },
    load: function load() {
      this._isLoading = true;
      var loadResult = fromPromise(this._loadState());
      loadResult.always(() => {
        this._isLoaded = true;
        this._isLoading = false;
      }).done(state => {
        if (state !== null && !isEmptyObject(state)) {
          this.state(state);
        }
      });
      return loadResult;
    },
    state: function state(_state) {
      var that = this;

      if (!arguments.length) {
        return extend(true, {}, that._state);
      } else {
        that._state = extend({}, _state);
        parseDates(that._state);
      }
    },
    save: function save() {
      var that = this;
      clearTimeout(that._savingTimeoutID);
      that._savingTimeoutID = setTimeout(function () {
        that._saveState(that.state());

        that._savingTimeoutID = undefined;
      }, that.option('stateStoring.savingTimeout'));
    },
    optionChanged: function optionChanged(args) {
      var that = this;

      switch (args.name) {
        case 'stateStoring':
          if (that.isEnabled() && !that.isLoading()) {
            that.load();
          }

          args.handled = true;
          break;

        default:
          that.callBase(args);
      }
    },
    dispose: function dispose() {
      clearTimeout(this._savingTimeoutID);
      eventsEngine.off(getWindow(), 'unload', this._windowUnloadHandler);
    }
  };
}());
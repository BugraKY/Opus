import Callbacks from '../../core/utils/callbacks';
export function DataExchanger() {
  this._store = {};
}
DataExchanger.prototype = {
  constructor: DataExchanger,
  dispose: function dispose() {
    this._store = null;
    return this;
  },
  _get: function _get(category, name) {
    var store = this._store[category] || (this._store[category] = {});
    return store[name] || (store[name] = {
      callbacks: Callbacks()
    });
  },
  set: function set(category, name, data) {
    var item = this._get(category, name);

    item.data = data;
    item.callbacks.fire(data);
    return this;
  },
  bind: function bind(category, name, callback) {
    var item = this._get(category, name);

    item.callbacks.add(callback);
    item.data && callback(item.data);
    return this;
  },
  unbind: function unbind(category, name, callback) {
    var item = this._get(category, name);

    item.callbacks.remove(callback);
    return this;
  }
};
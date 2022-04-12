import { each } from '../../../core/utils/iterator';
export default class WidgetCollector {
  constructor() {
    this._collection = [];
  }

  clear() {
    this._collection = [];
  }

  add(name, instance) {
    this._collection.push({
      name,
      instance
    });
  }

  getByName(widgetName) {
    var widget = null;
    each(this._collection, (index, _ref) => {
      var {
        name,
        instance
      } = _ref;

      if (name === widgetName) {
        widget = instance;
        return false;
      }
    });
    return widget;
  }

  each(handler) {
    this._collection.forEach(_ref2 => {
      var {
        name,
        instance
      } = _ref2;
      return instance && handler(name, instance);
    });
  }

}
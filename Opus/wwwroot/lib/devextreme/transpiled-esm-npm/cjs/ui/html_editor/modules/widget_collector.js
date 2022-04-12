"use strict";

exports.default = void 0;

var _iterator = require("../../../core/utils/iterator");

var WidgetCollector = /*#__PURE__*/function () {
  function WidgetCollector() {
    this._collection = [];
  }

  var _proto = WidgetCollector.prototype;

  _proto.clear = function clear() {
    this._collection = [];
  };

  _proto.add = function add(name, instance) {
    this._collection.push({
      name: name,
      instance: instance
    });
  };

  _proto.getByName = function getByName(widgetName) {
    var widget = null;
    (0, _iterator.each)(this._collection, function (index, _ref) {
      var name = _ref.name,
          instance = _ref.instance;

      if (name === widgetName) {
        widget = instance;
        return false;
      }
    });
    return widget;
  };

  _proto.each = function each(handler) {
    this._collection.forEach(function (_ref2) {
      var name = _ref2.name,
          instance = _ref2.instance;
      return instance && handler(name, instance);
    });
  };

  return WidgetCollector;
}();

exports.default = WidgetCollector;
module.exports = exports.default;
module.exports.default = exports.default;
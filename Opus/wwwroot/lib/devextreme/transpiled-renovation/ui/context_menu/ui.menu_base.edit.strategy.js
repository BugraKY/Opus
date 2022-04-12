"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _iterator = require("../../core/utils/iterator");

var _uiCollection_widgetEditStrategy = _interopRequireDefault(require("../collection/ui.collection_widget.edit.strategy.plain"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MenuBaseEditStrategy = /*#__PURE__*/function (_PlainEditStrategy) {
  _inheritsLoose(MenuBaseEditStrategy, _PlainEditStrategy);

  function MenuBaseEditStrategy() {
    return _PlainEditStrategy.apply(this, arguments) || this;
  }

  var _proto = MenuBaseEditStrategy.prototype;

  _proto._getPlainItems = function _getPlainItems() {
    return (0, _iterator.map)(this._collectionWidget.option('items'), function getMenuItems(item) {
      return item.items ? [item].concat((0, _iterator.map)(item.items, getMenuItems)) : item;
    });
  };

  _proto._stringifyItem = function _stringifyItem(item) {
    var _this = this;

    return JSON.stringify(item, function (key, value) {
      if (key === 'template') {
        return _this._getTemplateString(value);
      }

      return value;
    });
  };

  _proto._getTemplateString = function _getTemplateString(template) {
    var result;

    if (_typeof(template) === 'object') {
      result = (0, _renderer.default)(template).text();
    } else {
      result = template.toString();
    }

    return result;
  };

  return MenuBaseEditStrategy;
}(_uiCollection_widgetEditStrategy.default);

var _default = MenuBaseEditStrategy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
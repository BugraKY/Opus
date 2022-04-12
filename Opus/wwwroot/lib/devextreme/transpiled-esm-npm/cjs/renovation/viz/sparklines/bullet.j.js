"use strict";

exports.default = void 0;

var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));

var _component = _interopRequireDefault(require("../../component_wrapper/common/component"));

var _bullet = require("./bullet");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Bullet = /*#__PURE__*/function (_BaseComponent) {
  _inheritsLoose(Bullet, _BaseComponent);

  function Bullet() {
    return _BaseComponent.apply(this, arguments) || this;
  }

  var _proto = Bullet.prototype;

  _proto._getActionConfigs = function _getActionConfigs() {
    return {
      onTooltipHidden: {},
      onTooltipShown: {}
    };
  };

  _createClass(Bullet, [{
    key: "_propsInfo",
    get: function get() {
      return {
        twoWay: [["canvas", "defaultCanvas", "canvasChange"]],
        allowNull: [],
        elements: [],
        templates: [],
        props: ["value", "color", "target", "targetColor", "targetWidth", "showTarget", "showZeroLevel", "startScaleValue", "endScaleValue", "tooltip", "onTooltipHidden", "onTooltipShown", "size", "margin", "disabled", "rtlEnabled", "classes", "className", "defaultCanvas", "pointerEvents", "canvasChange", "canvas"]
      };
    }
  }, {
    key: "_viewComponent",
    get: function get() {
      return _bullet.Bullet;
    }
  }]);

  return Bullet;
}(_component.default);

exports.default = Bullet;
(0, _component_registrator.default)("dxBullet", Bullet);
module.exports = exports.default;
module.exports.default = exports.default;
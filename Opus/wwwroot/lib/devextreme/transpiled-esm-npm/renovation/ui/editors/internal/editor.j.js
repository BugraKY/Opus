"use strict";

exports.default = void 0;

var _component_registrator = _interopRequireDefault(require("../../../../core/component_registrator"));

var _editor = _interopRequireDefault(require("../../../component_wrapper/editors/editor"));

var _editor2 = require("./editor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Editor = /*#__PURE__*/function (_EditorWrapperCompone) {
  _inheritsLoose(Editor, _EditorWrapperCompone);

  function Editor() {
    return _EditorWrapperCompone.apply(this, arguments) || this;
  }

  var _proto = Editor.prototype;

  _proto.getProps = function getProps() {
    var props = _EditorWrapperCompone.prototype.getProps.call(this);

    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  };

  _proto.focus = function focus() {
    var _this$viewRef;

    return (_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.focus.apply(_this$viewRef, arguments);
  };

  _proto.blur = function blur() {
    var _this$viewRef2;

    return (_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.blur.apply(_this$viewRef2, arguments);
  };

  _proto._getActionConfigs = function _getActionConfigs() {
    return {
      onFocusIn: {},
      onClick: {}
    };
  };

  _createClass(Editor, [{
    key: "_propsInfo",
    get: function get() {
      return {
        twoWay: [["value", "defaultValue", "valueChange"]],
        allowNull: ["validationError", "validationErrors"],
        elements: [],
        templates: [],
        props: ["readOnly", "name", "validationError", "validationErrors", "validationMessageMode", "validationStatus", "isValid", "onFocusIn", "defaultValue", "valueChange", "className", "accessKey", "activeStateEnabled", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "onClick", "onKeyDown", "rtlEnabled", "tabIndex", "visible", "width", "aria", "classes", "value"]
      };
    }
  }, {
    key: "_viewComponent",
    get: function get() {
      return _editor2.Editor;
    }
  }]);

  return Editor;
}(_editor.default);

exports.default = Editor;
(0, _component_registrator.default)("dxEditor", Editor);
Editor.defaultOptions = _editor2.defaultOptions;
module.exports = exports.default;
module.exports.default = exports.default;
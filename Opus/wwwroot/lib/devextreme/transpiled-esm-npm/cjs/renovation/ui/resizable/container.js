"use strict";

exports.ResizableContainerProps = exports.ResizableContainer = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _handle = require("./handle");

var _combine_classes = require("../../utils/combine_classes");

var _visibility_change = require("../../../events/visibility_change");

var _utils = require("../../../core/options/utils");

var _excluded = ["children", "disabled", "handles", "height", "mainRef", "onResize", "onResizeEnd", "onResizeStart", "rtlEnabled", "width"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var getCssClasses = function getCssClasses(disabled, rtlEnabled, isResizing) {
  return (0, _combine_classes.combineClasses)({
    "dx-resizable": true,
    "dx-state-disabled": disabled,
    "dx-rtl": rtlEnabled,
    "dx-resizable-resizing": isResizing
  });
};

var viewFunction = function viewFunction(viewModel) {
  var cssClasses = viewModel.cssClasses,
      handles = viewModel.handles,
      mainContainerRef = viewModel.mainContainerRef,
      onHandleResize = viewModel.onHandleResize,
      onHandleResizeEnd = viewModel.onHandleResizeEnd,
      onHandleResizeStart = viewModel.onHandleResizeStart,
      props = viewModel.props,
      restAttributes = viewModel.restAttributes,
      styles = viewModel.styles;
  var children = props.children,
      disabled = props.disabled;
  return (0, _inferno.normalizeProps)((0, _inferno.createVNode)(1, "div", cssClasses, [children, handles.map(function (handleType) {
    return (0, _inferno.createComponentVNode)(2, _handle.ResizableHandle, {
      "onResizeStart": function onResizeStart(event) {
        return onHandleResizeStart(event, handleType);
      },
      "onResize": function onResize(event) {
        return onHandleResize(event, handleType);
      },
      "onResizeEnd": function onResizeEnd(event) {
        return onHandleResizeEnd(event, handleType);
      },
      "disabled": disabled,
      "direction": handleType
    }, handleType);
  })], 0, _extends({
    "style": (0, _inferno2.normalizeStyles)(styles)
  }, restAttributes), null, mainContainerRef));
};

exports.viewFunction = viewFunction;
var ResizableContainerProps = Object.defineProperties({
  rtlEnabled: false,
  disabled: false
}, {
  handles: {
    get: function get() {
      return [];
    },
    configurable: true,
    enumerable: true
  },
  children: {
    get: function get() {
      return [];
    },
    configurable: true,
    enumerable: true
  }
});
exports.ResizableContainerProps = ResizableContainerProps;

var ResizableContainer = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(ResizableContainer, _InfernoComponent);

  function ResizableContainer(props) {
    var _this;

    _this = _InfernoComponent.call(this, props) || this;
    _this.startX = Number.NaN;
    _this.startY = Number.NaN;
    _this.mainContainerRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.state = {
      isResizing: false
    };
    _this.forwardRefInitEffect = _this.forwardRefInitEffect.bind(_assertThisInitialized(_this));
    _this.onHandleResizeStart = _this.onHandleResizeStart.bind(_assertThisInitialized(_this));
    _this.onHandleResize = _this.onHandleResize.bind(_assertThisInitialized(_this));
    _this.onHandleResizeEnd = _this.onHandleResizeEnd.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = ResizableContainer.prototype;

  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.forwardRefInitEffect, [])];
  };

  _proto.forwardRefInitEffect = function forwardRefInitEffect() {
    if (this.props.mainRef) {
      this.props.mainRef.current = this.mainContainerRef.current;
    }

    return undefined;
  };

  _proto.onHandleResizeStart = function onHandleResizeStart(event, handle) {
    var _this$props$onResizeS, _this$props;

    this.setState(function (__state_argument) {
      return {
        isResizing: true
      };
    });
    this.startX = event.clientX;
    this.startY = event.clientY;
    (_this$props$onResizeS = (_this$props = this.props).onResizeStart) === null || _this$props$onResizeS === void 0 ? void 0 : _this$props$onResizeS.call(_this$props, {
      event: event,
      handle: handle
    });
    event.targetElements = [];
    return undefined;
  };

  _proto.onHandleResize = function onHandleResize(event, handle) {
    var onResize = this.props.onResize;
    onResize === null || onResize === void 0 ? void 0 : onResize({
      event: event,
      handle: handle,
      delta: {
        x: event.clientX - this.startX,
        y: event.clientY - this.startY
      }
    });
    (0, _visibility_change.triggerResizeEvent)(this.mainContainerRef.current);
    return undefined;
  };

  _proto.onHandleResizeEnd = function onHandleResizeEnd(event, handle) {
    var _this$props$onResizeE, _this$props2;

    this.setState(function (__state_argument) {
      return {
        isResizing: false
      };
    });
    this.startX = Number.NaN;
    this.startY = Number.NaN;
    (_this$props$onResizeE = (_this$props2 = this.props).onResizeEnd) === null || _this$props$onResizeE === void 0 ? void 0 : _this$props$onResizeE.call(_this$props2, {
      event: event,
      handle: handle
    });
    return undefined;
  };

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoComponent.prototype.componentWillUpdate.call(this);

    if (this.props["handles"] !== nextProps["handles"]) {
      this.__getterCache["handles"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      isResizing: this.state.isResizing,
      mainContainerRef: this.mainContainerRef,
      onHandleResizeStart: this.onHandleResizeStart,
      onHandleResize: this.onHandleResize,
      onHandleResizeEnd: this.onHandleResizeEnd,
      cssClasses: this.cssClasses,
      styles: this.styles,
      handles: this.handles,
      restAttributes: this.restAttributes
    });
  };

  _createClass(ResizableContainer, [{
    key: "cssClasses",
    get: function get() {
      var _this$props3 = this.props,
          disabled = _this$props3.disabled,
          rtlEnabled = _this$props3.rtlEnabled;
      return getCssClasses(!!disabled, !!rtlEnabled, this.state.isResizing);
    }
  }, {
    key: "styles",
    get: function get() {
      var _this$props4 = this.props,
          height = _this$props4.height,
          width = _this$props4.width;
      var style = this.restAttributes.style || {};
      return _extends({}, style, {
        height: height,
        width: width
      });
    }
  }, {
    key: "handles",
    get: function get() {
      var _this2 = this;

      if (this.__getterCache["handles"] !== undefined) {
        return this.__getterCache["handles"];
      }

      return this.__getterCache["handles"] = function () {
        var handles = _this2.props.handles;

        if (typeof handles === "string") {
          handles = [handles];
        }

        var result = handles.map(function (handle) {
          return handle;
        });

        if (result.includes("bottom")) {
          result.includes("right") && result.push("corner-bottom-right");
          result.includes("left") && result.push("corner-bottom-left");
        }

        if (result.includes("top")) {
          result.includes("right") && result.push("corner-top-right");
          result.includes("left") && result.push("corner-top-left");
        }

        return result;
      }();
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props5 = this.props,
          children = _this$props5.children,
          disabled = _this$props5.disabled,
          handles = _this$props5.handles,
          height = _this$props5.height,
          mainRef = _this$props5.mainRef,
          onResize = _this$props5.onResize,
          onResizeEnd = _this$props5.onResizeEnd,
          onResizeStart = _this$props5.onResizeStart,
          rtlEnabled = _this$props5.rtlEnabled,
          width = _this$props5.width,
          restProps = _objectWithoutProperties(_this$props5, _excluded);

      return restProps;
    }
  }]);

  return ResizableContainer;
}(_inferno2.InfernoComponent);

exports.ResizableContainer = ResizableContainer;
ResizableContainer.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(ResizableContainerProps), Object.getOwnPropertyDescriptors(_extends({}, (0, _utils.convertRulesToOptions)([])))));
var __defaultOptionRules = [];

function defaultOptions(rule) {
  __defaultOptionRules.push(rule);

  ResizableContainer.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(ResizableContainer.defaultProps), Object.getOwnPropertyDescriptors((0, _utils.convertRulesToOptions)([])), Object.getOwnPropertyDescriptors((0, _utils.convertRulesToOptions)(__defaultOptionRules))));
}
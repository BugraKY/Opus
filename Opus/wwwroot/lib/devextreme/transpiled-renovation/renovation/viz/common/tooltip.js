"use strict";

exports.viewFunction = exports.TooltipProps = exports.Tooltip = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _combine_classes = require("../../utils/combine_classes");

var _svg_path = require("./renderers/svg_path");

var _svg_text = require("./renderers/svg_text");

var _shadow_filter = require("./renderers/shadow_filter");

var _utils = require("./renderers/utils");

var _svg_root = require("./renderers/svg_root");

var _type = require("../../../core/utils/type");

var _tooltip_utils = require("./tooltip_utils");

var _utils2 = require("../../../viz/core/utils");

var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));

var _utils3 = require("./utils");

var _excluded = ["argumentFormat", "arrowLength", "arrowWidth", "border", "className", "color", "container", "contentTemplate", "cornerRadius", "customizeTooltip", "data", "enabled", "eventData", "font", "format", "interactive", "location", "offset", "onTooltipHidden", "onTooltipShown", "opacity", "paddingLeftRight", "paddingTopBottom", "rootWidget", "rtl", "shadow", "shared", "visible", "x", "y", "zIndex"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DEFAULT_CANVAS = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
};
var DEFAULT_FONT = {
  color: "#232323",
  family: "Segoe UI",
  opacity: 1,
  size: 12,
  weight: 400
};
var DEFAULT_SHADOW = {
  blur: 2,
  color: "#000",
  offsetX: 0,
  offsetY: 4,
  opacity: 0.4
};
var DEFAULT_BORDER = {
  color: "#d3d3d3",
  width: 1,
  dashStyle: "solid",
  visible: true
};
var DEFAULT_SIZE = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

var viewFunction = function viewFunction(_ref) {
  var border = _ref.border,
      cloudRef = _ref.cloudRef,
      cloudSize = _ref.cloudSize,
      container = _ref.container,
      correctedCoordinates = _ref.correctedCoordinates,
      cssClassName = _ref.cssClassName,
      customizedOptions = _ref.customizedOptions,
      filterId = _ref.filterId,
      htmlRef = _ref.htmlRef,
      isEmptyContainer = _ref.isEmptyContainer,
      pointerEvents = _ref.pointerEvents,
      _ref$props = _ref.props,
      arrowWidth = _ref$props.arrowWidth,
      TooltipTemplate = _ref$props.contentTemplate,
      cornerRadius = _ref$props.cornerRadius,
      data = _ref$props.data,
      font = _ref$props.font,
      interactive = _ref$props.interactive,
      opacity = _ref$props.opacity,
      rtl = _ref$props.rtl,
      shadow = _ref$props.shadow,
      visible = _ref$props.visible,
      zIndex = _ref$props.zIndex,
      textRef = _ref.textRef,
      textSize = _ref.textSize,
      textSizeWithPaddings = _ref.textSizeWithPaddings,
      textSvgElementStyles = _ref.textSvgElementStyles;

  if (!visible || !correctedCoordinates || (0, _tooltip_utils.isTextEmpty)(customizedOptions) || isEmptyContainer) {
    return (0, _inferno.createVNode)(1, "div");
  }

  var angle = (0, _tooltip_utils.getCloudAngle)(textSizeWithPaddings, correctedCoordinates);
  var d = (0, _tooltip_utils.getCloudPoints)(textSizeWithPaddings, correctedCoordinates, angle, {
    cornerRadius: cornerRadius,
    arrowWidth: arrowWidth
  }, true);
  var styles = interactive ? {
    msUserSelect: "text",
    MozUserSelect: "auto",
    WebkitUserSelect: "auto"
  } : {};
  styles = _extends({}, styles, {
    position: "absolute"
  });
  return (0, _inferno.createComponentVNode)(2, _inferno2.Portal, {
    "container": container,
    children: (0, _inferno.createVNode)(1, "div", cssClassName, [(0, _inferno.createComponentVNode)(2, _svg_root.RootSvgElement, {
      "width": cloudSize.width,
      "height": cloudSize.height,
      "styles": styles,
      children: [(0, _inferno.createVNode)(32, "defs", null, (0, _inferno.createComponentVNode)(2, _shadow_filter.ShadowFilter, {
        "id": filterId,
        "x": "-50%",
        "y": "-50%",
        "width": "200%",
        "height": "200%",
        "blur": shadow.blur,
        "color": shadow.color,
        "offsetX": shadow.offsetX,
        "offsetY": shadow.offsetY,
        "opacity": shadow.opacity
      }), 2), (0, _inferno.createVNode)(32, "g", null, [(0, _inferno.createComponentVNode)(2, _svg_path.PathSvgElement, {
        "pointerEvents": pointerEvents,
        "d": d,
        "fill": customizedOptions.color,
        "stroke": customizedOptions.borderColor,
        "strokeWidth": border.strokeWidth,
        "strokeOpacity": border.strokeOpacity,
        "dashStyle": border.dashStyle,
        "opacity": opacity,
        "rotate": angle,
        "rotateX": correctedCoordinates.x,
        "rotateY": correctedCoordinates.y
      }), customizedOptions.html || TooltipTemplate ? null : (0, _inferno.createVNode)(32, "g", null, (0, _inferno.createComponentVNode)(2, _svg_text.TextSvgElement, {
        "text": customizedOptions.text,
        "styles": textSvgElementStyles
      }), 2, {
        "text-anchor": "middle",
        "transform": "translate(".concat(correctedCoordinates.x, ", ").concat(correctedCoordinates.y - textSize.height / 2 - textSize.y, ")")
      }, null, textRef)], 0, {
        "filter": (0, _utils.getFuncIri)(filterId),
        "transform": "translate(".concat(-cloudSize.x, ", ").concat(-cloudSize.y, ")")
      }, null, cloudRef)]
    }), !(customizedOptions.html || TooltipTemplate) ? null : (0, _inferno.createVNode)(1, "div", null, TooltipTemplate && TooltipTemplate(_extends({}, data)), 0, {
      "style": (0, _inferno2.normalizeStyles)({
        position: "relative",
        display: "inline-block",
        left: correctedCoordinates.x - cloudSize.x - textSize.width / 2,
        top: correctedCoordinates.y - cloudSize.y - textSize.height / 2,
        fill: customizedOptions.fontColor,
        fontFamily: font.family,
        fontSize: font.size,
        fontWeight: font.weight,
        opacity: font.opacity,
        pointerEvents: pointerEvents,
        direction: rtl ? "rtl" : "ltr"
      })
    }, null, htmlRef)], 0, {
      "style": (0, _inferno2.normalizeStyles)({
        position: "absolute",
        pointerEvents: "none",
        left: cloudSize.x,
        top: cloudSize.y,
        zIndex: zIndex
      })
    })
  });
};

exports.viewFunction = viewFunction;
var TooltipProps = Object.defineProperties({
  color: "#fff",
  border: DEFAULT_BORDER,
  paddingLeftRight: 18,
  paddingTopBottom: 15,
  x: 0,
  y: 0,
  cornerRadius: 0,
  arrowWidth: 20,
  arrowLength: 10,
  offset: 0,
  font: DEFAULT_FONT,
  shadow: DEFAULT_SHADOW,
  interactive: false,
  enabled: true,
  shared: false,
  location: "center",
  visible: false,
  rtl: false
}, {
  data: {
    get: function get() {
      return {};
    },
    configurable: true,
    enumerable: true
  }
});
exports.TooltipProps = TooltipProps;

var getTemplate = function getTemplate(TemplateProp) {
  return TemplateProp && (TemplateProp.defaultProps ? function (props) {
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)));
  } : TemplateProp);
};

var Tooltip = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(Tooltip, _InfernoComponent);

  function Tooltip(props) {
    var _this;

    _this = _InfernoComponent.call(this, props) || this;
    _this.cloudRef = (0, _inferno.createRef)();
    _this.textRef = (0, _inferno.createRef)();
    _this.htmlRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.state = {
      filterId: (0, _utils.getNextDefsSvgId)(),
      textSize: DEFAULT_SIZE,
      cloudSize: DEFAULT_SIZE,
      currentEventData: undefined,
      isEmptyContainer: false,
      canvas: DEFAULT_CANVAS
    };
    _this.setHtmlText = _this.setHtmlText.bind(_assertThisInitialized(_this));
    _this.calculateSize = _this.calculateSize.bind(_assertThisInitialized(_this));
    _this.eventsEffect = _this.eventsEffect.bind(_assertThisInitialized(_this));
    _this.checkContainer = _this.checkContainer.bind(_assertThisInitialized(_this));
    _this.setCanvas = _this.setCanvas.bind(_assertThisInitialized(_this));
    _this.getLocation = _this.getLocation.bind(_assertThisInitialized(_this));
    _this.calculateContentSize = _this.calculateContentSize.bind(_assertThisInitialized(_this));
    _this.calculateCloudSize = _this.calculateCloudSize.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Tooltip.prototype;

  _proto.createEffects = function createEffects() {
    var _this$props$rootWidge;

    return [new _inferno2.InfernoEffect(this.setHtmlText, [this.props.border, this.props.color, this.props.customizeTooltip, this.props.data, this.props.font, this.props.visible]), new _inferno2.InfernoEffect(this.calculateSize, [this.props.visible, this.props.x, this.props.y, this.props.shadow, this.state.textSize, this.state.cloudSize]), new _inferno2.InfernoEffect(this.eventsEffect, [this.props.eventData, this.props.onTooltipHidden, this.props.onTooltipShown, this.props.visible, this.props.arrowLength, this.props.offset, this.props.x, this.props.y, this.state.canvas, this.props.paddingLeftRight, this.props.paddingTopBottom, this.state.textSize, this.state.currentEventData]), new _inferno2.InfernoEffect(this.checkContainer, [this.props.visible]), new _inferno2.InfernoEffect(this.setCanvas, [this.props.container, (_this$props$rootWidge = this.props.rootWidget) === null || _this$props$rootWidge === void 0 ? void 0 : _this$props$rootWidge.current])];
  };

  _proto.updateEffects = function updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$props$rootWidge2;

    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.border, this.props.color, this.props.customizeTooltip, this.props.data, this.props.font, this.props.visible]);
    (_this$_effects$2 = this._effects[1]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props.visible, this.props.x, this.props.y, this.props.shadow, this.state.textSize, this.state.cloudSize]);
    (_this$_effects$3 = this._effects[2]) === null || _this$_effects$3 === void 0 ? void 0 : _this$_effects$3.update([this.props.eventData, this.props.onTooltipHidden, this.props.onTooltipShown, this.props.visible, this.props.arrowLength, this.props.offset, this.props.x, this.props.y, this.state.canvas, this.props.paddingLeftRight, this.props.paddingTopBottom, this.state.textSize, this.state.currentEventData]);
    (_this$_effects$4 = this._effects[3]) === null || _this$_effects$4 === void 0 ? void 0 : _this$_effects$4.update([this.props.visible]);
    (_this$_effects$5 = this._effects[4]) === null || _this$_effects$5 === void 0 ? void 0 : _this$_effects$5.update([this.props.container, (_this$props$rootWidge2 = this.props.rootWidget) === null || _this$props$rootWidge2 === void 0 ? void 0 : _this$props$rootWidge2.current]);
  };

  _proto.setHtmlText = function setHtmlText() {
    var htmlText = this.customizedOptions.html;

    if (htmlText && this.htmlRef.current && this.props.visible) {
      this.htmlRef.current.innerHTML = htmlText;
    }
  };

  _proto.calculateSize = function calculateSize() {
    var contentSize = this.calculateContentSize();
    var cloudSize = this.calculateCloudSize();

    if ((0, _utils3.isUpdatedFlatObject)(this.state.textSize, contentSize)) {
      this.setState(function (__state_argument) {
        return {
          textSize: contentSize
        };
      });
    }

    if ((0, _utils3.isUpdatedFlatObject)(this.state.cloudSize, cloudSize)) {
      this.setState(function (__state_argument) {
        return {
          cloudSize: cloudSize
        };
      });
    }
  };

  _proto.eventsEffect = function eventsEffect() {
    var _this$props = this.props,
        eventData = _this$props.eventData,
        onTooltipHidden = _this$props.onTooltipHidden,
        onTooltipShown = _this$props.onTooltipShown,
        visible = _this$props.visible;

    var isEqual = function isEqual(object1, object2) {
      if (!object1) {
        return false;
      }

      return JSON.stringify(object1.target) === JSON.stringify(object2.target);
    };

    if (visible && this.correctedCoordinates && !isEqual(this.state.currentEventData, eventData)) {
      this.state.currentEventData && (onTooltipHidden === null || onTooltipHidden === void 0 ? void 0 : onTooltipHidden(this.state.currentEventData));
      onTooltipShown === null || onTooltipShown === void 0 ? void 0 : onTooltipShown(eventData);
      this.setState(function (__state_argument) {
        return {
          currentEventData: eventData
        };
      });
    }

    if (!visible && this.state.currentEventData) {
      onTooltipHidden === null || onTooltipHidden === void 0 ? void 0 : onTooltipHidden(this.state.currentEventData);
      this.setState(function (__state_argument) {
        return {
          currentEventData: undefined
        };
      });
    }
  };

  _proto.checkContainer = function checkContainer() {
    if (this.htmlRef.current && this.props.visible) {
      var htmlTextSize = this.htmlRef.current.getBoundingClientRect();

      if (!htmlTextSize.width && !htmlTextSize.height) {
        this.setState(function (__state_argument) {
          return {
            isEmptyContainer: true
          };
        });
      }
    }
  };

  _proto.setCanvas = function setCanvas() {
    var _this2 = this;

    this.setState(function (__state_argument) {
      return {
        canvas: (0, _tooltip_utils.getCanvas)(_this2.container)
      };
    });
  };

  _proto.calculateContentSize = function calculateContentSize() {
    var size = DEFAULT_SIZE;

    if (this.props.visible) {
      if (this.textRef.current) {
        size = this.textRef.current.getBBox();
      } else if (this.htmlRef.current) {
        size = this.htmlRef.current.getBoundingClientRect();
      }
    }

    return size;
  };

  _proto.calculateCloudSize = function calculateCloudSize() {
    var cloudSize = DEFAULT_SIZE;

    if ((0, _type.isDefined)(this.props.x) && (0, _type.isDefined)(this.props.y) && this.props.visible && this.cloudRef.current) {
      var size = this.cloudRef.current.getBBox();
      var _this$margins = this.margins,
          bm = _this$margins.bm,
          lm = _this$margins.lm,
          rm = _this$margins.rm,
          tm = _this$margins.tm;
      cloudSize = {
        x: Math.floor(size.x - lm),
        y: Math.floor(size.y - tm),
        width: size.width + lm + rm,
        height: size.height + tm + bm
      };
    }

    return cloudSize;
  };

  _proto.getLocation = function getLocation() {
    return (0, _utils2.normalizeEnum)(this.props.location);
  };

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoComponent.prototype.componentWillUpdate.call(this);

    if (this.props["border"] !== nextProps["border"]) {
      this.__getterCache["border"] = undefined;
    }

    if (this.props["border"] !== nextProps["border"] || this.props["color"] !== nextProps["color"] || this.props["customizeTooltip"] !== nextProps["customizeTooltip"] || this.props["data"] !== nextProps["data"] || this.props["font"] !== nextProps["font"]) {
      this.__getterCache["customizedOptions"] = undefined;
    }

    if (this.props["shadow"] !== nextProps["shadow"]) {
      this.__getterCache["margins"] = undefined;
    }

    if (this.props["arrowLength"] !== nextProps["arrowLength"] || this.props["offset"] !== nextProps["offset"] || this.props["x"] !== nextProps["x"] || this.props["y"] !== nextProps["y"] || this.state["canvas"] !== nextState["canvas"] || this.props["paddingLeftRight"] !== nextProps["paddingLeftRight"] || this.props["paddingTopBottom"] !== nextProps["paddingTopBottom"] || this.state["textSize"] !== nextState["textSize"]) {
      this.__getterCache["correctedCoordinates"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        contentTemplate: getTemplate(props.contentTemplate)
      }),
      filterId: this.state.filterId,
      textSize: this.state.textSize,
      cloudSize: this.state.cloudSize,
      currentEventData: this.state.currentEventData,
      isEmptyContainer: this.state.isEmptyContainer,
      canvas: this.state.canvas,
      cloudRef: this.cloudRef,
      textRef: this.textRef,
      htmlRef: this.htmlRef,
      textSvgElementStyles: this.textSvgElementStyles,
      textSizeWithPaddings: this.textSizeWithPaddings,
      border: this.border,
      container: this.container,
      customizedOptions: this.customizedOptions,
      margins: this.margins,
      pointerEvents: this.pointerEvents,
      cssClassName: this.cssClassName,
      fontStyles: this.fontStyles,
      correctedCoordinates: this.correctedCoordinates,
      calculateContentSize: this.calculateContentSize,
      calculateCloudSize: this.calculateCloudSize,
      restAttributes: this.restAttributes
    });
  };

  _createClass(Tooltip, [{
    key: "textSvgElementStyles",
    get: function get() {
      return _extends({}, this.fontStyles, {
        pointerEvents: this.pointerEvents
      });
    }
  }, {
    key: "textSizeWithPaddings",
    get: function get() {
      var _this$props2 = this.props,
          paddingLeftRight = _this$props2.paddingLeftRight,
          paddingTopBottom = _this$props2.paddingTopBottom;
      return {
        width: this.state.textSize.width + paddingLeftRight * 2,
        height: this.state.textSize.height + paddingTopBottom * 2
      };
    }
  }, {
    key: "border",
    get: function get() {
      var _this3 = this;

      if (this.__getterCache["border"] !== undefined) {
        return this.__getterCache["border"];
      }

      return this.__getterCache["border"] = function () {
        var border = _this3.props.border;

        if (border.visible) {
          return {
            stroke: border.color,
            strokeWidth: border.width,
            strokeOpacity: border.opacity,
            dashStyle: border.dashStyle
          };
        }

        return {};
      }();
    }
  }, {
    key: "container",
    get: function get() {
      var propsContainer = this.props.container;

      if (propsContainer) {
        if (typeof propsContainer === "string") {
          var _this$props$rootWidge3;

          var tmp = (_this$props$rootWidge3 = this.props.rootWidget) === null || _this$props$rootWidge3 === void 0 ? void 0 : _this$props$rootWidge3.current;
          var node = tmp === null || tmp === void 0 ? void 0 : tmp.closest(propsContainer);

          if (!node) {
            node = _dom_adapter.default.getDocument().querySelector(propsContainer);
          }

          if (node) {
            return node;
          }
        } else {
          return propsContainer;
        }
      }

      return _dom_adapter.default.getBody();
    }
  }, {
    key: "customizedOptions",
    get: function get() {
      var _this4 = this;

      if (this.__getterCache["customizedOptions"] !== undefined) {
        return this.__getterCache["customizedOptions"];
      }

      return this.__getterCache["customizedOptions"] = function () {
        var _this4$props = _this4.props,
            border = _this4$props.border,
            color = _this4$props.color,
            customizeTooltip = _this4$props.customizeTooltip,
            data = _this4$props.data,
            font = _this4$props.font;
        return (0, _tooltip_utils.prepareData)(data, color, border, font, customizeTooltip);
      }();
    }
  }, {
    key: "margins",
    get: function get() {
      var _this5 = this;

      if (this.__getterCache["margins"] !== undefined) {
        return this.__getterCache["margins"];
      }

      return this.__getterCache["margins"] = function () {
        var max = Math.max;
        var shadow = _this5.props.shadow;
        var xOff = shadow.offsetX;
        var yOff = shadow.offsetY;
        var blur = shadow.blur * 2 + 1;
        return {
          lm: max(blur - xOff, 0),
          rm: max(blur + xOff, 0),
          tm: max(blur - yOff, 0),
          bm: max(blur + yOff, 0)
        };
      }();
    }
  }, {
    key: "pointerEvents",
    get: function get() {
      var interactive = this.props.interactive;
      return interactive ? "auto" : "none";
    }
  }, {
    key: "cssClassName",
    get: function get() {
      var className = this.props.className;

      var classesMap = _defineProperty({}, String(className), !!className);

      return (0, _combine_classes.combineClasses)(classesMap);
    }
  }, {
    key: "fontStyles",
    get: function get() {
      var font = this.props.font;
      var result = {};
      font.family !== undefined && (result.fontFamily = font.family);
      font.size !== undefined && (result.fontSize = String(font.size));
      font.weight !== undefined && (result.fontWeight = String(font.weight));
      font.opacity !== undefined && (result.opacity = String(font.opacity));
      this.customizedOptions.fontColor !== undefined && (result.fill = this.customizedOptions.fontColor);
      return result;
    }
  }, {
    key: "correctedCoordinates",
    get: function get() {
      var _this6 = this;

      if (this.__getterCache["correctedCoordinates"] !== undefined) {
        return this.__getterCache["correctedCoordinates"];
      }

      return this.__getterCache["correctedCoordinates"] = function () {
        var _this6$props = _this6.props,
            arrowLength = _this6$props.arrowLength,
            offset = _this6$props.offset,
            x = _this6$props.x,
            y = _this6$props.y;
        return (0, _tooltip_utils.recalculateCoordinates)({
          canvas: _this6.state.canvas,
          anchorX: x,
          anchorY: y,
          size: _this6.textSizeWithPaddings,
          offset: offset,
          arrowLength: arrowLength
        });
      }();
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props3 = this.props,
          argumentFormat = _this$props3.argumentFormat,
          arrowLength = _this$props3.arrowLength,
          arrowWidth = _this$props3.arrowWidth,
          border = _this$props3.border,
          className = _this$props3.className,
          color = _this$props3.color,
          container = _this$props3.container,
          contentTemplate = _this$props3.contentTemplate,
          cornerRadius = _this$props3.cornerRadius,
          customizeTooltip = _this$props3.customizeTooltip,
          data = _this$props3.data,
          enabled = _this$props3.enabled,
          eventData = _this$props3.eventData,
          font = _this$props3.font,
          format = _this$props3.format,
          interactive = _this$props3.interactive,
          location = _this$props3.location,
          offset = _this$props3.offset,
          onTooltipHidden = _this$props3.onTooltipHidden,
          onTooltipShown = _this$props3.onTooltipShown,
          opacity = _this$props3.opacity,
          paddingLeftRight = _this$props3.paddingLeftRight,
          paddingTopBottom = _this$props3.paddingTopBottom,
          rootWidget = _this$props3.rootWidget,
          rtl = _this$props3.rtl,
          shadow = _this$props3.shadow,
          shared = _this$props3.shared,
          visible = _this$props3.visible,
          x = _this$props3.x,
          y = _this$props3.y,
          zIndex = _this$props3.zIndex,
          restProps = _objectWithoutProperties(_this$props3, _excluded);

      return restProps;
    }
  }]);

  return Tooltip;
}(_inferno2.InfernoComponent);

exports.Tooltip = Tooltip;
Tooltip.defaultProps = TooltipProps;
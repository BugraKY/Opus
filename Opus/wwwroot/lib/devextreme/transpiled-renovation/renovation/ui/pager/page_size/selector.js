"use strict";

exports.viewFunction = exports.PageSizeSelector = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _small = require("./small");

var _large = require("./large");

var _pager_props = require("../common/pager_props");

var _message = _interopRequireDefault(require("../../../../localization/message"));

var _consts = require("../common/consts");

var _excluded = ["isLargeDisplayMode", "pageSize", "pageSizeChange", "pageSizes", "rootElementRef"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var viewFunction = function viewFunction(_ref) {
  var htmlRef = _ref.htmlRef,
      normalizedPageSizes = _ref.normalizedPageSizes,
      _ref$props = _ref.props,
      isLargeDisplayMode = _ref$props.isLargeDisplayMode,
      pageSize = _ref$props.pageSize,
      pageSizeChange = _ref$props.pageSizeChange;
  return (0, _inferno.createVNode)(1, "div", _consts.PAGER_PAGE_SIZES_CLASS, [isLargeDisplayMode && (0, _inferno.createComponentVNode)(2, _large.PageSizeLarge, {
    "pageSizes": normalizedPageSizes,
    "pageSize": pageSize,
    "pageSizeChange": pageSizeChange
  }), !isLargeDisplayMode && (0, _inferno.createComponentVNode)(2, _small.PageSizeSmall, {
    "parentRef": htmlRef,
    "pageSizes": normalizedPageSizes,
    "pageSize": pageSize,
    "pageSizeChange": pageSizeChange
  })], 0, null, null, htmlRef);
};

exports.viewFunction = viewFunction;

function getAllText() {
  return _message.default.getFormatter("dxPager-pageSizesAllText")();
}

var PageSizeSelectorProps = {
  isLargeDisplayMode: true
};
var PageSizeSelectorPropsType = Object.defineProperties({}, {
  pageSize: {
    get: function get() {
      return _pager_props.InternalPagerProps.pageSize;
    },
    configurable: true,
    enumerable: true
  },
  pageSizes: {
    get: function get() {
      return _pager_props.InternalPagerProps.pageSizes;
    },
    configurable: true,
    enumerable: true
  },
  isLargeDisplayMode: {
    get: function get() {
      return PageSizeSelectorProps.isLargeDisplayMode;
    },
    configurable: true,
    enumerable: true
  }
});

var PageSizeSelector = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(PageSizeSelector, _InfernoComponent);

  function PageSizeSelector(props) {
    var _this;

    _this = _InfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.htmlRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.setRootElementRef = _this.setRootElementRef.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = PageSizeSelector.prototype;

  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.setRootElementRef, [])];
  };

  _proto.setRootElementRef = function setRootElementRef() {
    var rootElementRef = this.props.rootElementRef;

    if (rootElementRef) {
      rootElementRef.current = this.htmlRef.current;
    }
  };

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoComponent.prototype.componentWillUpdate.call(this);

    if (this.props["pageSizes"] !== nextProps["pageSizes"]) {
      this.__getterCache["normalizedPageSizes"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      htmlRef: this.htmlRef,
      normalizedPageSizes: this.normalizedPageSizes,
      restAttributes: this.restAttributes
    });
  };

  _createClass(PageSizeSelector, [{
    key: "normalizedPageSizes",
    get: function get() {
      var _this2 = this;

      if (this.__getterCache["normalizedPageSizes"] !== undefined) {
        return this.__getterCache["normalizedPageSizes"];
      }

      return this.__getterCache["normalizedPageSizes"] = function () {
        var pageSizes = _this2.props.pageSizes;
        return pageSizes.map(function (p) {
          return p === "all" || p === 0 ? {
            text: getAllText(),
            value: 0
          } : {
            text: String(p),
            value: p
          };
        });
      }();
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          isLargeDisplayMode = _this$props.isLargeDisplayMode,
          pageSize = _this$props.pageSize,
          pageSizeChange = _this$props.pageSizeChange,
          pageSizes = _this$props.pageSizes,
          rootElementRef = _this$props.rootElementRef,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return PageSizeSelector;
}(_inferno2.InfernoComponent);

exports.PageSizeSelector = PageSizeSelector;
PageSizeSelector.defaultProps = PageSizeSelectorPropsType;
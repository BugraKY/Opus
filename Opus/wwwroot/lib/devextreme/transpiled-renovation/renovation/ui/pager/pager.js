"use strict";

exports.viewFunction = exports.Pager = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _resizable_container = require("./resizable_container");

var _pager_props = require("./common/pager_props");

var _content = require("./content");

var _combine_classes = require("../../utils/combine_classes");

var _excluded = ["className", "defaultPageIndex", "defaultPageSize", "displayMode", "gridCompatibility", "hasKnownLastPage", "infoText", "lightModeEnabled", "maxPagesCount", "onKeyDown", "pageCount", "pageIndex", "pageIndexChange", "pageSize", "pageSizeChange", "pageSizes", "pagesCountText", "pagesNavigatorVisible", "rtlEnabled", "showInfo", "showNavigationButtons", "showPageSizes", "totalCount", "visible"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var viewFunction = function viewFunction(_ref) {
  var pagerProps = _ref.pagerProps,
      restAttributes = _ref.restAttributes;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _resizable_container.ResizableContainer, _extends({
    "contentTemplate": _content.PagerContent,
    "pagerProps": pagerProps
  }, restAttributes)));
};

exports.viewFunction = viewFunction;

var Pager = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(Pager, _InfernoWrapperCompon);

  function Pager(props) {
    var _this;

    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.__getterCache = {};
    _this.state = {
      pageSize: _this.props.pageSize !== undefined ? _this.props.pageSize : _this.props.defaultPageSize,
      pageIndex: _this.props.pageIndex !== undefined ? _this.props.pageIndex : _this.props.defaultPageIndex
    };
    _this.pageIndexChange = _this.pageIndexChange.bind(_assertThisInitialized(_this));
    _this.pageSizeChange = _this.pageSizeChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Pager.prototype;

  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };

  _proto.pageIndexChange = function pageIndexChange(newPageIndex) {
    if (this.props.gridCompatibility) {
      {
        var __newValue;

        this.setState(function (__state_argument) {
          __newValue = newPageIndex + 1;
          return {
            pageIndex: __newValue
          };
        });
        this.props.pageIndexChange(__newValue);
      }
    } else {
      {
        var _newValue;

        this.setState(function (__state_argument) {
          _newValue = newPageIndex;
          return {
            pageIndex: _newValue
          };
        });
        this.props.pageIndexChange(_newValue);
      }
    }
  };

  _proto.pageSizeChange = function pageSizeChange(newPageSize) {
    {
      var __newValue;

      this.setState(function (__state_argument) {
        __newValue = newPageSize;
        return {
          pageSize: __newValue
        };
      });
      this.props.pageSizeChange(__newValue);
    }
  };

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoWrapperCompon.prototype.componentWillUpdate.call(this);

    if (this.props !== nextProps || this.props["gridCompatibility"] !== nextProps["gridCompatibility"] || this.props["className"] !== nextProps["className"] || this.state["pageIndex"] !== nextState["pageIndex"] || this.props["pageIndex"] !== nextProps["pageIndex"] || this.props["pageIndexChange"] !== nextProps["pageIndexChange"] || this.props["pageSizeChange"] !== nextProps["pageSizeChange"]) {
      this.__getterCache["pagerProps"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        pageSize: this.props.pageSize !== undefined ? this.props.pageSize : this.state.pageSize,
        pageIndex: this.props.pageIndex !== undefined ? this.props.pageIndex : this.state.pageIndex
      }),
      pageIndexChange: this.pageIndexChange,
      pageIndex: this.pageIndex,
      pageSizeChange: this.pageSizeChange,
      className: this.className,
      pagerProps: this.pagerProps,
      restAttributes: this.restAttributes
    });
  };

  _createClass(Pager, [{
    key: "pageIndex",
    get: function get() {
      if (this.props.gridCompatibility) {
        return (this.props.pageIndex !== undefined ? this.props.pageIndex : this.state.pageIndex) - 1;
      }

      return this.props.pageIndex !== undefined ? this.props.pageIndex : this.state.pageIndex;
    }
  }, {
    key: "className",
    get: function get() {
      if (this.props.gridCompatibility) {
        return (0, _combine_classes.combineClasses)(_defineProperty({
          "dx-datagrid-pager": true
        }, "".concat(this.props.className), !!this.props.className));
      }

      return this.props.className;
    }
  }, {
    key: "pagerProps",
    get: function get() {
      var _this2 = this;

      if (this.__getterCache["pagerProps"] !== undefined) {
        return this.__getterCache["pagerProps"];
      }

      return this.__getterCache["pagerProps"] = function () {
        return _extends({}, _extends({}, _this2.props, {
          pageSize: _this2.props.pageSize !== undefined ? _this2.props.pageSize : _this2.state.pageSize,
          pageIndex: _this2.props.pageIndex !== undefined ? _this2.props.pageIndex : _this2.state.pageIndex
        }), {
          className: _this2.className,
          pageIndex: _this2.pageIndex,
          pageIndexChange: function pageIndexChange(pageIndex) {
            return _this2.pageIndexChange(pageIndex);
          },
          pageSizeChange: function pageSizeChange(pageSize) {
            return _this2.pageSizeChange(pageSize);
          }
        });
      }();
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props$pageSize$ = _extends({}, this.props, {
        pageSize: this.props.pageSize !== undefined ? this.props.pageSize : this.state.pageSize,
        pageIndex: this.props.pageIndex !== undefined ? this.props.pageIndex : this.state.pageIndex
      }),
          className = _this$props$pageSize$.className,
          defaultPageIndex = _this$props$pageSize$.defaultPageIndex,
          defaultPageSize = _this$props$pageSize$.defaultPageSize,
          displayMode = _this$props$pageSize$.displayMode,
          gridCompatibility = _this$props$pageSize$.gridCompatibility,
          hasKnownLastPage = _this$props$pageSize$.hasKnownLastPage,
          infoText = _this$props$pageSize$.infoText,
          lightModeEnabled = _this$props$pageSize$.lightModeEnabled,
          maxPagesCount = _this$props$pageSize$.maxPagesCount,
          onKeyDown = _this$props$pageSize$.onKeyDown,
          pageCount = _this$props$pageSize$.pageCount,
          pageIndex = _this$props$pageSize$.pageIndex,
          pageIndexChange = _this$props$pageSize$.pageIndexChange,
          pageSize = _this$props$pageSize$.pageSize,
          pageSizeChange = _this$props$pageSize$.pageSizeChange,
          pageSizes = _this$props$pageSize$.pageSizes,
          pagesCountText = _this$props$pageSize$.pagesCountText,
          pagesNavigatorVisible = _this$props$pageSize$.pagesNavigatorVisible,
          rtlEnabled = _this$props$pageSize$.rtlEnabled,
          showInfo = _this$props$pageSize$.showInfo,
          showNavigationButtons = _this$props$pageSize$.showNavigationButtons,
          showPageSizes = _this$props$pageSize$.showPageSizes,
          totalCount = _this$props$pageSize$.totalCount,
          visible = _this$props$pageSize$.visible,
          restProps = _objectWithoutProperties(_this$props$pageSize$, _excluded);

      return restProps;
    }
  }]);

  return Pager;
}(_inferno2.InfernoWrapperComponent);

exports.Pager = Pager;
Pager.defaultProps = _pager_props.PagerProps;
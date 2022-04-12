"use strict";

exports.viewFunction = exports.PagesLarge = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _page = require("./page");

var _pager_props = require("../common/pager_props");

var _config_context = require("../../../common/config_context");

var _excluded = ["pageIndexes"],
    _excluded2 = ["maxPagesCount", "pageCount", "pageIndex", "pageIndexChange"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var PAGER_PAGE_SEPARATOR_CLASS = "dx-separator";

var viewFunction = function viewFunction(_ref) {
  var pages = _ref.pages;
  var PagesMarkup = pages.map(function (_ref2) {
    var key = _ref2.key,
        pageProps = _ref2.pageProps;
    return pageProps ? (0, _inferno.createComponentVNode)(2, _page.Page, {
      "index": pageProps.index,
      "selected": pageProps.selected,
      "onClick": pageProps.onClick
    }, key) : (0, _inferno.createVNode)(1, "div", PAGER_PAGE_SEPARATOR_CLASS, ". . .", 16, null, key);
  });
  return (0, _inferno.createFragment)(PagesMarkup, 0);
};

exports.viewFunction = viewFunction;
var PAGES_LIMITER = 4;

function getDelimiterType(startIndex, slidingWindowSize, pageCount) {
  if (startIndex === 1) {
    return "high";
  }

  if (startIndex + slidingWindowSize === pageCount - 1) {
    return "low";
  }

  return "both";
}

function createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter) {
  var pageIndexes = [];
  var indexesForReuse = [];

  switch (delimiter) {
    case "none":
      pageIndexes = _toConsumableArray(slidingWindowIndexes);
      break;

    case "both":
      pageIndexes = [0, "low"].concat(_toConsumableArray(slidingWindowIndexes), ["high", pageCount - 1]);
      indexesForReuse = slidingWindowIndexes.slice(1, -1);
      break;

    case "high":
      pageIndexes = [0].concat(_toConsumableArray(slidingWindowIndexes), ["high", pageCount - 1]);
      indexesForReuse = slidingWindowIndexes.slice(0, -1);
      break;

    case "low":
      pageIndexes = [0, "low"].concat(_toConsumableArray(slidingWindowIndexes), [pageCount - 1]);
      indexesForReuse = slidingWindowIndexes.slice(1);
      break;
  }

  return {
    slidingWindowIndexes: slidingWindowIndexes,
    indexesForReuse: indexesForReuse,
    pageIndexes: pageIndexes
  };
}

function createPageIndexes(startIndex, slidingWindowSize, pageCount, delimiter) {
  var slidingWindowIndexes = [];

  for (var i = 0; i < slidingWindowSize; i += 1) {
    slidingWindowIndexes.push(i + startIndex);
  }

  return createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter);
}

var PagesLargePropsType = Object.defineProperties({}, {
  pageIndex: {
    get: function get() {
      return _pager_props.InternalPagerProps.pageIndex;
    },
    configurable: true,
    enumerable: true
  },
  maxPagesCount: {
    get: function get() {
      return _pager_props.InternalPagerProps.maxPagesCount;
    },
    configurable: true,
    enumerable: true
  },
  pageCount: {
    get: function get() {
      return _pager_props.InternalPagerProps.pageCount;
    },
    configurable: true,
    enumerable: true
  }
});

var PagesLarge = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(PagesLarge, _BaseInfernoComponent);

  function PagesLarge(props) {
    var _this;

    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    _this.canReuseSlidingWindow = _this.canReuseSlidingWindow.bind(_assertThisInitialized(_this));
    _this.generatePageIndexes = _this.generatePageIndexes.bind(_assertThisInitialized(_this));
    _this.isSlidingWindowMode = _this.isSlidingWindowMode.bind(_assertThisInitialized(_this));
    _this.onPageClick = _this.onPageClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = PagesLarge.prototype;

  _proto.canReuseSlidingWindow = function canReuseSlidingWindow(currentPageCount, pageIndex) {
    var indexesForReuse = this.slidingWindowState.indexesForReuse;
    var currentPageNotExistInIndexes = !indexesForReuse.includes(currentPageCount);
    var pageIndexExistInIndexes = indexesForReuse.includes(pageIndex);
    return currentPageNotExistInIndexes && pageIndexExistInIndexes;
  };

  _proto.generatePageIndexes = function generatePageIndexes() {
    var _this$props = this.props,
        pageCount = _this$props.pageCount,
        pageIndex = _this$props.pageIndex;
    var startIndex = 0;
    var slidingWindowIndexes = this.slidingWindowState.slidingWindowIndexes;

    if (pageIndex === slidingWindowIndexes[0]) {
      startIndex = pageIndex - 1;
    } else if (pageIndex === slidingWindowIndexes[slidingWindowIndexes.length - 1]) {
      startIndex = pageIndex + 2 - PAGES_LIMITER;
    } else if (pageIndex < PAGES_LIMITER) {
      startIndex = 1;
    } else if (pageIndex >= pageCount - PAGES_LIMITER) {
      startIndex = pageCount - PAGES_LIMITER - 1;
    } else {
      startIndex = pageIndex - 1;
    }

    var slidingWindowSize = PAGES_LIMITER;
    var delimiter = getDelimiterType(startIndex, slidingWindowSize, pageCount);

    var _createPageIndexes = createPageIndexes(startIndex, slidingWindowSize, pageCount, delimiter),
        pageIndexes = _createPageIndexes.pageIndexes,
        slidingWindowState = _objectWithoutProperties(_createPageIndexes, _excluded);

    this.slidingWindowStateHolder = slidingWindowState;
    return pageIndexes;
  };

  _proto.isSlidingWindowMode = function isSlidingWindowMode() {
    var _this$props2 = this.props,
        maxPagesCount = _this$props2.maxPagesCount,
        pageCount = _this$props2.pageCount;
    return pageCount <= PAGES_LIMITER || pageCount <= maxPagesCount;
  };

  _proto.onPageClick = function onPageClick(pageIndex) {
    this.props.pageIndexChange(pageIndex);
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      config: this.config,
      pageIndexes: this.pageIndexes,
      pages: this.pages,
      restAttributes: this.restAttributes
    });
  };

  _createClass(PagesLarge, [{
    key: "config",
    get: function get() {
      if ("ConfigContext" in this.context) {
        return this.context.ConfigContext;
      }

      return _config_context.ConfigContext;
    }
  }, {
    key: "slidingWindowState",
    get: function get() {
      var slidingWindowState = this.slidingWindowStateHolder;

      if (!slidingWindowState) {
        return {
          indexesForReuse: [],
          slidingWindowIndexes: []
        };
      }

      return slidingWindowState;
    }
  }, {
    key: "pageIndexes",
    get: function get() {
      var pageCount = this.props.pageCount;

      if (this.isSlidingWindowMode()) {
        return createPageIndexes(0, pageCount, pageCount, "none").pageIndexes;
      }

      if (this.canReuseSlidingWindow(pageCount, this.props.pageIndex)) {
        var slidingWindowIndexes = this.slidingWindowState.slidingWindowIndexes;
        var delimiter = getDelimiterType(slidingWindowIndexes[0], PAGES_LIMITER, pageCount);
        return createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter).pageIndexes;
      }

      return this.generatePageIndexes();
    }
  }, {
    key: "pages",
    get: function get() {
      var _this2 = this,
          _this$config;

      var pageIndex = this.props.pageIndex;

      var createPage = function createPage(index) {
        var pagerProps = index === "low" || index === "high" ? null : {
          index: index,
          onClick: function onClick() {
            return _this2.onPageClick(index);
          },
          selected: pageIndex === index
        };
        return {
          key: index.toString(),
          pageProps: pagerProps
        };
      };

      var rtlPageIndexes = (_this$config = this.config) !== null && _this$config !== void 0 && _this$config.rtlEnabled ? _toConsumableArray(this.pageIndexes).reverse() : this.pageIndexes;
      return rtlPageIndexes.map(function (index) {
        return createPage(index);
      });
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props3 = this.props,
          maxPagesCount = _this$props3.maxPagesCount,
          pageCount = _this$props3.pageCount,
          pageIndex = _this$props3.pageIndex,
          pageIndexChange = _this$props3.pageIndexChange,
          restProps = _objectWithoutProperties(_this$props3, _excluded2);

      return restProps;
    }
  }]);

  return PagesLarge;
}(_inferno2.BaseInfernoComponent);

exports.PagesLarge = PagesLarge;
PagesLarge.defaultProps = PagesLargePropsType;
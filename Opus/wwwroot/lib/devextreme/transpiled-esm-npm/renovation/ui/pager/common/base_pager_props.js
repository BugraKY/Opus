"use strict";

exports.BasePagerProps = void 0;
var BasePagerProps = Object.defineProperties({
  gridCompatibility: true,
  showInfo: false,
  displayMode: "adaptive",
  maxPagesCount: 10,
  pageCount: 10,
  visible: true,
  hasKnownLastPage: true,
  pagesNavigatorVisible: "auto",
  showPageSizes: true,
  showNavigationButtons: false,
  totalCount: 0
}, {
  pageSizes: {
    get: function get() {
      return [5, 10];
    },
    configurable: true,
    enumerable: true
  }
});
exports.BasePagerProps = BasePagerProps;
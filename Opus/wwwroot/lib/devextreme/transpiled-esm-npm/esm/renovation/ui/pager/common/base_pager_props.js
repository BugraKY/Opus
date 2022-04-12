export var BasePagerProps = {
  gridCompatibility: true,
  showInfo: false,
  displayMode: "adaptive",
  maxPagesCount: 10,
  pageCount: 10,
  visible: true,
  hasKnownLastPage: true,
  pagesNavigatorVisible: "auto",
  showPageSizes: true,

  get pageSizes() {
    return [5, 10];
  },

  showNavigationButtons: false,
  totalCount: 0
};
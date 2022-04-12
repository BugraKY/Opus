"use strict";

exports.GroupPanelBaseProps = void 0;
var GroupPanelBaseProps = Object.defineProperties({
  groupByDate: false
}, {
  groupPanelData: {
    get: function get() {
      return {
        groupPanelItems: [],
        baseColSpan: 1
      };
    },
    configurable: true,
    enumerable: true
  }
});
exports.GroupPanelBaseProps = GroupPanelBaseProps;
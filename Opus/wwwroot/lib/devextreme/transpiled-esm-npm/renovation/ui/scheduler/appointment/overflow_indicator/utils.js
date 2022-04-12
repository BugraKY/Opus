"use strict";

exports.getOverflowIndicatorStyles = exports.getOverflowIndicatorColor = void 0;

var _utils = require("../../workspaces/utils");

var getOverflowIndicatorStyles = function getOverflowIndicatorStyles(viewModel) {
  var color = viewModel.color,
      _viewModel$geometry = viewModel.geometry,
      height = _viewModel$geometry.height,
      left = _viewModel$geometry.left,
      top = _viewModel$geometry.top,
      width = _viewModel$geometry.width;
  var result = (0, _utils.addToStyles)([{
    attr: "left",
    value: "".concat(left, "px")
  }, {
    attr: "top",
    value: "".concat(top, "px")
  }, {
    attr: "width",
    value: "".concat(width, "px")
  }, {
    attr: "height",
    value: "".concat(height, "px")
  }]);

  if (color) {
    result = (0, _utils.addToStyles)([{
      attr: "backgroundColor",
      value: color
    }, {
      attr: "boxShadow",
      value: "inset ".concat(width, "px 0 0 0 rgba(0, 0, 0, 0.3)")
    }], result);
  }

  return result;
};

exports.getOverflowIndicatorStyles = getOverflowIndicatorStyles;

var getOverflowIndicatorColor = function getOverflowIndicatorColor(color, colors) {
  return !colors.length || colors.filter(function (item) {
    return item !== color;
  }).length === 0 ? color : undefined;
};

exports.getOverflowIndicatorColor = getOverflowIndicatorColor;
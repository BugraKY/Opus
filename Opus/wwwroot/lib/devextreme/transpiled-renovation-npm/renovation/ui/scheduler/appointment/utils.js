"use strict";

exports.getAppointmentStyles = exports.getAppointmentKey = void 0;

var _utils = require("../workspaces/utils");

var getAppointmentStyles = function getAppointmentStyles(item) {
  var defaultSize = 50;
  var _item$geometry = item.geometry,
      height = _item$geometry.height,
      left = _item$geometry.left,
      top = _item$geometry.top,
      width = _item$geometry.width,
      resourceColor = item.info.resourceColor;
  var result = (0, _utils.addToStyles)([{
    attr: "height",
    value: "".concat(height || defaultSize, "px")
  }, {
    attr: "width",
    value: "".concat(width || defaultSize, "px")
  }, {
    attr: "top",
    value: "".concat(top, "px")
  }, {
    attr: "left",
    value: "".concat(left, "px")
  }]);

  if (resourceColor) {
    result = (0, _utils.addToStyles)([{
      attr: "backgroundColor",
      value: resourceColor
    }], result);
  }

  return result;
};

exports.getAppointmentStyles = getAppointmentStyles;

var getAppointmentKey = function getAppointmentKey(geometry) {
  var height = geometry.height,
      left = geometry.left,
      top = geometry.top,
      width = geometry.width;
  return "".concat(left, "-").concat(top, "-").concat(width, "-").concat(height);
};

exports.getAppointmentKey = getAppointmentKey;
"use strict";

exports.convertToScreenSizeQualifier = void 0;

var convertToScreenSizeQualifier = function convertToScreenSizeQualifier(width) {
  if (width < 768) {
    return "xs";
  }

  if (width < 992) {
    return "sm";
  }

  if (width < 1200) {
    return "md";
  }

  return "lg";
};

exports.convertToScreenSizeQualifier = convertToScreenSizeQualifier;
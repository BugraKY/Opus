"use strict";

exports.generateCustomizeTooltipCallback = exports.createAxis = void 0;

var _translator2d = require("../../../viz/translators/translator2d");

var _common = require("../../../core/utils/common");

var _type = require("../../../core/utils/type");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DEFAULT_LINE_SPACING = 2;

var createAxis = function createAxis(isHorizontal) {
  var translator = new _translator2d.Translator2D({}, {}, {
    shiftZeroValue: !isHorizontal,
    isHorizontal: !!isHorizontal
  });
  return {
    getTranslator: function getTranslator() {
      return translator;
    },
    update: function update(range, canvas, options) {
      return translator.update(range, canvas, options);
    },
    getVisibleArea: function getVisibleArea() {
      var visibleArea = translator.getCanvasVisibleArea();
      return [visibleArea.min, visibleArea.max];
    },
    visualRange: _common.noop,
    calculateInterval: _common.noop,
    getMarginOptions: function getMarginOptions() {
      return {};
    }
  };
};

exports.createAxis = createAxis;

var generateDefaultCustomizeTooltipCallback = function generateDefaultCustomizeTooltipCallback(fontOptions, rtlEnabled) {
  var _ref = fontOptions !== null && fontOptions !== void 0 ? fontOptions : {},
      lineSpacing = _ref.lineSpacing,
      size = _ref.size;

  var lineHeight = (lineSpacing !== null && lineSpacing !== void 0 ? lineSpacing : DEFAULT_LINE_SPACING) + (size !== null && size !== void 0 ? size : 0);
  return function (customizeObject) {
    var _customizeObject$valu;

    var html = "";
    var vt = (_customizeObject$valu = customizeObject.valueTexts) !== null && _customizeObject$valu !== void 0 ? _customizeObject$valu : [];

    for (var i = 0; i < vt.length; i += 2) {
      html += "<tr><td>".concat(vt[i], "</td><td style='width: 15px'></td><td style='text-align: ").concat(rtlEnabled ? "left" : "right", "'>").concat(vt[i + 1], "</td></tr>");
    }

    return {
      html: "<table style='border-spacing:0px; line-height: ".concat(lineHeight, "px'>").concat(html, "</table>")
    };
  };
};

var generateCustomizeTooltipCallback = function generateCustomizeTooltipCallback(customizeTooltip, fontOptions, rtlEnabled) {
  var defaultCustomizeTooltip = generateDefaultCustomizeTooltipCallback(fontOptions, rtlEnabled);

  if ((0, _type.isFunction)(customizeTooltip)) {
    return function (customizeObject) {
      var _customizeTooltip$cal;

      var res = (_customizeTooltip$cal = customizeTooltip.call(customizeObject, customizeObject)) !== null && _customizeTooltip$cal !== void 0 ? _customizeTooltip$cal : {};

      if (!("html" in res) && !("text" in res)) {
        res = _extends({}, res, defaultCustomizeTooltip.call(customizeObject, customizeObject));
      }

      return res;
    };
  }

  return defaultCustomizeTooltip;
};

exports.generateCustomizeTooltipCallback = generateCustomizeTooltipCallback;
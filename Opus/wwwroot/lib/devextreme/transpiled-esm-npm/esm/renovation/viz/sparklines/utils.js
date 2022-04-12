import _extends from "@babel/runtime/helpers/esm/extends";
import { Translator2D } from "../../../viz/translators/translator2d";
import { noop } from "../../../core/utils/common";
import { isFunction } from "../../../core/utils/type";
var DEFAULT_LINE_SPACING = 2;
export var createAxis = isHorizontal => {
  var translator = new Translator2D({}, {}, {
    shiftZeroValue: !isHorizontal,
    isHorizontal: !!isHorizontal
  });
  return {
    getTranslator: () => translator,
    update: (range, canvas, options) => translator.update(range, canvas, options),
    getVisibleArea: () => {
      var visibleArea = translator.getCanvasVisibleArea();
      return [visibleArea.min, visibleArea.max];
    },
    visualRange: noop,
    calculateInterval: noop,
    getMarginOptions: () => ({})
  };
};

var generateDefaultCustomizeTooltipCallback = (fontOptions, rtlEnabled) => {
  var {
    lineSpacing,
    size
  } = fontOptions !== null && fontOptions !== void 0 ? fontOptions : {};
  var lineHeight = (lineSpacing !== null && lineSpacing !== void 0 ? lineSpacing : DEFAULT_LINE_SPACING) + (size !== null && size !== void 0 ? size : 0);
  return customizeObject => {
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

export var generateCustomizeTooltipCallback = (customizeTooltip, fontOptions, rtlEnabled) => {
  var defaultCustomizeTooltip = generateDefaultCustomizeTooltipCallback(fontOptions, rtlEnabled);

  if (isFunction(customizeTooltip)) {
    return customizeObject => {
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
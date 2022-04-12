"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _excel = _interopRequireDefault(require("./excel.tag_helper"));

var _excel2 = _interopRequireDefault(require("./excel.pattern_fill_helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fillHelper = {
  tryCreateTag: function tryCreateTag(sourceObj) {
    var result = null;

    if ((0, _type.isDefined)(sourceObj)) {
      result = {
        patternFill: _excel2.default.tryCreateTag(sourceObj.patternFill)
      };

      if (fillHelper.isEmpty(result)) {
        result = null;
      }
    }

    return result;
  },
  tryCreateFillFromSimpleFormat: function tryCreateFillFromSimpleFormat() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        backgroundColor = _ref.backgroundColor,
        fillPatternType = _ref.fillPatternType,
        fillPatternColor = _ref.fillPatternColor;

    if ((0, _type.isDefined)(backgroundColor) && !((0, _type.isDefined)(fillPatternType) && (0, _type.isDefined)(fillPatternColor))) {
      return {
        patternFill: {
          patternType: 'solid',
          foregroundColor: {
            rgb: backgroundColor
          }
        }
      };
    } else if ((0, _type.isDefined)(fillPatternType) && (0, _type.isDefined)(fillPatternColor)) {
      return {
        patternFill: {
          patternType: fillPatternType,
          foregroundColor: {
            rgb: fillPatternColor
          },
          backgroundColor: {
            rgb: backgroundColor
          }
        }
      };
    }
  },
  copySimpleFormat: function copySimpleFormat(source, target) {
    if (source.backgroundColor !== undefined) {
      target.backgroundColor = source.backgroundColor;
    }

    if (source.fillPatternType !== undefined) {
      target.fillPatternType = source.fillPatternType;
    }

    if (source.fillPatternColor !== undefined) {
      target.fillPatternColor = source.fillPatternColor;
    }
  },
  copy: function copy(source) {
    var result = null;

    if ((0, _type.isDefined)(source)) {
      result = {};

      if (source.patternFill !== undefined) {
        result.patternFill = _excel2.default.copy(source.patternFill);
      }
    }

    return result;
  },
  areEqual: function areEqual(leftTag, rightTag) {
    return fillHelper.isEmpty(leftTag) && fillHelper.isEmpty(rightTag) || (0, _type.isDefined)(leftTag) && (0, _type.isDefined)(rightTag) && _excel2.default.areEqual(leftTag.patternFill, rightTag.patternFill);
  },
  isEmpty: function isEmpty(tag) {
    return !(0, _type.isDefined)(tag) || _excel2.default.isEmpty(tag.patternFill);
  },
  toXml: function toXml(tag) {
    // §18.8.20 fill (Fill), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
    return _excel.default.toXml('fill', {}, _excel2.default.toXml(tag.patternFill));
  }
};
var _default = fillHelper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
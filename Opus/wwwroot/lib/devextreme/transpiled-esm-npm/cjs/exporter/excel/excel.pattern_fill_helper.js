"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _excel = _interopRequireDefault(require("./excel.tag_helper"));

var _excel2 = _interopRequireDefault(require("./excel.color_helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var patternFillHelper = {
  tryCreateTag: function tryCreateTag(sourceObj) {
    var result = null;

    if ((0, _type.isDefined)(sourceObj)) {
      result = {
        patternType: sourceObj.patternType,
        backgroundColor: _excel2.default.tryCreateTag(sourceObj.backgroundColor),
        foregroundColor: _excel2.default.tryCreateTag(sourceObj.foregroundColor)
      };

      if (patternFillHelper.isEmpty(result)) {
        result = null;
      }
    }

    return result;
  },
  copy: function copy(source) {
    var result = null;

    if ((0, _type.isDefined)(source)) {
      result = {};

      if (source.patternType !== undefined) {
        result.patternType = source.patternType;
      }

      if (source.backgroundColor !== undefined) {
        result.backgroundColor = _excel2.default.copy(source.backgroundColor);
      }

      if (source.foregroundColor !== undefined) {
        result.foregroundColor = _excel2.default.copy(source.foregroundColor);
      }
    }

    return result;
  },
  areEqual: function areEqual(leftTag, rightTag) {
    return patternFillHelper.isEmpty(leftTag) && patternFillHelper.isEmpty(rightTag) || (0, _type.isDefined)(leftTag) && (0, _type.isDefined)(rightTag) && leftTag.patternType === rightTag.patternType && _excel2.default.areEqual(leftTag.backgroundColor, rightTag.backgroundColor) && _excel2.default.areEqual(leftTag.foregroundColor, rightTag.foregroundColor);
  },
  isEmpty: function isEmpty(tag) {
    return !(0, _type.isDefined)(tag) || !(0, _type.isDefined)(tag.patternType);
  },
  toXml: function toXml(tag) {
    var content = [(0, _type.isDefined)(tag.foregroundColor) ? _excel2.default.toXml('fgColor', tag.foregroundColor) : '', // 18.8.19 fgColor (Foreground Color)
    (0, _type.isDefined)(tag.backgroundColor) ? _excel2.default.toXml('bgColor', tag.backgroundColor) : '' // 18.8.3 bgColor (Background Color)
    ].join(''); // §18.8.32 patternFill (Pattern), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)

    return _excel.default.toXml('patternFill', {
      patternType: tag.patternType
    }, // 18.18.55 ST_PatternType (Pattern Type)
    content);
  }
};
var _default = patternFillHelper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
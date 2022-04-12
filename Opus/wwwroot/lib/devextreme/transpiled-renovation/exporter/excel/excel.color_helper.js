"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _excel = _interopRequireDefault(require("./excel.tag_helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var colorHelper = {
  _tryConvertColor: function _tryConvertColor(source) {
    if (typeof source !== 'string') {
      return source;
    }

    var result;

    if (source.length > 0 && source[0] === '#') {
      var colorCode = source.substr(1, source.length);

      if (colorCode.length === 6) {
        // RRGGBB
        result = 'FF' + colorCode;
      } else if (colorCode.length === 8) {
        // RRGGBBAA
        result = colorCode[6] + colorCode[7] + colorCode.substr(0, 6);
      } else {
        result = colorCode;
      }
    } else {
      result = source;
    }

    return result;
  },
  tryCreateTag: function tryCreateTag(sourceObj) {
    var result = null;

    if ((0, _type.isDefined)(sourceObj)) {
      if (typeof sourceObj === 'string') {
        result = {
          rgb: this._tryConvertColor(sourceObj)
        };
      } else {
        result = {
          rgb: this._tryConvertColor(sourceObj.rgb),
          theme: sourceObj.theme
        };
      }

      if (colorHelper.isEmpty(result)) {
        result = null;
      }
    }

    return result;
  },
  copy: function copy(source) {
    var result = null;

    if ((0, _type.isDefined)(source)) {
      if (typeof source === 'string') {
        result = source;
      } else {
        result = {};

        if (source.rgb !== undefined) {
          result.rgb = source.rgb;
        }

        if (source.theme !== undefined) {
          result.theme = source.theme;
        }
      }
    }

    return result;
  },
  isEmpty: function isEmpty(tag) {
    return !(0, _type.isDefined)(tag) || !(0, _type.isDefined)(tag.rgb) && !(0, _type.isDefined)(tag.theme);
  },
  areEqual: function areEqual(leftTag, rightTag) {
    return colorHelper.isEmpty(leftTag) && colorHelper.isEmpty(rightTag) || (0, _type.isDefined)(leftTag) && (0, _type.isDefined)(rightTag) && leftTag.rgb === rightTag.rgb && leftTag.theme === rightTag.theme;
  },
  toXml: function toXml(tagName, tag) {
    // 'CT_Color', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
    return _excel.default.toXml(tagName, {
      rgb: tag.rgb,
      theme: tag.theme
    });
  }
};
var _default = colorHelper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _excel = _interopRequireDefault(require("./excel.tag_helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cellAlignmentHelper = {
  tryCreateTag: function tryCreateTag(sourceObj) {
    var result = null;

    if ((0, _type.isDefined)(sourceObj)) {
      result = {
        vertical: sourceObj.vertical,
        wrapText: sourceObj.wrapText,
        horizontal: sourceObj.horizontal
      };

      if (cellAlignmentHelper.isEmpty(result)) {
        result = null;
      }
    }

    return result;
  },
  copy: function copy(source) {
    var result = null;

    if ((0, _type.isDefined)(source)) {
      result = {};

      if (source.horizontal !== undefined) {
        result.horizontal = source.horizontal;
      }

      if (source.vertical !== undefined) {
        result.vertical = source.vertical;
      }

      if (source.wrapText !== undefined) {
        result.wrapText = source.wrapText;
      }
    }

    return result;
  },
  areEqual: function areEqual(leftTag, rightTag) {
    return cellAlignmentHelper.isEmpty(leftTag) && cellAlignmentHelper.isEmpty(rightTag) || (0, _type.isDefined)(leftTag) && (0, _type.isDefined)(rightTag) && leftTag.vertical === rightTag.vertical && leftTag.wrapText === rightTag.wrapText && leftTag.horizontal === rightTag.horizontal;
  },
  isEmpty: function isEmpty(tag) {
    return !(0, _type.isDefined)(tag) || !(0, _type.isDefined)(tag.vertical) && !(0, _type.isDefined)(tag.wrapText) && !(0, _type.isDefined)(tag.horizontal);
  },
  toXml: function toXml(tag) {
    // §18.8.1 alignment (Alignment), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
    return _excel.default.toXml('alignment', {
      vertical: tag.vertical,
      // 18.18.88 ST_VerticalAlignment (Vertical Alignment Types)
      wrapText: (0, _type.isDefined)(tag.wrapText) ? Number(tag.wrapText) : undefined,
      horizontal: tag.horizontal // 18.18.40 ST_HorizontalAlignment (Horizontal Alignment Type)

    });
  }
};
var _default = cellAlignmentHelper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
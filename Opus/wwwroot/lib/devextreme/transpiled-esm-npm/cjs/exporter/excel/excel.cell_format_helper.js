"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _excel = _interopRequireDefault(require("./excel.tag_helper"));

var _excel2 = _interopRequireDefault(require("./excel.cell_alignment_helper"));

var _excel3 = _interopRequireDefault(require("./excel.fill_helper"));

var _excel4 = _interopRequireDefault(require("./excel.font_helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cellFormatHelper = {
  tryCreateTag: function tryCreateTag(sourceObj, sharedItemsContainer) {
    var result = null;

    if ((0, _type.isDefined)(sourceObj)) {
      var numberFormatId;

      if (typeof sourceObj.numberFormat === 'number') {
        numberFormatId = sourceObj.numberFormat;
      } else {
        numberFormatId = sharedItemsContainer.registerNumberFormat(sourceObj.numberFormat);
      }

      var fill = sourceObj.fill;

      if (!(0, _type.isDefined)(fill)) {
        fill = _excel3.default.tryCreateFillFromSimpleFormat(sourceObj);
      }

      result = {
        numberFormatId: numberFormatId,
        alignment: _excel2.default.tryCreateTag(sourceObj.alignment),
        fontId: sharedItemsContainer.registerFont(sourceObj.font),
        fillId: sharedItemsContainer.registerFill(fill)
      };

      if (cellFormatHelper.isEmpty(result)) {
        result = null;
      }
    }

    return result;
  },
  copy: function copy(source) {
    var result;

    if (source === null) {
      result = null;
    } else if ((0, _type.isDefined)(source)) {
      result = {};

      if (source.numberFormat !== undefined) {
        result.numberFormat = source.numberFormat;
      }

      if (source.fill !== undefined) {
        result.fill = _excel3.default.copy(source.fill);
      } else {
        _excel3.default.copySimpleFormat(source, result);
      }

      if (source.alignment !== undefined) {
        result.alignment = _excel2.default.copy(source.alignment);
      }

      if (source.font !== undefined) {
        result.font = _excel4.default.copy(source.font);
      }
    }

    return result;
  },
  areEqual: function areEqual(leftTag, rightTag) {
    return cellFormatHelper.isEmpty(leftTag) && cellFormatHelper.isEmpty(rightTag) || (0, _type.isDefined)(leftTag) && (0, _type.isDefined)(rightTag) && leftTag.fontId === rightTag.fontId && leftTag.numberFormatId === rightTag.numberFormatId && leftTag.fillId === rightTag.fillId && _excel2.default.areEqual(leftTag.alignment, rightTag.alignment);
  },
  isEmpty: function isEmpty(tag) {
    return !(0, _type.isDefined)(tag) || !(0, _type.isDefined)(tag.fontId) && !(0, _type.isDefined)(tag.numberFormatId) && !(0, _type.isDefined)(tag.fillId) && _excel2.default.isEmpty(tag.alignment);
  },
  toXml: function toXml(tag) {
    var isAlignmentEmpty = _excel2.default.isEmpty(tag.alignment);

    var applyNumberFormat;

    if ((0, _type.isDefined)(tag.numberFormatId)) {
      applyNumberFormat = tag.numberFormatId > 0 ? 1 : 0;
    } // §18.8.45 xf (Format), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)


    return _excel.default.toXml('xf', {
      'xfId': 0,
      applyAlignment: isAlignmentEmpty ? null : 1,
      fontId: tag.fontId,
      applyNumberFormat: applyNumberFormat,
      fillId: tag.fillId,
      'numFmtId': tag.numberFormatId
    }, isAlignmentEmpty ? null : _excel2.default.toXml(tag.alignment));
  }
};
var _default = cellFormatHelper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
import { isDefined } from '../../core/utils/type';
import tagHelper from './excel.tag_helper';
import cellAlignmentHelper from './excel.cell_alignment_helper';
import fillHelper from './excel.fill_helper';
import fontHelper from './excel.font_helper';
var cellFormatHelper = {
  tryCreateTag: function tryCreateTag(sourceObj, sharedItemsContainer) {
    var result = null;

    if (isDefined(sourceObj)) {
      var numberFormatId;

      if (typeof sourceObj.numberFormat === 'number') {
        numberFormatId = sourceObj.numberFormat;
      } else {
        numberFormatId = sharedItemsContainer.registerNumberFormat(sourceObj.numberFormat);
      }

      var fill = sourceObj.fill;

      if (!isDefined(fill)) {
        fill = fillHelper.tryCreateFillFromSimpleFormat(sourceObj);
      }

      result = {
        numberFormatId,
        alignment: cellAlignmentHelper.tryCreateTag(sourceObj.alignment),
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
    } else if (isDefined(source)) {
      result = {};

      if (source.numberFormat !== undefined) {
        result.numberFormat = source.numberFormat;
      }

      if (source.fill !== undefined) {
        result.fill = fillHelper.copy(source.fill);
      } else {
        fillHelper.copySimpleFormat(source, result);
      }

      if (source.alignment !== undefined) {
        result.alignment = cellAlignmentHelper.copy(source.alignment);
      }

      if (source.font !== undefined) {
        result.font = fontHelper.copy(source.font);
      }
    }

    return result;
  },
  areEqual: function areEqual(leftTag, rightTag) {
    return cellFormatHelper.isEmpty(leftTag) && cellFormatHelper.isEmpty(rightTag) || isDefined(leftTag) && isDefined(rightTag) && leftTag.fontId === rightTag.fontId && leftTag.numberFormatId === rightTag.numberFormatId && leftTag.fillId === rightTag.fillId && cellAlignmentHelper.areEqual(leftTag.alignment, rightTag.alignment);
  },
  isEmpty: function isEmpty(tag) {
    return !isDefined(tag) || !isDefined(tag.fontId) && !isDefined(tag.numberFormatId) && !isDefined(tag.fillId) && cellAlignmentHelper.isEmpty(tag.alignment);
  },
  toXml: function toXml(tag) {
    var isAlignmentEmpty = cellAlignmentHelper.isEmpty(tag.alignment);
    var applyNumberFormat;

    if (isDefined(tag.numberFormatId)) {
      applyNumberFormat = tag.numberFormatId > 0 ? 1 : 0;
    } // §18.8.45 xf (Format), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)


    return tagHelper.toXml('xf', {
      'xfId': 0,
      applyAlignment: isAlignmentEmpty ? null : 1,
      fontId: tag.fontId,
      applyNumberFormat,
      fillId: tag.fillId,
      'numFmtId': tag.numberFormatId
    }, isAlignmentEmpty ? null : cellAlignmentHelper.toXml(tag.alignment));
  }
};
export default cellFormatHelper;
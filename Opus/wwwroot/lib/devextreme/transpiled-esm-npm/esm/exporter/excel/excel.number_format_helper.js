import { isDefined } from '../../core/utils/type';
import tagHelper from './excel.tag_helper';
var numberFormatHelper = {
  ID_PROPERTY_NAME: 'id',
  tryCreateTag: function tryCreateTag(sourceObj) {
    var result = null;

    if (typeof sourceObj === 'string') {
      result = {
        formatCode: sourceObj
      };

      if (numberFormatHelper.isEmpty(result)) {
        result = null;
      }
    }

    return result;
  },
  areEqual: function areEqual(leftTag, rightTag) {
    return numberFormatHelper.isEmpty(leftTag) && numberFormatHelper.isEmpty(rightTag) || isDefined(leftTag) && isDefined(rightTag) && leftTag.formatCode === rightTag.formatCode;
  },
  isEmpty: function isEmpty(tag) {
    return !isDefined(tag) || !isDefined(tag.formatCode) || tag.formatCode === '';
  },
  toXml: function toXml(tag) {
    // §18.8.30 numFmt (Number Format)
    return tagHelper.toXml('numFmt', {
      'numFmtId': tag[numberFormatHelper.ID_PROPERTY_NAME],
      formatCode: tag.formatCode // §21.2.2.71 formatCode (Format Code), §18.8.31 numFmts (Number Formats)

    });
  }
};
export default numberFormatHelper;
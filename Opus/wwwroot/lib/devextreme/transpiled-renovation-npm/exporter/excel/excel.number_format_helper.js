"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _excel = _interopRequireDefault(require("./excel.tag_helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    return numberFormatHelper.isEmpty(leftTag) && numberFormatHelper.isEmpty(rightTag) || (0, _type.isDefined)(leftTag) && (0, _type.isDefined)(rightTag) && leftTag.formatCode === rightTag.formatCode;
  },
  isEmpty: function isEmpty(tag) {
    return !(0, _type.isDefined)(tag) || !(0, _type.isDefined)(tag.formatCode) || tag.formatCode === '';
  },
  toXml: function toXml(tag) {
    // §18.8.30 numFmt (Number Format)
    return _excel.default.toXml('numFmt', {
      'numFmtId': tag[numberFormatHelper.ID_PROPERTY_NAME],
      formatCode: tag.formatCode // §21.2.2.71 formatCode (Format Code), §18.8.31 numFmts (Number Formats)

    });
  }
};
var _default = numberFormatHelper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
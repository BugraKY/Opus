"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var tagHelper = {
  toXml: function toXml(tagName, attributes, content) {
    var result = ['<', tagName];

    for (var attributeName in attributes) {
      var attributeValue = attributes[attributeName];

      if ((0, _type.isDefined)(attributeValue)) {
        result.push(' ', attributeName, '="', attributeValue, '"');
      }
    }

    if ((0, _type.isDefined)(content) && content !== '') {
      result.push('>', content, '</', tagName, '>');
    } else {
      result.push(' />');
    }

    return result.join('');
  }
};
var _default = tagHelper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
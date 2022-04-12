import { isDefined } from '../../core/utils/type';
var tagHelper = {
  toXml: function toXml(tagName, attributes, content) {
    var result = ['<', tagName];

    for (var attributeName in attributes) {
      var attributeValue = attributes[attributeName];

      if (isDefined(attributeValue)) {
        result.push(' ', attributeName, '="', attributeValue, '"');
      }
    }

    if (isDefined(content) && content !== '') {
      result.push('>', content, '</', tagName, '>');
    } else {
      result.push(' />');
    }

    return result.join('');
  }
};
export default tagHelper;
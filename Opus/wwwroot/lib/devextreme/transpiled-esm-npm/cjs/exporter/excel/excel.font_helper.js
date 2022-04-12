"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _excel = _interopRequireDefault(require("./excel.tag_helper"));

var _excel2 = _interopRequireDefault(require("./excel.color_helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fontHelper = {
  tryCreateTag: function tryCreateTag(sourceObj) {
    var result = null;

    if ((0, _type.isDefined)(sourceObj)) {
      result = {
        size: sourceObj.size,
        name: sourceObj.name,
        family: sourceObj.family,
        scheme: sourceObj.scheme,
        bold: sourceObj.bold,
        italic: sourceObj.italic,
        underline: sourceObj.underline,
        color: _excel2.default.tryCreateTag(sourceObj.color)
      };

      if (fontHelper.isEmpty(result)) {
        result = null;
      }
    }

    return result;
  },
  copy: function copy(source) {
    var result = null;

    if ((0, _type.isDefined)(source)) {
      result = {};

      if (source.size !== undefined) {
        result.size = source.size;
      }

      if (source.name !== undefined) {
        result.name = source.name;
      }

      if (source.family !== undefined) {
        result.family = source.family;
      }

      if (source.scheme !== undefined) {
        result.scheme = source.scheme;
      }

      if (source.bold !== undefined) {
        result.bold = source.bold;
      }

      if (source.italic !== undefined) {
        result.italic = source.italic;
      }

      if (source.underline !== undefined) {
        result.underline = source.underline;
      }

      if (source.color !== undefined) {
        result.color = _excel2.default.copy(source.color);
      }
    }

    return result;
  },
  areEqual: function areEqual(leftTag, rightTag) {
    return fontHelper.isEmpty(leftTag) && fontHelper.isEmpty(rightTag) || (0, _type.isDefined)(leftTag) && (0, _type.isDefined)(rightTag) && leftTag.size === rightTag.size && leftTag.name === rightTag.name && leftTag.family === rightTag.family && leftTag.scheme === rightTag.scheme && (leftTag.bold === rightTag.bold || !leftTag.bold === !rightTag.bold) && (leftTag.italic === rightTag.italic || !leftTag.italic === !rightTag.italic) && leftTag.underline === rightTag.underline && _excel2.default.areEqual(leftTag.color, rightTag.color);
  },
  isEmpty: function isEmpty(tag) {
    return !(0, _type.isDefined)(tag) || !(0, _type.isDefined)(tag.size) && !(0, _type.isDefined)(tag.name) && !(0, _type.isDefined)(tag.family) && !(0, _type.isDefined)(tag.scheme) && (!(0, _type.isDefined)(tag.bold) || !tag.bold) && (!(0, _type.isDefined)(tag.italic) || !tag.italic) && !(0, _type.isDefined)(tag.underline) && _excel2.default.isEmpty(tag.color);
  },
  toXml: function toXml(tag) {
    var content = [(0, _type.isDefined)(tag.bold) && tag.bold ? _excel.default.toXml('b', {}) : '', // 18.8.2 b (Bold)
    (0, _type.isDefined)(tag.size) ? _excel.default.toXml('sz', {
      'val': tag.size
    }) : '', // 18.4.11 sz (Font Size)
    (0, _type.isDefined)(tag.color) ? _excel2.default.toXml('color', tag.color) : '', (0, _type.isDefined)(tag.name) ? _excel.default.toXml('name', {
      'val': tag.name
    }) : '', // 18.8.29 name (Font Name)
    (0, _type.isDefined)(tag.family) ? _excel.default.toXml('family', {
      'val': tag.family
    }) : '', // 18.8.18 family (Font Family)
    (0, _type.isDefined)(tag.scheme) ? _excel.default.toXml('scheme', {
      'val': tag.scheme
    }) : '', // 18.8.35 scheme (Scheme)
    (0, _type.isDefined)(tag.italic) && tag.italic ? _excel.default.toXml('i', {}) : '', // 18.8.26 i (Italic)
    (0, _type.isDefined)(tag.underline) ? _excel.default.toXml('u', {
      'val': tag.underline
    }) : '' // 18.4.13 u (Underline)
    ].join(''); // §18.8.22, 'font (Font)', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)

    return _excel.default.toXml('font', {}, content);
  }
};
var _default = fontHelper;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
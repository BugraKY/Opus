"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _excel = _interopRequireDefault(require("./excel.tag_helper"));

var _excel2 = _interopRequireDefault(require("./excel.cell_format_helper"));

var _excel3 = _interopRequireDefault(require("./excel.fill_helper"));

var _excel4 = _interopRequireDefault(require("./excel.font_helper"));

var _excel5 = _interopRequireDefault(require("./excel.number_format_helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ExcelFile = /*#__PURE__*/function () {
  function ExcelFile() {
    this._cellFormatTags = [];
    this._fillTags = [];
    this._fontTags = [];
    this._numberFormatTags = []; // the [0, 1] indexes are reserved:
    // - https://stackoverflow.com/questions/11116176/cell-styles-in-openxml-spreadsheet-spreadsheetml
    // - https://social.msdn.microsoft.com/Forums/office/en-US/a973335c-9f9b-4e70-883a-02a0bcff43d2/coloring-cells-in-excel-sheet-using-openxml-in-c

    this._fillTags.push(_excel3.default.tryCreateTag({
      patternFill: {
        patternType: 'none'
      }
    }));
  }

  var _proto = ExcelFile.prototype;

  _proto.registerCellFormat = function registerCellFormat(cellFormat) {
    var result;

    var cellFormatTag = _excel2.default.tryCreateTag(cellFormat, {
      registerFill: this.registerFill.bind(this),
      registerFont: this.registerFont.bind(this),
      registerNumberFormat: this.registerNumberFormat.bind(this)
    });

    if ((0, _type.isDefined)(cellFormatTag)) {
      for (var i = 0; i < this._cellFormatTags.length; i++) {
        if (_excel2.default.areEqual(this._cellFormatTags[i], cellFormatTag)) {
          result = i;
          break;
        }
      }

      if (result === undefined) {
        result = this._cellFormatTags.push(cellFormatTag) - 1;
      }
    }

    return result;
  };

  ExcelFile.copyCellFormat = function copyCellFormat(source) {
    return _excel2.default.copy(source);
  };

  _proto.generateCellFormatsXml = function generateCellFormatsXml() {
    // §18.8.10 cellXfs (Cell Formats), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
    var cellFormatTagsAsXmlStringsArray = this._cellFormatTags.map(function (tag) {
      return _excel2.default.toXml(tag);
    });

    return _excel.default.toXml('cellXfs', {
      count: cellFormatTagsAsXmlStringsArray.length
    }, cellFormatTagsAsXmlStringsArray.join(''));
  };

  _proto.registerFill = function registerFill(fill) {
    var result;

    var fillTag = _excel3.default.tryCreateTag(fill);

    if ((0, _type.isDefined)(fillTag)) {
      for (var i = 0; i < this._fillTags.length; i++) {
        if (_excel3.default.areEqual(this._fillTags[i], fillTag)) {
          result = i;
          break;
        }
      }

      if (result === undefined) {
        if (this._fillTags.length < 2) {
          // the [0, 1] indexes are reserved:
          // - https://stackoverflow.com/questions/11116176/cell-styles-in-openxml-spreadsheet-spreadsheetml
          // - https://social.msdn.microsoft.com/Forums/office/en-US/a973335c-9f9b-4e70-883a-02a0bcff43d2/coloring-cells-in-excel-sheet-using-openxml-in-c
          this._fillTags.push(_excel3.default.tryCreateTag({
            patternFill: {
              patternType: 'Gray125'
            }
          })); // Index 1 - reserved

        }

        result = this._fillTags.push(fillTag) - 1;
      }
    }

    return result;
  };

  _proto.generateFillsXml = function generateFillsXml() {
    // §18.8.21, 'fills (Fills)', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
    var tagsAsXmlStringsArray = this._fillTags.map(function (tag) {
      return _excel3.default.toXml(tag);
    });

    return _excel.default.toXml('fills', {
      count: tagsAsXmlStringsArray.length
    }, tagsAsXmlStringsArray.join(''));
  };

  _proto.registerFont = function registerFont(font) {
    var result;

    var fontTag = _excel4.default.tryCreateTag(font);

    if ((0, _type.isDefined)(fontTag)) {
      for (var i = 0; i < this._fontTags.length; i++) {
        if (_excel4.default.areEqual(this._fontTags[i], fontTag)) {
          result = i;
          break;
        }
      }

      if (result === undefined) {
        result = this._fontTags.push(fontTag) - 1;
      }
    }

    return result;
  };

  _proto.generateFontsXml = function generateFontsXml() {
    // §18.8.23, 'fonts (Fonts)', 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
    var xmlStringsArray = this._fontTags.map(function (tag) {
      return _excel4.default.toXml(tag);
    });

    return _excel.default.toXml('fonts', {
      count: xmlStringsArray.length
    }, xmlStringsArray.join(''));
  };

  _proto._convertNumberFormatIndexToId = function _convertNumberFormatIndexToId(index) {
    // Number format ids less than 164 (magic const) represent builtin formats.
    // §18.8.30 numFmt (Number Format), 'ECMA-376 5th edition Part 1' (http://www.ecma-international.org/publications/standards/Ecma-376.htm)
    var CUSTOM_FORMAT_ID_START_VALUE = 165;
    return CUSTOM_FORMAT_ID_START_VALUE + index;
  };

  _proto.registerNumberFormat = function registerNumberFormat(numberFormat) {
    var result;

    var tag = _excel5.default.tryCreateTag(numberFormat);

    if ((0, _type.isDefined)(tag)) {
      for (var i = 0; i < this._numberFormatTags.length; i++) {
        if (_excel5.default.areEqual(this._numberFormatTags[i], tag)) {
          result = this._numberFormatTags[i][_excel5.default.ID_PROPERTY_NAME];
          break;
        }
      }

      if (result === undefined) {
        tag[_excel5.default.ID_PROPERTY_NAME] = this._convertNumberFormatIndexToId(this._numberFormatTags.length);
        result = tag[_excel5.default.ID_PROPERTY_NAME];

        this._numberFormatTags.push(tag);
      }
    }

    return result;
  };

  _proto.generateNumberFormatsXml = function generateNumberFormatsXml() {
    if (this._numberFormatTags.length > 0) {
      // §18.8.31 numFmts (Number Formats)
      var xmlStringsArray = this._numberFormatTags.map(function (tag) {
        return _excel5.default.toXml(tag);
      });

      return _excel.default.toXml('numFmts', {
        count: xmlStringsArray.length
      }, xmlStringsArray.join(''));
    } else {
      return '';
    }
  };

  return ExcelFile;
}();

exports.default = ExcelFile;
module.exports = exports.default;
module.exports.default = exports.default;
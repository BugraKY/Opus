"use strict";

exports.drawCellsContent = drawCellsContent;
exports.drawCellsLines = drawCellsLines;
exports.drawGridLines = drawGridLines;
exports.drawLine = drawLine;
exports.drawRect = drawRect;
exports.drawTextInRect = drawTextInRect;
exports.getDocumentStyles = getDocumentStyles;
exports.setDocumentStyles = setDocumentStyles;

var _type = require("../../../core/utils/type");

var _extend = require("../../../core/utils/extend");

var _pdf_utils_v = require("./pdf_utils_v3");

var _excluded = ["_rect", "pdfRowInfo", "gridCell"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var defaultBorderLineWidth = 1;

function round(value) {
  return Math.round(value * 1000) / 1000; // checked with browser zoom - 500%
}

function drawCellsContent(doc, customDrawCell, cellsArray, docStyles) {
  cellsArray.forEach(function (cell) {
    var _rect = cell._rect,
        pdfRowInfo = cell.pdfRowInfo,
        gridCell = cell.gridCell,
        pdfCell = _objectWithoutProperties(cell, _excluded);

    var eventArg = {
      doc: doc,
      rect: _rect,
      pdfCell: pdfCell,
      gridCell: gridCell,
      cancel: false
    };
    customDrawCell === null || customDrawCell === void 0 ? void 0 : customDrawCell(eventArg);

    if (!eventArg.cancel) {
      drawCellBackground(doc, cell);
      drawCellText(doc, cell, docStyles);
    }
  });
}

function drawLine(doc, startX, startY, endX, endY) {
  doc.line(round(startX), round(startY), round(endX), round(endY));
}

function drawRect(doc, x, y, width, height, style) {
  if ((0, _type.isDefined)(style)) {
    doc.rect(round(x), round(y), round(width), round(height), style);
  } else {
    doc.rect(round(x), round(y), round(width), round(height));
  }
}

function getLineHeightShift(doc) {
  var DEFAULT_LINE_HEIGHT = 1.15; // TODO: check lineHeightFactor from text options. Currently supports only doc options - https://github.com/MrRio/jsPDF/issues/3234

  return (doc.getLineHeightFactor() - DEFAULT_LINE_HEIGHT) * doc.getFontSize();
}

function drawTextInRect(doc, text, rect, verticalAlign, horizontalAlign, wordWrapEnabled) {
  var textArray = (0, _pdf_utils_v.getTextLines)(doc, text, doc.getFont(), {
    wordWrapEnabled: wordWrapEnabled,
    targetRectWidth: rect.w
  });
  var linesCount = textArray.length;
  var heightOfOneLine = (0, _pdf_utils_v.calculateTextHeight)(doc, textArray[0], doc.getFont(), {
    wordWrapEnabled: false
  });
  var vAlign = verticalAlign !== null && verticalAlign !== void 0 ? verticalAlign : 'middle';
  var hAlign = horizontalAlign !== null && horizontalAlign !== void 0 ? horizontalAlign : 'left';
  var verticalAlignCoefficientsMap = {
    top: 0,
    middle: 0.5,
    bottom: 1
  };
  var horizontalAlignMap = {
    left: 0,
    center: 0.5,
    right: 1
  };
  var y = rect.y + rect.h * verticalAlignCoefficientsMap[vAlign] - heightOfOneLine * (linesCount - 1) * verticalAlignCoefficientsMap[vAlign] + getLineHeightShift(doc);
  var x = rect.x + rect.w * horizontalAlignMap[hAlign];
  doc.text(textArray.join('\n'), round(x), round(y), {
    baseline: vAlign,
    align: hAlign
  });
}

function drawCellBackground(doc, cell) {
  if ((0, _type.isDefined)(cell.backgroundColor)) {
    if (cell.backgroundColor !== doc.getFillColor()) {
      callMethodWithColorParameter(doc, 'setFillColor', cell.backgroundColor);
    }

    drawRect(doc, cell._rect.x, cell._rect.y, cell._rect.w, cell._rect.h, 'F');
  }
}

function drawCellText(doc, cell, docStyles) {
  if ((0, _type.isDefined)(cell.text) && cell.text !== '') {
    // TODO: use cell.text.trim() ?
    var textColor = cell.textColor,
        font = cell.font,
        _rect = cell._rect,
        padding = cell.padding;
    setTextStyles(doc, {
      textColor: textColor,
      font: font
    }, docStyles);
    var textRect = {
      x: _rect.x + padding.left,
      y: _rect.y + padding.top,
      w: _rect.w - (padding.left + padding.right),
      h: _rect.h - (padding.top + padding.bottom)
    };
    drawTextInRect(doc, cell.text, textRect, cell.verticalAlign, cell.horizontalAlign, cell.wordWrapEnabled);
  }
}

function drawCellsLines(doc, cellsArray, docStyles) {
  cellsArray.filter(function (cell) {
    return !(0, _type.isDefined)(cell.borderColor);
  }).forEach(function (cell) {
    drawBorders(doc, cell._rect, cell, docStyles);
  });
  cellsArray.filter(function (cell) {
    return (0, _type.isDefined)(cell.borderColor);
  }).forEach(function (cell) {
    drawBorders(doc, cell._rect, cell, docStyles);
  });
}

function drawGridLines(doc, rect, docStyles) {
  drawBorders(doc, rect, {}, docStyles);
}

function drawBorders(doc, rect, _ref, docStyles) {
  var borderColor = _ref.borderColor,
      _ref$drawLeftBorder = _ref.drawLeftBorder,
      drawLeftBorder = _ref$drawLeftBorder === void 0 ? true : _ref$drawLeftBorder,
      _ref$drawRightBorder = _ref.drawRightBorder,
      drawRightBorder = _ref$drawRightBorder === void 0 ? true : _ref$drawRightBorder,
      _ref$drawTopBorder = _ref.drawTopBorder,
      drawTopBorder = _ref$drawTopBorder === void 0 ? true : _ref$drawTopBorder,
      _ref$drawBottomBorder = _ref.drawBottomBorder,
      drawBottomBorder = _ref$drawBottomBorder === void 0 ? true : _ref$drawBottomBorder;

  if (!(0, _type.isDefined)(rect)) {
    throw 'rect is required';
  }

  if (!drawLeftBorder && !drawRightBorder && !drawTopBorder && !drawBottomBorder) {
    return;
  } else if (drawLeftBorder && drawRightBorder && drawTopBorder && drawBottomBorder) {
    setLinesStyles(doc, {
      borderColor: borderColor
    }, docStyles);
    drawRect(doc, rect.x, rect.y, rect.w, rect.h);
  } else {
    setLinesStyles(doc, {
      borderColor: borderColor
    }, docStyles);

    if (drawTopBorder) {
      drawLine(doc, rect.x, rect.y, rect.x + rect.w, rect.y); // top
    }

    if (drawLeftBorder) {
      drawLine(doc, rect.x, rect.y, rect.x, rect.y + rect.h); // left
    }

    if (drawRightBorder) {
      drawLine(doc, rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h); // right
    }

    if (drawBottomBorder) {
      drawLine(doc, rect.x, rect.y + rect.h, rect.x + rect.w, rect.y + rect.h); // bottom
    }
  }
}

function setTextStyles(doc, _ref2, docStyles) {
  var textColor = _ref2.textColor,
      font = _ref2.font;
  var currentTextColor = (0, _type.isDefined)(textColor) ? textColor : docStyles.textColor;

  if (currentTextColor !== doc.getTextColor()) {
    callMethodWithColorParameter(doc, 'setTextColor', currentTextColor);
  }

  var currentFont = (0, _type.isDefined)(font) ? (0, _extend.extend)({}, docStyles.font, font) : docStyles.font;
  var docFont = doc.getFont();

  if (currentFont.name !== docFont.fontName || currentFont.style !== docFont.fontStyle || (0, _type.isDefined)(currentFont.weight) // fontWeight logic, https://raw.githack.com/MrRio/jsPDF/master/docs/jspdf.js.html#line4842
  ) {
    doc.setFont(currentFont.name, currentFont.style, currentFont.weight);
  }

  if (currentFont.size !== doc.getFontSize()) {
    doc.setFontSize(currentFont.size);
  }
}

function setLinesStyles(doc, _ref3, docStyles) {
  var borderColor = _ref3.borderColor;
  doc.setLineWidth(defaultBorderLineWidth);
  var currentBorderColor = (0, _type.isDefined)(borderColor) ? borderColor : docStyles.borderColor;

  if (currentBorderColor !== doc.getDrawColor()) {
    callMethodWithColorParameter(doc, 'setDrawColor', currentBorderColor);
  }
}

function callMethodWithColorParameter(doc, method, color) {
  if (!(0, _type.isObject)(color)) {
    doc[method](color);
  } else {
    var argsCount = Object.keys(color).length;

    if (argsCount === 3) {
      doc[method](color.ch1, color.ch2, color.ch3);
    } else if (argsCount === 4) {
      doc[method](color.ch1, color.ch2, color.ch3, color.ch4);
    } else {
      throw Error("An incorrect color object was passed: 3 or 4 members are expected while the passed object has ".concat(argsCount, " members"));
    }
  }
}

function getDocumentStyles(doc) {
  var docFont = doc.getFont();
  return {
    borderColor: doc.getDrawColor(),
    font: {
      name: docFont.fontName,
      style: docFont.fontStyle,
      size: doc.getFontSize()
    },
    textColor: doc.getTextColor()
  };
}

function setDocumentStyles(doc, styles) {
  var borderColor = styles.borderColor,
      font = styles.font,
      textColor = styles.textColor;
  var docFont = doc.getFont();

  if (docFont.fontName !== font.name || docFont.fontStyle !== font.style) {
    doc.setFont(font.name, font.style, undefined);
  }

  var docFontSize = doc.getFontSize();

  if (docFontSize !== font.size) {
    doc.setFontSize(font.size);
  }

  if (doc.getDrawColor() !== borderColor) {
    doc.setDrawColor(borderColor);
  }

  if (doc.getTextColor() !== textColor) {
    doc.setTextColor(textColor);
  }
}
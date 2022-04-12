import { BaseIndicator, BaseTextCloudMarker, BaseRangeBar } from './base_indicators';
var _Number = Number;
import { normalizeEnum as _normalizeEnum } from '../core/utils';
var SimpleIndicator = BaseIndicator.inherit({
  _move: function _move() {
    var that = this;
    var delta = that._actualPosition - that._zeroPosition;

    that._rootElement.move(that.vertical ? 0 : delta, that.vertical ? delta : 0);

    that._trackerElement && that._trackerElement.move(that.vertical ? 0 : delta, that.vertical ? delta : 0);
  },
  _isEnabled: function _isEnabled() {
    this.vertical = this._options.vertical;
    return this._options.length > 0 && this._options.width > 0;
  },
  _isVisible: function _isVisible() {
    return true;
  },
  _getTrackerSettings: function _getTrackerSettings() {
    var options = this._options;
    var x1;
    var x2;
    var y1;
    var y2;
    var width = options.width / 2;
    var length = options.length / 2;
    var p = this._zeroPosition;
    width > 10 || (width = 10);
    length > 10 || (length = 10);

    if (this.vertical) {
      x1 = options.x - length;
      x2 = options.x + length;
      y1 = p + width;
      y2 = p - width;
    } else {
      x1 = p - width;
      x2 = p + width;
      y1 = options.y + length;
      y2 = options.y - length;
    }

    return {
      points: [x1, y1, x1, y2, x2, y2, x2, y1]
    };
  },
  _render: function _render() {
    var that = this;
    that._zeroPosition = that._translator.getCodomainStart();
  },
  _clear: function _clear() {
    delete this._element;
  },
  measure: function measure(layout) {
    var p = this.vertical ? layout.x : layout.y;
    return {
      min: p - this._options.length / 2,
      max: p + this._options.length / 2
    };
  },
  getTooltipParameters: function getTooltipParameters() {
    var that = this;
    var options = that._options;
    var p = that._actualPosition;
    var parameters = {
      x: p,
      y: p,
      value: that._currentValue,
      color: options.color,
      offset: options.width / 2
    };
    that.vertical ? parameters.x = options.x : parameters.y = options.y;
    return parameters;
  }
});
var rectangle = SimpleIndicator.inherit({
  _render: function _render() {
    var that = this;
    var options = that._options;
    var x1;
    var x2;
    var y1;
    var y2;
    that.callBase();
    var p = that._zeroPosition;

    if (that.vertical) {
      x1 = options.x - options.length / 2;
      x2 = options.x + options.length / 2;
      y1 = p + options.width / 2;
      y2 = p - options.width / 2;
    } else {
      x1 = p - options.width / 2;
      x2 = p + options.width / 2;
      y1 = options.y + options.length / 2;
      y2 = options.y - options.length / 2;
    }

    that._element = that._element || that._renderer.path([], 'area').append(that._rootElement);

    that._element.attr({
      points: [x1, y1, x1, y2, x2, y2, x2, y1]
    });
  }
});
var rhombus = SimpleIndicator.inherit({
  _render: function _render() {
    var that = this;
    var options = that._options;
    var x;
    var y;
    var dx;
    var dy;
    that.callBase();

    if (that.vertical) {
      x = options.x;
      y = that._zeroPosition;
      dx = options.length / 2 || 0;
      dy = options.width / 2 || 0;
    } else {
      x = that._zeroPosition;
      y = options.y;
      dx = options.width / 2 || 0;
      dy = options.length / 2 || 0;
    }

    that._element = that._element || that._renderer.path([], 'area').append(that._rootElement);

    that._element.attr({
      points: [x - dx, y, x, y - dy, x + dx, y, x, y + dy]
    });
  }
});
var circle = SimpleIndicator.inherit({
  _render: function _render() {
    var that = this;
    var options = that._options;
    var x;
    var y;
    that.callBase();

    if (that.vertical) {
      x = options.x;
      y = that._zeroPosition;
    } else {
      x = that._zeroPosition;
      y = options.y;
    }

    var r = options.length / 2 || 0;
    that._element = that._element || that._renderer.circle().append(that._rootElement);

    that._element.attr({
      cx: x,
      cy: y,
      r: r
    });
  }
}); // The following is from linearMarker.js

var triangleMarker = SimpleIndicator.inherit({
  _isEnabled: function _isEnabled() {
    var that = this;
    that.vertical = that._options.vertical;
    that._inverted = that.vertical ? _normalizeEnum(that._options.horizontalOrientation) === 'right' : _normalizeEnum(that._options.verticalOrientation) === 'bottom';
    return that._options.length > 0 && that._options.width > 0;
  },
  _isVisible: function _isVisible() {
    return true;
  },
  _render: function _render() {
    var that = this;
    var options = that._options;
    var x1;
    var x2;
    var y1;
    var y2;
    var settings = {
      stroke: 'none',
      'stroke-width': 0,
      'stroke-linecap': 'square'
    };
    that.callBase();

    if (that.vertical) {
      x1 = options.x;
      y1 = that._zeroPosition;
      x2 = x1 + _Number(that._inverted ? options.length : -options.length);
      settings.points = [x1, y1, x2, y1 - options.width / 2, x2, y1 + options.width / 2];
    } else {
      y1 = options.y;
      x1 = that._zeroPosition;
      y2 = y1 + _Number(that._inverted ? options.length : -options.length);
      settings.points = [x1, y1, x1 - options.width / 2, y2, x1 + options.width / 2, y2];
    }

    if (options.space > 0) {
      settings['stroke-width'] = Math.min(options.space, options.width / 4) || 0;
      settings.stroke = settings['stroke-width'] > 0 ? options.containerBackgroundColor || 'none' : 'none';
    }

    that._element = that._element || that._renderer.path([], 'area').append(that._rootElement);

    that._element.attr(settings).sharp();
  },
  _getTrackerSettings: function _getTrackerSettings() {
    var that = this;
    var options = that._options;
    var width = options.width / 2;

    var length = _Number(options.length);

    var x1;
    var x2;
    var y1;
    var y2;
    var result;
    width > 10 || (width = 10);
    length > 20 || (length = 20);

    if (that.vertical) {
      x1 = options.x;
      x2 = x1 + (that._inverted ? length : -length);
      y1 = that._zeroPosition + width;
      y2 = that._zeroPosition - width;
      result = [x1, y1, x2, y1, x2, y2, x1, y2];
    } else {
      y1 = options.y;
      y2 = y1 + (that._inverted ? length : -length);
      x1 = that._zeroPosition - width;
      x2 = that._zeroPosition + width;
      result = [x1, y1, x1, y2, x2, y2, x2, y1];
    }

    return {
      points: result
    };
  },
  measure: function measure(layout) {
    var that = this;

    var length = _Number(that._options.length);

    var minBound;
    var maxBound;

    if (that.vertical) {
      minBound = maxBound = layout.x;

      if (that._inverted) {
        maxBound = minBound + length;
      } else {
        minBound = maxBound - length;
      }
    } else {
      minBound = maxBound = layout.y;

      if (that._inverted) {
        maxBound = minBound + length;
      } else {
        minBound = maxBound - length;
      }
    }

    return {
      min: minBound,
      max: maxBound,
      indent: that._options.width / 2
    };
  },
  getTooltipParameters: function getTooltipParameters() {
    var that = this;
    var options = that._options;
    var s = (that._inverted ? options.length : -options.length) / 2;
    var parameters = that.callBase();
    that.vertical ? parameters.x += s : parameters.y += s;
    parameters.offset = options.length / 2;
    return parameters;
  }
});
var textCloud = BaseTextCloudMarker.inherit({
  _isEnabled: function _isEnabled() {
    var that = this;
    that.vertical = that._options.vertical;
    that._inverted = that.vertical ? _normalizeEnum(that._options.horizontalOrientation) === 'right' : _normalizeEnum(that._options.verticalOrientation) === 'bottom';
    return true;
  },
  _isVisible: function _isVisible() {
    return true;
  },
  _getTextCloudOptions: function _getTextCloudOptions() {
    var that = this;
    var x = that._actualPosition;
    var y = that._actualPosition;
    var type;

    if (that.vertical) {
      x = that._options.x;
      type = that._inverted ? 'top-left' : 'top-right';
    } else {
      y = that._options.y;
      type = that._inverted ? 'right-top' : 'right-bottom';
    }

    return {
      x: x,
      y: y,
      type: type
    };
  },
  measure: function measure(layout) {
    var that = this;
    var minBound;
    var maxBound;
    var arrowLength = _Number(that._options.arrowLength) || 0;

    that._measureText();

    if (that.vertical) {
      if (that._inverted) {
        minBound = layout.x;
        maxBound = layout.x + arrowLength + that._textFullWidth;
      } else {
        minBound = layout.x - arrowLength - that._textFullWidth;
        maxBound = layout.x;
      }
    } else {
      if (that._inverted) {
        minBound = layout.y;
        maxBound = layout.y + arrowLength + that._textFullHeight;
      } else {
        minBound = layout.y - arrowLength - that._textFullHeight;
        maxBound = layout.y;
      }
    }

    return {
      min: minBound,
      max: maxBound,
      indent: 0
    };
  },

  _correctCloudType(type, _ref, _ref2) {
    var {
      x,
      y
    } = _ref;
    var {
      width,
      height
    } = _ref2;

    if (type === 'right-top' || type === 'right-bottom') {
      if (x - width < this._translator.getCodomainStart()) {
        type = "left-".concat(type.split('-')[1]);
      }
    } else if (type === 'top-left' || type === 'top-right') {
      if (y + height > this._translator.getCodomainStart()) {
        type = "bottom-".concat(type.split('-')[1]);
      }
    }

    return type;
  }

}); // The following is from linearRangeBar.js

var rangeBar = BaseRangeBar.inherit({
  _isEnabled: function _isEnabled() {
    var that = this;
    that.vertical = that._options.vertical;
    that._inverted = that.vertical ? _normalizeEnum(that._options.horizontalOrientation) === 'right' : _normalizeEnum(that._options.verticalOrientation) === 'bottom';
    return that._options.size > 0;
  },
  _isVisible: function _isVisible() {
    return true;
  },
  _createBarItem: function _createBarItem() {
    return this._renderer.path([], 'area').append(this._rootElement);
  },
  _createTracker: function _createTracker() {
    return this._renderer.path([], 'area');
  },
  _setBarSides: function _setBarSides() {
    var that = this;
    var options = that._options;

    var size = _Number(options.size);

    var minSide;
    var maxSide;

    if (that.vertical) {
      if (that._inverted) {
        minSide = options.x;
        maxSide = options.x + size;
      } else {
        minSide = options.x - size;
        maxSide = options.x;
      }
    } else {
      if (that._inverted) {
        minSide = options.y;
        maxSide = options.y + size;
      } else {
        minSide = options.y - size;
        maxSide = options.y;
      }
    }

    that._minSide = minSide;
    that._maxSide = maxSide;
    that._minBound = minSide;
    that._maxBound = maxSide;
  },
  _getSpace: function _getSpace() {
    var options = this._options;
    return options.space > 0 ? _Number(options.space) : 0;
  },
  _isTextVisible: function _isTextVisible() {
    var textOptions = this._options.text || {};
    return textOptions.indent > 0 || textOptions.indent < 0;
  },
  _getTextAlign: function _getTextAlign() {
    return this.vertical ? this._options.text.indent > 0 ? 'left' : 'right' : 'center';
  },
  _setTextItemsSides: function _setTextItemsSides() {
    var that = this;

    var indent = _Number(that._options.text.indent);

    if (indent > 0) {
      that._lineStart = that._maxSide;
      that._lineEnd = that._maxSide + indent;
      that._textPosition = that._lineEnd + (that.vertical ? 2 : that._textHeight / 2);
      that._maxBound = that._textPosition + (that.vertical ? that._textWidth : that._textHeight / 2);
    } else if (indent < 0) {
      that._lineStart = that._minSide;
      that._lineEnd = that._minSide + indent;
      that._textPosition = that._lineEnd - (that.vertical ? 2 : that._textHeight / 2);
      that._minBound = that._textPosition - (that.vertical ? that._textWidth : that._textHeight / 2);
    }
  },
  _getPositions: function _getPositions() {
    var that = this;
    var startPosition = that._startPosition;
    var endPosition = that._endPosition;
    var space = that._space;
    var basePosition = that._basePosition;
    var actualPosition = that._actualPosition;
    var mainPosition1;
    var mainPosition2;
    var backPosition1;
    var backPosition2;

    if (startPosition < endPosition) {
      if (basePosition < actualPosition) {
        mainPosition1 = basePosition;
        mainPosition2 = actualPosition;
      } else {
        mainPosition1 = actualPosition;
        mainPosition2 = basePosition;
      }

      backPosition1 = mainPosition1 - space;
      backPosition2 = mainPosition2 + space;
    } else {
      if (basePosition > actualPosition) {
        mainPosition1 = basePosition;
        mainPosition2 = actualPosition;
      } else {
        mainPosition1 = actualPosition;
        mainPosition2 = basePosition;
      }

      backPosition1 = mainPosition1 + space;
      backPosition2 = mainPosition2 - space;
    }

    return {
      start: startPosition,
      end: endPosition,
      main1: mainPosition1,
      main2: mainPosition2,
      back1: backPosition1,
      back2: backPosition2
    };
  },
  _buildItemSettings: function _buildItemSettings(from, to) {
    var that = this;
    var side1 = that._minSide;
    var side2 = that._maxSide;
    var points = that.vertical ? [side1, from, side1, to, side2, to, side2, from] : [from, side1, from, side2, to, side2, to, side1];
    return {
      points: points
    };
  },
  _updateTextPosition: function _updateTextPosition() {
    var that = this;

    that._text.attr(that.vertical ? {
      x: that._textPosition,
      y: that._actualPosition + that._textVerticalOffset
    } : {
      x: that._actualPosition,
      y: that._textPosition + that._textVerticalOffset
    });
  },
  _updateLinePosition: function _updateLinePosition() {
    var that = this;
    var actualPosition = that._actualPosition;
    var side1;
    var side2;
    var points;

    if (that.vertical) {
      if (that._basePosition >= actualPosition) {
        side1 = actualPosition;
        side2 = actualPosition + 2;
      } else {
        side1 = actualPosition - 2;
        side2 = actualPosition;
      }

      points = [that._lineStart, side1, that._lineStart, side2, that._lineEnd, side2, that._lineEnd, side1];
    } else {
      if (that._basePosition <= actualPosition) {
        side1 = actualPosition - 2;
        side2 = actualPosition;
      } else {
        side1 = actualPosition;
        side2 = actualPosition + 2;
      }

      points = [side1, that._lineStart, side1, that._lineEnd, side2, that._lineEnd, side2, that._lineStart];
    }

    that._line.attr({
      points: points
    }).sharp();
  },
  _getTooltipPosition: function _getTooltipPosition() {
    var that = this;
    var crossCenter = (that._minSide + that._maxSide) / 2;
    var alongCenter = (that._basePosition + that._actualPosition) / 2;
    return that.vertical ? {
      x: crossCenter,
      y: alongCenter
    } : {
      x: alongCenter,
      y: crossCenter
    };
  },
  measure: function measure(layout) {
    var that = this;

    var size = _Number(that._options.size);

    var textIndent = _Number(that._options.text.indent);

    var minBound;
    var maxBound;
    var indent;

    that._measureText();

    if (that.vertical) {
      minBound = maxBound = layout.x;

      if (that._inverted) {
        maxBound = maxBound + size;
      } else {
        minBound = minBound - size;
      }

      if (that._hasText) {
        indent = that._textHeight / 2;

        if (textIndent > 0) {
          maxBound += textIndent + that._textWidth;
        }

        if (textIndent < 0) {
          minBound += textIndent - that._textWidth;
        }
      }
    } else {
      minBound = maxBound = layout.y;

      if (that._inverted) {
        maxBound = maxBound + size;
      } else {
        minBound = minBound - size;
      }

      if (that._hasText) {
        indent = that._textWidth / 2;

        if (textIndent > 0) {
          maxBound += textIndent + that._textHeight;
        }

        if (textIndent < 0) {
          minBound += textIndent - that._textHeight;
        }
      }
    }

    return {
      min: minBound,
      max: maxBound,
      indent: indent
    };
  }
});
/* eslint-disable spellcheck/spell-checker */

export { rangeBar as _default, rectangle, rhombus, circle, triangleMarker as trianglemarker, textCloud as textcloud, rangeBar as rangebar };
import eventsEngine from '../../events/core/events_engine';
import { fireEvent } from '../../events/utils/index';
import { extend } from '../../core/utils/extend';
import { Translator2D } from '../translators/translator2d';
import { isDefined } from '../../core/utils/type';
import { noop } from '../../core/utils/common';
import { start as dragEventStart, move as dragEventMove, end as dragEventEnd } from '../../events/drag';
var _min = Math.min;
var _max = Math.max;
var MIN_SCROLL_BAR_SIZE = 2;
export var ScrollBar = function ScrollBar(renderer, group) {
  this._translator = new Translator2D({}, {}, {});
  this._scroll = renderer.rect().append(group);

  this._addEvents();
};

function _getXCoord(canvas, pos, offset, width) {
  var x = 0;

  if (pos === 'right') {
    x = canvas.width - canvas.right + offset;
  } else if (pos === 'left') {
    x = canvas.left - offset - width;
  }

  return x;
}

function _getYCoord(canvas, pos, offset, width) {
  var y = 0;

  if (pos === 'top') {
    y = canvas.top - offset;
  } else if (pos === 'bottom') {
    y = canvas.height - canvas.bottom + width + offset;
  }

  return y;
}

ScrollBar.prototype = {
  _addEvents: function _addEvents() {
    var scrollElement = this._scroll.element;
    eventsEngine.on(scrollElement, dragEventStart, e => {
      fireEvent({
        type: 'dxc-scroll-start',
        originalEvent: e,
        target: scrollElement
      });
    });
    eventsEngine.on(scrollElement, dragEventMove, e => {
      var dX = -e.offset.x * this._scale;
      var dY = -e.offset.y * this._scale;
      var lx = this._offset - (this._layoutOptions.vertical ? dY : dX) / this._scale;

      this._applyPosition(lx, lx + this._translator.canvasLength / this._scale);

      fireEvent({
        type: 'dxc-scroll-move',
        originalEvent: e,
        target: scrollElement,
        offset: {
          x: dX,
          y: dY
        }
      });
    });
    eventsEngine.on(scrollElement, dragEventEnd, e => {
      fireEvent({
        type: 'dxc-scroll-end',
        originalEvent: e,
        target: scrollElement,
        offset: {
          x: -e.offset.x * this._scale,
          y: -e.offset.y * this._scale
        }
      });
    });
  },
  update: function update(options) {
    var that = this;
    var position = options.position;
    var isVertical = options.rotated;
    var defaultPosition = isVertical ? 'right' : 'top';
    var secondaryPosition = isVertical ? 'left' : 'bottom';

    if (position !== defaultPosition && position !== secondaryPosition) {
      position = defaultPosition;
    }

    that._scroll.attr({
      rotate: !options.rotated ? -90 : 0,
      rotateX: 0,
      rotateY: 0,
      fill: options.color,
      width: options.width,
      opacity: options.opacity
    });

    that._layoutOptions = {
      width: options.width,
      offset: options.offset,
      vertical: isVertical,
      position: position
    };
    return that;
  },
  init: function init(range, stick) {
    var that = this;
    var isDiscrete = range.axisType === 'discrete';
    that._translateWithOffset = isDiscrete && !stick && 1 || 0;

    that._translator.update(extend({}, range, {
      minVisible: null,
      maxVisible: null,
      visibleCategories: null
    }, isDiscrete && {
      min: null,
      max: null
    } || {}), that._canvas, {
      isHorizontal: !that._layoutOptions.vertical,
      stick: stick
    });

    return that;
  },
  getOptions: function getOptions() {
    return this._layoutOptions;
  },
  setPane: function setPane(panes) {
    var position = this._layoutOptions.position;
    var pane;

    if (position === 'left' || position === 'top') {
      pane = panes[0];
    } else {
      pane = panes[panes.length - 1];
    }

    this.pane = pane.name;
    return this;
  },
  updateSize: function updateSize(canvas) {
    this._canvas = extend({}, canvas);
    var options = this._layoutOptions;
    var pos = options.position;
    var offset = options.offset;
    var width = options.width;

    this._scroll.attr({
      translateX: _getXCoord(canvas, pos, offset, width),
      translateY: _getYCoord(canvas, pos, offset, width)
    });
  },
  getMultipleAxesSpacing: function getMultipleAxesSpacing() {
    return 0;
  },
  estimateMargins: function estimateMargins() {
    return this.getMargins();
  },
  getMargins: function getMargins() {
    var options = this._layoutOptions;
    var margins = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
    margins[options.position] = options.width + options.offset;
    return margins;
  },
  shift: function shift(margins) {
    var _that$_scroll$attr, _that$_scroll$attr2;

    var that = this;
    var options = that._layoutOptions;
    var side = options.position;
    var isVertical = options.vertical;
    var attr = {
      translateX: (_that$_scroll$attr = that._scroll.attr('translateX')) !== null && _that$_scroll$attr !== void 0 ? _that$_scroll$attr : 0,
      translateY: (_that$_scroll$attr2 = that._scroll.attr('translateY')) !== null && _that$_scroll$attr2 !== void 0 ? _that$_scroll$attr2 : 0
    };
    var shift = margins[side];
    attr[isVertical ? 'translateX' : 'translateY'] += (side === 'left' || side === 'top' ? -1 : 1) * shift;

    that._scroll.attr(attr);
  },
  // Axis like functions
  hideTitle: noop,
  hideOuterElements: noop,
  // Axis like functions
  setPosition: function setPosition(min, max) {
    var that = this;
    var translator = that._translator;
    var minPoint = isDefined(min) ? translator.translate(min, -that._translateWithOffset) : translator.translate('canvas_position_start');
    var maxPoint = isDefined(max) ? translator.translate(max, that._translateWithOffset) : translator.translate('canvas_position_end');
    that._offset = _min(minPoint, maxPoint);
    that._scale = translator.getScale(min, max);

    that._applyPosition(_min(minPoint, maxPoint), _max(minPoint, maxPoint));
  },

  customPositionIsAvailable() {
    return false;
  },

  dispose: function dispose() {
    this._scroll.dispose();

    this._scroll = this._translator = null;
  },
  _applyPosition: function _applyPosition(x1, x2) {
    var that = this;

    var visibleArea = that._translator.getCanvasVisibleArea();

    x1 = _max(x1, visibleArea.min);
    x1 = _min(x1, visibleArea.max);
    x2 = _min(x2, visibleArea.max);
    x2 = _max(x2, visibleArea.min);
    var height = Math.abs(x2 - x1);

    that._scroll.attr({
      y: x1,
      height: height < MIN_SCROLL_BAR_SIZE ? MIN_SCROLL_BAR_SIZE : height
    });
  }
};
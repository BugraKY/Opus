import eventsEngine from '../../events/core/events_engine';
import domAdapter from '../../core/dom_adapter';
import { isFunction } from '../../core/utils/type';
import BaseWidget from '../core/base_widget';
import { extend } from '../../core/utils/extend';
import { addNamespace } from '../../events/utils/index';
import pointerEvents from '../../events/pointer';
import { pointInCanvas } from '../core/utils';
var DEFAULT_LINE_SPACING = 2;
var EVENT_NS = 'sparkline-tooltip';
var POINTER_ACTION = addNamespace([pointerEvents.down, pointerEvents.move], EVENT_NS);
import { Translator2D } from '../translators/translator2d';
var _extend = extend;
var _floor = Math.floor;
import { noop as _noop } from '../../core/utils/common';

function inCanvas(_ref, x, y) {
  var {
    width,
    height
  } = _ref;
  return pointInCanvas({
    left: 0,
    top: 0,
    right: width,
    bottom: height,
    width,
    height
  }, x, y);
}

function pointerHandler(_ref2) {
  var {
    data
  } = _ref2;
  var that = data.widget;

  that._enableOutHandler();

  that._showTooltip();
}

function generateDefaultCustomizeTooltipCallback(fontOptions, rtlEnabled) {
  var lineSpacing = fontOptions.lineSpacing;
  var lineHeight = (lineSpacing !== undefined && lineSpacing !== null ? lineSpacing : DEFAULT_LINE_SPACING) + fontOptions.size;
  return function (customizeObject) {
    var html = '';
    var vt = customizeObject.valueText;

    for (var i = 0; i < vt.length; i += 2) {
      html += '<tr><td>' + vt[i] + '</td><td style=\'width: 15px\'></td><td style=\'text-align: ' + (rtlEnabled ? 'left' : 'right') + '\'>' + vt[i + 1] + '</td></tr>';
    }

    return {
      html: '<table style=\'border-spacing:0px; line-height: ' + lineHeight + 'px\'>' + html + '</table>'
    };
  };
}

function generateCustomizeTooltipCallback(customizeTooltip, fontOptions, rtlEnabled) {
  var defaultCustomizeTooltip = generateDefaultCustomizeTooltipCallback(fontOptions, rtlEnabled);

  if (isFunction(customizeTooltip)) {
    return function (customizeObject) {
      var res = customizeTooltip.call(customizeObject, customizeObject);

      if (!('html' in res) && !('text' in res)) {
        _extend(res, defaultCustomizeTooltip.call(customizeObject, customizeObject));
      }

      return res;
    };
  } else {
    return defaultCustomizeTooltip;
  }
}

function createAxis(isHorizontal) {
  var translator = new Translator2D({}, {}, {
    shiftZeroValue: !isHorizontal,
    isHorizontal: !!isHorizontal
  });
  return {
    getTranslator: function getTranslator() {
      return translator;
    },
    update: function update(range, canvas, options) {
      translator.update(range, canvas, options);
    },

    getVisibleArea() {
      var visibleArea = translator.getCanvasVisibleArea();
      return [visibleArea.min, visibleArea.max];
    },

    visualRange: _noop,
    calculateInterval: _noop,

    getMarginOptions() {
      return {};
    }

  };
}
/* eslint-disable-next-line */


var _initTooltip;

var BaseSparkline = BaseWidget.inherit({
  _getLayoutItems: _noop,
  _useLinks: false,
  _themeDependentChanges: ['OPTIONS'],
  _initCore: function _initCore() {
    var that = this;
    that._tooltipTracker = that._renderer.root;

    that._tooltipTracker.attr({
      'pointer-events': 'visible'
    });

    that._createHtmlElements();

    that._initTooltipEvents();

    that._argumentAxis = createAxis(true);
    that._valueAxis = createAxis();
  },
  _getDefaultSize: function _getDefaultSize() {
    return this._defaultSize;
  },
  _disposeCore: function _disposeCore() {
    this._disposeWidgetElements();

    this._disposeTooltipEvents();

    this._ranges = null;
  },
  _optionChangesOrder: ['OPTIONS'],
  _change_OPTIONS: function _change_OPTIONS() {
    this._prepareOptions();

    this._change(['UPDATE']);
  },
  _customChangesOrder: ['UPDATE'],
  _change_UPDATE: function _change_UPDATE() {
    this._update();
  },
  _update: function _update() {
    var that = this;

    if (that._tooltipShown) {
      that._tooltipShown = false;

      that._tooltip.hide();
    }

    that._cleanWidgetElements();

    that._updateWidgetElements();

    that._drawWidgetElements();
  },
  _updateWidgetElements: function _updateWidgetElements() {
    var canvas = this._getCorrectCanvas();

    this._updateRange();

    this._argumentAxis.update(this._ranges.arg, canvas, this._getStick());

    this._valueAxis.update(this._ranges.val, canvas);
  },
  _getStick: function _getStick() {},
  _applySize: function _applySize(rect) {
    this._allOptions.size = {
      width: rect[2] - rect[0],
      height: rect[3] - rect[1]
    };

    this._change(['UPDATE']);
  },
  _setupResizeHandler: _noop,
  _prepareOptions: function _prepareOptions() {
    return _extend(true, {}, this._themeManager.theme(), this.option());
  },
  _getTooltipCoords: function _getTooltipCoords() {
    var canvas = this._canvas;

    var rootOffset = this._renderer.getRootOffset();

    return {
      x: canvas.width / 2 + rootOffset.left,
      y: canvas.height / 2 + rootOffset.top
    };
  },

  _initTooltipEvents() {
    var data = {
      widget: this
    };

    this._renderer.root.off('.' + EVENT_NS).on(POINTER_ACTION, data, pointerHandler);
  },

  _showTooltip() {
    var that = this;
    var tooltip;

    if (!that._tooltipShown) {
      that._tooltipShown = true;
      tooltip = that._getTooltip();
      tooltip.isEnabled() && that._tooltip.show(that._getTooltipData(), that._getTooltipCoords(), {});
    }
  },

  _hideTooltip() {
    if (this._tooltipShown) {
      this._tooltipShown = false;

      this._tooltip.hide();
    }
  },

  _stopCurrentHandling() {
    this._hideTooltip();
  },

  _enableOutHandler() {
    var that = this;

    if (that._outHandler) {
      return;
    }

    var handler = _ref3 => {
      var {
        pageX,
        pageY
      } = _ref3;

      var {
        left,
        top
      } = that._renderer.getRootOffset();

      var x = _floor(pageX - left);

      var y = _floor(pageY - top);

      if (!inCanvas(that._canvas, x, y)) {
        that._hideTooltip();

        that._disableOutHandler();
      }
    };

    eventsEngine.on(domAdapter.getDocument(), POINTER_ACTION, handler);
    this._outHandler = handler;
  },

  _disableOutHandler() {
    this._outHandler && eventsEngine.off(domAdapter.getDocument(), POINTER_ACTION, this._outHandler);
    this._outHandler = null;
  },

  _disposeTooltipEvents: function _disposeTooltipEvents() {
    this._tooltipTracker.off();

    this._disableOutHandler();

    this._renderer.root.off('.' + EVENT_NS);
  },
  _getTooltip: function _getTooltip() {
    var that = this;

    if (!that._tooltip) {
      _initTooltip.apply(this, arguments);

      that._setTooltipRendererOptions(that._tooltipRendererOptions);

      that._tooltipRendererOptions = null;

      that._setTooltipOptions();
    }

    return that._tooltip;
  }
});
export default BaseSparkline; // PLUGINS_SECTION

import { plugin as tooltipPlugin } from '../core/tooltip';
BaseSparkline.addPlugin(tooltipPlugin); // These are sparklines specifics on using tooltip - they cannot be omitted because of tooltip laziness.

_initTooltip = BaseSparkline.prototype._initTooltip;
BaseSparkline.prototype._initTooltip = _noop;
var _disposeTooltip = BaseSparkline.prototype._disposeTooltip;

BaseSparkline.prototype._disposeTooltip = function () {
  if (this._tooltip) {
    _disposeTooltip.apply(this, arguments);
  }
};

BaseSparkline.prototype._setTooltipRendererOptions = function () {
  var options = this._getRendererOptions();

  if (this._tooltip) {
    this._tooltip.setRendererOptions(options);
  } else {
    this._tooltipRendererOptions = options;
  }
};

BaseSparkline.prototype._setTooltipOptions = function () {
  var tooltip = this._tooltip;

  var options = tooltip && this._getOption('tooltip');

  tooltip && tooltip.update(_extend({}, options, {
    customizeTooltip: generateCustomizeTooltipCallback(options.customizeTooltip, options.font, this.option('rtlEnabled')),
    enabled: options.enabled && this._isTooltipEnabled()
  }));
}; // PLUGINS_SECTION
// T422022


import { plugin } from '../core/export';
var exportPlugin = extend(true, {}, plugin, {
  init: _noop,
  dispose: _noop,
  customize: null,
  members: {
    _getExportMenuOptions: null
  }
});
BaseSparkline.addPlugin(exportPlugin);
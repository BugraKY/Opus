import { noop } from '../../core/utils/common';
import { plugin as pluginTooltip } from '../core/tooltip';

function getCoords(coords, figureCoords, renderer) {
  var offset = renderer.getRootOffset();
  return coords || figureCoords && [(figureCoords[0] + figureCoords[2]) / 2 + offset.left, (figureCoords[1] + figureCoords[5]) / 2 + offset.top] || [-1000, -1000];
}

export var plugin = {
  name: 'funnel-tooltip',
  init: noop,
  dispose: noop,
  extenders: {
    _buildNodes: function _buildNodes() {
      this.hideTooltip();
    },
    _change_TILING: function _change_TILING() {
      if (this._tooltipIndex >= 0) {
        this._moveTooltip(this._items[this._tooltipIndex]);
      }
    }
  },
  members: {
    hideTooltip: function hideTooltip() {
      if (this._tooltipIndex >= 0) {
        this._tooltipIndex = -1;

        this._tooltip.hide();
      }
    },
    _moveTooltip: function _moveTooltip(item, coords) {
      var xy = getCoords(coords, item.coords, this._renderer);

      this._tooltip.move(xy[0], xy[1], 0);
    },
    _showTooltip: function _showTooltip(index, coords) {
      var that = this;
      var tooltip = that._tooltip;
      var item = that._items[index];

      if (that._tooltipIndex === index) {
        that._moveTooltip(item, coords);

        return;
      }

      var callback = result => {
        if (result === undefined) {
          return;
        }

        if (!result) {
          tooltip.hide();
        }

        that._tooltipIndex = result ? index : -1;
      };

      var xy = getCoords(coords, item.coords, this._renderer);
      callback(tooltip.show({
        value: item.value,
        valueText: tooltip.formatValue(item.value),
        percentText: tooltip.formatValue(item.percent, 'percent'),
        percent: item.percent,
        item: item
      }, {
        x: xy[0],
        y: xy[1],
        offset: 0
      }, {
        item: item
      }, undefined, callback));
    }
  },
  customize: function customize(constructor) {
    constructor.addPlugin(pluginTooltip);
  }
};
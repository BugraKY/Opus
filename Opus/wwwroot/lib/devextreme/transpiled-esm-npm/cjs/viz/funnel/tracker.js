"use strict";

exports.plugin = void 0;

var _funnel = _interopRequireDefault(require("./funnel"));

var _tracker = require("../components/tracker");

var _type = require("../../core/utils/type");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DATA_KEY_BASE = '__funnel_data_';
var dataKeyModifier = 0;
var proto = _funnel.default.prototype;
proto._eventsMap.onItemClick = {
  name: 'itemClick'
};
proto._eventsMap.onLegendClick = {
  name: 'legendClick'
};

var getDataKey = function getDataKey() {
  return DATA_KEY_BASE + dataKeyModifier++;
};

var plugin = {
  name: 'tracker',
  init: function init() {
    var that = this;
    var dataKey = getDataKey();

    var getProxyData = function getProxyData(e) {
      var rootOffset = that._renderer.getRootOffset();

      var x = Math.floor(e.pageX - rootOffset.left);
      var y = Math.floor(e.pageY - rootOffset.top);
      return that._hitTestTargets(x, y);
    };

    that._tracker = new _tracker.Tracker({
      widget: that,
      root: that._renderer.root,
      getData: function getData(e, tooltipData) {
        var target = e.target;
        var data = target[dataKey];

        if ((0, _type.isDefined)(data)) {
          return data;
        }

        var proxyData = getProxyData(e);

        if (tooltipData && proxyData && proxyData.type !== 'inside-label') {
          return;
        }

        return proxyData && proxyData.id;
      },
      getNode: function getNode(index) {
        return that._items[index];
      },
      click: function click(e) {
        var proxyData = getProxyData(e.event);
        var dataType = proxyData && proxyData.type;
        var event = dataType === 'legend' ? 'legendClick' : 'itemClick';

        that._eventTrigger(event, {
          item: e.node,
          event: e.event
        });
      }
    });
    this._dataKey = dataKey;
  },
  dispose: function dispose() {
    this._tracker.dispose();
  },
  extenders: {
    _change_TILING: function _change_TILING() {
      var dataKey = this._dataKey;

      this._items.forEach(function (item, index) {
        item.element.data(dataKey, index);
      });
    }
  }
};
exports.plugin = plugin;
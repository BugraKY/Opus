import Funnel from './funnel';
import { Tracker } from '../components/tracker';
var DATA_KEY_BASE = '__funnel_data_';
import { isDefined } from '../../core/utils/type';
var dataKeyModifier = 0;
var proto = Funnel.prototype;
proto._eventsMap.onItemClick = {
  name: 'itemClick'
};
proto._eventsMap.onLegendClick = {
  name: 'legendClick'
};

var getDataKey = function getDataKey() {
  return DATA_KEY_BASE + dataKeyModifier++;
};

export var plugin = {
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

    that._tracker = new Tracker({
      widget: that,
      root: that._renderer.root,
      getData: function getData(e, tooltipData) {
        var target = e.target;
        var data = target[dataKey];

        if (isDefined(data)) {
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
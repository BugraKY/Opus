import TreeMapBase from './tree_map.base';
import { Tracker } from '../components/tracker';
import { expand } from '../core/helpers';
import { parseScalar as _parseScalar } from '../core/utils';
var DATA_KEY_BASE = '__treemap_data_';
var dataKeyModifier = 0;
var proto = TreeMapBase.prototype;
import './api';
import './hover';
import './tooltip';
proto._eventsMap.onClick = {
  name: 'click'
};

var getDataKey = function getDataKey() {
  var dataKey = DATA_KEY_BASE + dataKeyModifier++;
  return dataKey;
};

expand(proto, '_initCore', function () {
  var that = this;
  var dataKey = getDataKey();

  var getProxy = function getProxy(index) {
    return that._nodes[index].proxy;
  };

  that._tracker = new Tracker({
    widget: that,
    root: that._renderer.root,
    getNode: function getNode(id) {
      var proxy = getProxy(id);

      var interactWithGroup = _parseScalar(that._getOption('interactWithGroup', true));

      return interactWithGroup && proxy.isLeaf() && proxy.getParent().isActive() ? proxy.getParent() : proxy;
    },
    getData: function getData(e) {
      var target = e.target;
      return (target.tagName === 'tspan' ? target.parentNode : target)[dataKey];
    },
    getProxy: getProxy,
    click: function click(e) {
      that._eventTrigger('click', e);
    }
  });

  that._handlers.setTrackerData = function (node, element) {
    element.data(dataKey, node._id);
  };
});
expand(proto, '_disposeCore', function () {
  this._tracker.dispose();
});
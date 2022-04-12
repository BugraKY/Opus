"use strict";

var _tree_map = _interopRequireDefault(require("./tree_map.base"));

var _tracker = require("../components/tracker");

var _helpers = require("../core/helpers");

var _utils = require("../core/utils");

require("./api");

require("./hover");

require("./tooltip");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DATA_KEY_BASE = '__treemap_data_';
var dataKeyModifier = 0;
var proto = _tree_map.default.prototype;
proto._eventsMap.onClick = {
  name: 'click'
};

var getDataKey = function getDataKey() {
  var dataKey = DATA_KEY_BASE + dataKeyModifier++;
  return dataKey;
};

(0, _helpers.expand)(proto, '_initCore', function () {
  var that = this;
  var dataKey = getDataKey();

  var getProxy = function getProxy(index) {
    return that._nodes[index].proxy;
  };

  that._tracker = new _tracker.Tracker({
    widget: that,
    root: that._renderer.root,
    getNode: function getNode(id) {
      var proxy = getProxy(id);
      var interactWithGroup = (0, _utils.parseScalar)(that._getOption('interactWithGroup', true));
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
(0, _helpers.expand)(proto, '_disposeCore', function () {
  this._tracker.dispose();
});
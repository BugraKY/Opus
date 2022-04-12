"use strict";

exports.plugin = exports._TESTS_dataKey = void 0;

var _sankey = _interopRequireDefault(require("./sankey"));

var _tracker = require("../components/tracker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proto = _sankey.default.prototype;
var DATA_KEY_BASE = '__sankey_data_';
var dataKeyModifier = 0; ///#DEBUG

var _TESTS_dataKey; ///#ENDDEBUG


exports._TESTS_dataKey = _TESTS_dataKey;
proto._eventsMap.onNodeClick = {
  name: 'nodeClick'
};
proto._eventsMap.onLinkClick = {
  name: 'linkClick'
};

var getDataKey = function getDataKey() {
  return DATA_KEY_BASE + dataKeyModifier++;
};

var plugin = {
  name: 'tracker',
  init: function init() {
    var that = this;
    var dataKey = getDataKey(); ///#DEBUG

    exports._TESTS_dataKey = _TESTS_dataKey = dataKey; ///#ENDDEBUG

    that._tracker = new _tracker.Tracker({
      widget: that,
      root: that._renderer.root,
      getData: function getData(e) {
        var target = e.target;
        return target[dataKey];
      },
      getNode: function getNode(index) {
        if (index < that._nodes.length) {
          return that._nodes[index];
        } else {
          return that._links[index - that._nodes.length];
        }
      },
      click: function click(e) {
        var eventName = this.getData(e.event) < that._nodes.length ? 'nodeClick' : 'linkClick';

        that._eventTrigger(eventName, {
          target: e.node,
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
    _change_LINKS_DRAW: function _change_LINKS_DRAW() {
      var dataKey = this._dataKey;

      this._nodes.concat(this._links).forEach(function (item, index) {
        item.element.data(dataKey, index);
      });
    }
  }
}; ///#DEBUG
///#ENDDEBUG

exports.plugin = plugin;
"use strict";

exports.default = void 0;

var _extend2 = require("../../core/utils/extend");

function Node() {}

var updateTile = [updateLeaf, updateGroup];
(0, _extend2.extend)(Node.prototype, {
  value: 0,
  isNode: function isNode() {
    return !!(this.nodes && this.level < this.ctx.maxLevel);
  },
  isActive: function isActive() {
    var ctx = this.ctx;
    return this.level >= ctx.minLevel && this.level <= ctx.maxLevel;
  },
  updateStyles: function updateStyles() {
    var that = this;
    var isNode = Number(that.isNode());
    that.state = that._buildState(that.ctx.settings[isNode].state, !isNode && that.color && {
      fill: that.color
    });
  },
  _buildState: function _buildState(state, extra) {
    var base = (0, _extend2.extend)({}, state);
    return extra ? (0, _extend2.extend)(base, extra) : base;
  },
  updateLabelStyle: function updateLabelStyle() {
    var settings = this.ctx.settings[Number(this.isNode())];
    this.labelState = settings.labelState;
    this.labelParams = settings.labelParams;
  },
  _getState: function _getState() {
    return this.state;
  },
  applyState: function applyState() {
    updateTile[Number(this.isNode())](this.tile, this._getState());
  }
});

function updateLeaf(content, attrs) {
  content.smartAttr(attrs);
}

function updateGroup(content, attrs) {
  content.outer.attr({
    stroke: attrs.stroke,
    'stroke-width': attrs['stroke-width'],
    'stroke-opacity': attrs['stroke-opacity']
  });
  content.inner.smartAttr({
    fill: attrs.fill,
    opacity: attrs.opacity,
    hatching: attrs.hatching
  });
}

var _default = Node;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
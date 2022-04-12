import { extend as _extend } from '../../core/utils/extend';

function Node() {}

var updateTile = [updateLeaf, updateGroup];

_extend(Node.prototype, {
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
    var base = _extend({}, state);

    return extra ? _extend(base, extra) : base;
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

export default Node;
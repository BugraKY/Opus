"use strict";

exports.default = void 0;

var _type = require("../../core/utils/type");

var _utils = require("../core/utils");

var states = ['normal', 'hover'];

function _compileAttrs(color, itemOptions, itemBaseOptions) {
  var border = itemOptions.border;
  var baseBorder = itemBaseOptions.border;
  var borderVisible = (0, _type.isDefined)(border.visible) ? border.visible : baseBorder.visible;
  var borderWidth = (0, _type.isDefined)(border.width) ? border.width : baseBorder.width;
  var borderOpacity = (0, _type.isDefined)(border.opacity) ? border.opacity : (0, _type.isDefined)(baseBorder.opacity) ? baseBorder.opacity : 1;
  var opacity = (0, _type.isDefined)(itemOptions.opacity) ? itemOptions.opacity : (0, _type.isDefined)(itemBaseOptions.opacity) ? itemBaseOptions.opacity : 1;
  return {
    fill: itemOptions.color || color,
    'stroke-width': borderVisible ? borderWidth : 0,
    stroke: itemOptions.border.color || itemBaseOptions.border.color,
    'stroke-opacity': borderOpacity,
    opacity: opacity,
    hatching: itemOptions.hatching
  };
}

function compileLabelAttrs(labelOptions, filter, node) {
  var _patchFontOptions = _utils.patchFontOptions;

  if (labelOptions.useNodeColors) {
    labelOptions.font.color = node.color;
  }

  var borderVisible = (0, _type.isDefined)(labelOptions.border.visible) ? labelOptions.border.visible : false;
  var borderWidth = (0, _type.isDefined)(labelOptions.border.width) ? labelOptions.border.width : 0;
  var borderColor = (0, _type.isDefined)(labelOptions.border.color) ? labelOptions.border.color : labelOptions.font.color;
  var borderOpacity = (0, _type.isDefined)(labelOptions.border.opacity) ? labelOptions.border.opacity : 1;
  var attr = {
    filter: filter
  };

  if (borderVisible && borderWidth) {
    attr.stroke = borderColor;
    attr['stroke-width'] = borderVisible ? borderWidth : 0;
    attr['stroke-opacity'] = borderOpacity;
  }

  return {
    attr: attr,
    css: _patchFontOptions(labelOptions.font)
  };
}

function Node(widget, params) {
  var that = this;

  var widgetOffset = widget._renderer.getRootOffset();

  that.code = 0;
  that.widget = widget;
  that.color = params.color;
  that.options = params.options;
  that.rect = params.rect;
  that.label = that.title = params.rect._name;
  that.coords = {
    x: params.rect.x + params.rect.width / 2 + widgetOffset.left,
    y: params.rect.y + params.rect.height / 2 + widgetOffset.top
  };
  that.id = params.id;
  that.linksIn = params.linksIn;
  that.linksOut = params.linksOut;
  this.states = {
    normal: _compileAttrs(this.color, that.options, that.options),
    hover: _compileAttrs(this.color, that.options.hoverStyle, that.options)
  };
}

Node.prototype = {
  compileAttrs: function compileAttrs() {
    return _compileAttrs(this.color, this.options);
  },
  getState: function getState() {
    return states[this.code];
  },
  isHovered: function isHovered() {
    return !!(this.code & 1);
  },
  setState: function setState(code, state) {
    var _this = this;

    if (state) {
      this.code |= code;
    } else {
      this.code &= ~code;
    }

    if (state) {
      this.linksIn.concat(this.linksOut).forEach(function (adjacentLink) {
        _this.widget._links[adjacentLink.index].setAdjacentNodeHover(true);
      });
    } else {
      this.widget._links.forEach(function (link) {
        link.isAdjacentNodeHovered() && link.adjacentNodeHover(false);
      });

      this.hideTooltip();
    }

    this.widget._applyNodesAppearance();

    this.widget._applyLinksAppearance();
  },
  hover: function hover(state) {
    if (!this.widget._getOption('hoverEnabled', true) || state === this.isHovered()) {
      return;
    }

    this.widget._suspend();

    state && this.widget.clearHover();
    this.setState(1, state);

    this.widget._eventTrigger('nodeHoverChanged', {
      target: this
    });

    this.widget._resume();
  },
  setHover: function setHover() {
    this.hover(true);
  },
  showTooltip: function showTooltip(coords) {
    this.widget._getOption('hoverEnabled', true) && this.widget._tooltip && this.widget._tooltip.show({
      type: 'node',
      info: {
        label: this.label,
        title: this.label,
        weightIn: this.linksIn.reduce(function (previousValue, currentValue) {
          return previousValue + currentValue.weight;
        }, 0),
        weightOut: this.linksOut.reduce(function (previousValue, currentValue) {
          return previousValue + currentValue.weight;
        }, 0)
      }
    }, typeof coords !== 'undefined' ? {
      x: coords[0],
      y: coords[1]
    } : this.coords);
  },
  hideTooltip: function hideTooltip() {
    this.widget._tooltip && this.widget._tooltip.hide();
  },
  getLabelAttributes: function getLabelAttributes(labelSettings, filter) {
    return compileLabelAttrs(labelSettings, filter, this);
  }
};
var _default = Node;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
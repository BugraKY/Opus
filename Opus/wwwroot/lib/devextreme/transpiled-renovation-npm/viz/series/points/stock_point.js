"use strict";

exports.default = void 0;

var _extend2 = require("../../../core/utils/extend");

var _type = require("../../../core/utils/type");

var _candlestick_point = _interopRequireDefault(require("./candlestick_point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _extend = _extend2.extend;
var _isNumeric = _type.isNumeric;

var _default = _extend({}, _candlestick_point.default, {
  _getPoints: function _getPoints() {
    var that = this;
    var createPoint = that._options.rotated ? function (x, y) {
      return [y, x];
    } : function (x, y) {
      return [x, y];
    };

    var openYExist = _isNumeric(that.openY);

    var closeYExist = _isNumeric(that.closeY);

    var x = that.x;
    var width = that.width;
    var points = [].concat(createPoint(x, that.highY));
    openYExist && (points = points.concat(createPoint(x, that.openY)));
    openYExist && (points = points.concat(createPoint(x - width / 2, that.openY)));
    openYExist && (points = points.concat(createPoint(x, that.openY)));
    closeYExist && (points = points.concat(createPoint(x, that.closeY)));
    closeYExist && (points = points.concat(createPoint(x + width / 2, that.closeY)));
    closeYExist && (points = points.concat(createPoint(x, that.closeY)));
    points = points.concat(createPoint(x, that.lowY));
    return points;
  },
  _drawMarkerInGroup: function _drawMarkerInGroup(group, attributes, renderer) {
    this.graphic = renderer.path(this._getPoints(), 'line').attr({
      'stroke-linecap': 'square'
    }).attr(attributes).data({
      'chart-data-point': this
    }).sharp().append(group);
  },
  _getMinTrackerWidth: function _getMinTrackerWidth() {
    var width = 2 + this._styles.normal['stroke-width'];
    return width + width % 2;
  }
});

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
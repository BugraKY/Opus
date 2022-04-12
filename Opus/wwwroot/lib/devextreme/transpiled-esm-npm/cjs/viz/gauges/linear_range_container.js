"use strict";

exports.default = void 0;

var _base_range_container = _interopRequireDefault(require("./base_range_container"));

var _utils = require("../core/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Number = Number;
var _max = Math.max;

var LinearRangeContainer = _base_range_container.default.inherit({
  _processOptions: function _processOptions() {
    var that = this;
    that.vertical = that._options.vertical;
    that._inner = that._outer = 0;

    if (that.vertical) {
      switch ((0, _utils.normalizeEnum)(that._options.horizontalOrientation)) {
        case 'left':
          that._inner = 1;
          break;

        case 'center':
          that._inner = that._outer = 0.5;
          break;

        default:
          that._outer = 1;
          break;
      }
    } else {
      switch ((0, _utils.normalizeEnum)(that._options.verticalOrientation)) {
        case 'top':
          that._inner = 1;
          break;

        case 'center':
          that._inner = that._outer = 0.5;
          break;

        default:
          that._outer = 1;
          break;
      }
    }
  },
  _isVisible: function _isVisible() {
    return true;
  },
  _createRange: function _createRange(range, layout) {
    var that = this;
    var inner = that._inner;
    var outer = that._outer;

    var startPosition = that._translator.translate(range.start);

    var endPosition = that._translator.translate(range.end);

    var points;
    var x = layout.x;
    var y = layout.y;
    var startWidth = range.startWidth;
    var endWidth = range.endWidth;

    if (that.vertical) {
      points = [x - startWidth * inner, startPosition, x - endWidth * inner, endPosition, x + endWidth * outer, endPosition, x + startWidth * outer, startPosition];
    } else {
      points = [startPosition, y + startWidth * outer, startPosition, y - startWidth * inner, endPosition, y - endWidth * inner, endPosition, y + endWidth * outer];
    }

    return that._renderer.path(points, 'area');
  },
  measure: function measure(layout) {
    var result = {};
    var width;
    result.min = result.max = layout[this.vertical ? 'x' : 'y'];
    width = this._options.width;
    width = _Number(width) || _max(_Number(width.start), _Number(width.end));
    result.min -= this._inner * width;
    result.max += this._outer * width;
    return result;
  }
});

var _default = LinearRangeContainer;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
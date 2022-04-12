"use strict";

exports.animation = void 0;

var _fx = _interopRequireDefault(require("../../animation/fx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ANIMATION_DURATION = 400;
var animation = {
  moveTo: function moveTo($element, position, completeAction) {
    _fx.default.animate($element, {
      type: 'slide',
      to: {
        left: position
      },
      duration: ANIMATION_DURATION,
      complete: completeAction
    });
  },
  complete: function complete($element) {
    _fx.default.stop($element, true);
  }
};
exports.animation = animation;
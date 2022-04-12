"use strict";

exports.animation = exports._translator = void 0;

var _fx = _interopRequireDefault(require("../../animation/fx"));

var _translator2 = require("../../animation/translator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _translator = {
  move: function move($element, position) {
    (0, _translator2.move)($element, {
      left: position
    });
  }
};
exports._translator = _translator;
var animation = {
  moveTo: function moveTo($element, position, duration, completeAction) {
    _fx.default.animate($element, {
      type: 'slide',
      to: {
        left: position
      },
      duration: duration,
      complete: completeAction
    });
  },
  complete: function complete($element) {
    _fx.default.stop($element, true);
  }
};
exports.animation = animation;
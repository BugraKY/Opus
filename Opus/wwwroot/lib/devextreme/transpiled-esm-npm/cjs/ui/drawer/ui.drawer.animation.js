"use strict";

exports.animation = void 0;

var _fx = _interopRequireDefault(require("../../animation/fx"));

var _inflector = require("../../core/utils/inflector");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var animation = {
  moveTo: function moveTo(config) {
    var $element = config.$element;
    var position = config.position;
    var direction = config.direction || 'left';
    var toConfig = {};
    var animationType;

    switch (direction) {
      case 'right':
        toConfig['transform'] = 'translate(' + position + 'px, 0px)';
        animationType = 'custom';
        break;

      case 'left':
        toConfig['left'] = position;
        animationType = 'slide';
        break;

      case 'top':
      case 'bottom':
        toConfig['top'] = position;
        animationType = 'slide';
    }

    _fx.default.animate($element, {
      type: animationType,
      to: toConfig,
      duration: config.duration,
      complete: config.complete
    });
  },
  margin: function margin(config) {
    var $element = config.$element;
    var margin = config.margin;
    var direction = config.direction || 'left';
    var toConfig = {};
    toConfig['margin' + (0, _inflector.camelize)(direction, true)] = margin;

    _fx.default.animate($element, {
      to: toConfig,
      duration: config.duration,
      complete: config.complete
    });
  },
  fade: function fade($element, config, duration, completeAction) {
    _fx.default.animate($element, {
      type: 'fade',
      to: config.to,
      from: config.from,
      duration: duration,
      complete: completeAction
    });
  },
  size: function size(config) {
    var $element = config.$element;
    var size = config.size;
    var direction = config.direction || 'left';
    var marginTop = config.marginTop || 0;
    var duration = config.duration;
    var toConfig = {};

    if (direction === 'right' || direction === 'left') {
      toConfig['width'] = size;
    } else {
      toConfig['height'] = size;
    }

    if (direction === 'bottom') {
      toConfig['marginTop'] = marginTop;
    }

    _fx.default.animate($element, {
      to: toConfig,
      duration: duration,
      complete: config.complete
    });
  },
  complete: function complete($element) {
    _fx.default.stop($element, true);
  }
};
exports.animation = animation;
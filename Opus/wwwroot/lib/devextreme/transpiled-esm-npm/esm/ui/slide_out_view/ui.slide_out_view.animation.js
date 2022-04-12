import fx from '../../animation/fx';
var ANIMATION_DURATION = 400;
export var animation = {
  moveTo: function moveTo($element, position, completeAction) {
    fx.animate($element, {
      type: 'slide',
      to: {
        left: position
      },
      duration: ANIMATION_DURATION,
      complete: completeAction
    });
  },
  complete: function complete($element) {
    fx.stop($element, true);
  }
};
import fx from '../../animation/fx';
import { move } from '../../animation/translator';
export var _translator = {
  move($element, position) {
    move($element, {
      left: position
    });
  }

};
export var animation = {
  moveTo($element, position, duration, completeAction) {
    fx.animate($element, {
      type: 'slide',
      to: {
        left: position
      },
      duration: duration,
      complete: completeAction
    });
  },

  complete($element) {
    fx.stop($element, true);
  }

};
import $ from '../core/renderer';
import Action from '../core/action';
import { value } from '../core/utils/view_port';
import { extend } from '../core/utils/extend';
import { isPlainObject } from '../core/utils/type';
import Toast from './toast';
var $notify = null;

var notify = function notify(message,
/* optional */
type, displayTime) {
  var options = isPlainObject(message) ? message : {
    message: message
  };
  var userHiddenAction = options.onHidden;
  extend(options, {
    type: type,
    displayTime: displayTime,
    onHidden: function onHidden(args) {
      $(args.element).remove();
      new Action(userHiddenAction, {
        context: args.model
      }).execute(arguments);
    }
  });
  $notify = $('<div>').appendTo(value());
  new Toast($notify, options).show();
};

export default notify;
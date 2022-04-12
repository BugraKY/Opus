// eslint-disable-next-line no-restricted-imports
import jQuery from 'jquery';
import eventsEngine from '../../events/core/events_engine';
import useJQueryFn from './use_jquery';
import registerEventCallbacks from '../../events/core/event_registrator_callbacks';
import domAdapter from '../../core/dom_adapter';
var useJQuery = useJQueryFn();

if (useJQuery) {
  registerEventCallbacks.add(function (name, eventObject) {
    jQuery.event.special[name] = eventObject;
  });

  if (eventsEngine.passiveEventHandlersSupported()) {
    eventsEngine.forcePassiveFalseEventNames.forEach(function (eventName) {
      jQuery.event.special[eventName] = {
        setup: function setup(data, namespaces, handler) {
          domAdapter.listen(this, eventName, handler, {
            passive: false
          });
        }
      };
    });
  }

  eventsEngine.set({
    on: function on(element) {
      jQuery(element).on.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
    },
    one: function one(element) {
      jQuery(element).one.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
    },
    off: function off(element) {
      jQuery(element).off.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
    },
    trigger: function trigger(element) {
      jQuery(element).trigger.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
    },
    triggerHandler: function triggerHandler(element) {
      jQuery(element).triggerHandler.apply(jQuery(element), Array.prototype.slice.call(arguments, 1));
    },
    Event: jQuery.Event
  });
}
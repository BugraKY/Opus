import $ from '../core/renderer';
import eventsEngine from './core/events_engine';

var triggerVisibilityChangeEvent = function triggerVisibilityChangeEvent(eventName) {
  var VISIBILITY_CHANGE_SELECTOR = '.dx-visibility-change-handler';
  return function (element) {
    var $element = $(element || 'body');
    var changeHandlers = $element.filter(VISIBILITY_CHANGE_SELECTOR).add($element.find(VISIBILITY_CHANGE_SELECTOR));

    for (var i = 0; i < changeHandlers.length; i++) {
      eventsEngine.triggerHandler(changeHandlers[i], eventName);
    }
  };
};

export var triggerShownEvent = triggerVisibilityChangeEvent('dxshown');
export var triggerHidingEvent = triggerVisibilityChangeEvent('dxhiding');
export var triggerResizeEvent = triggerVisibilityChangeEvent('dxresize');
import eventsEngine from './core/events_engine';
/**
* @name events
*/

export var on = eventsEngine.on;
export var one = eventsEngine.one;
export var off = eventsEngine.off;
export var trigger = eventsEngine.trigger;
export var triggerHandler = eventsEngine.triggerHandler;
/**
* @name events.Event
* @type function
* @param1 source:string|event
* @param2 config:object
* @return event
* @module events
* @export Event
* @hidden
*/

export var Event = eventsEngine.Event;
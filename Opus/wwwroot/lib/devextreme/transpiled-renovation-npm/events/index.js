"use strict";

exports.triggerHandler = exports.trigger = exports.one = exports.on = exports.off = exports.Event = void 0;

var _events_engine = _interopRequireDefault(require("./core/events_engine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @name events
*/
var on = _events_engine.default.on;
exports.on = on;
var one = _events_engine.default.one;
exports.one = one;
var off = _events_engine.default.off;
exports.off = off;
var trigger = _events_engine.default.trigger;
exports.trigger = trigger;
var triggerHandler = _events_engine.default.triggerHandler;
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

exports.triggerHandler = triggerHandler;
var Event = _events_engine.default.Event;
exports.Event = Event;
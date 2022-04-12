import eventsEngine from '../events/core/events_engine';
import { removeData, data as elementData } from '../core/element_data';
import Class from '../core/class';
import devices from '../core/devices';
import registerEvent from './core/event_registrator';
import { addNamespace, isTouchEvent, fireEvent } from './utils/index';
import pointerEvents from './pointer';
var HOVERSTART_NAMESPACE = 'dxHoverStart';
var HOVERSTART = 'dxhoverstart';
var POINTERENTER_NAMESPACED_EVENT_NAME = addNamespace(pointerEvents.enter, HOVERSTART_NAMESPACE);
var HOVEREND_NAMESPACE = 'dxHoverEnd';
var HOVEREND = 'dxhoverend';
var POINTERLEAVE_NAMESPACED_EVENT_NAME = addNamespace(pointerEvents.leave, HOVEREND_NAMESPACE);
var Hover = Class.inherit({
  noBubble: true,
  ctor: function ctor() {
    this._handlerArrayKeyPath = this._eventNamespace + '_HandlerStore';
  },
  setup: function setup(element) {
    elementData(element, this._handlerArrayKeyPath, {});
  },
  add: function add(element, handleObj) {
    var that = this;

    var handler = function handler(e) {
      that._handler(e);
    };

    eventsEngine.on(element, this._originalEventName, handleObj.selector, handler);
    elementData(element, this._handlerArrayKeyPath)[handleObj.guid] = handler;
  },
  _handler: function _handler(e) {
    if (isTouchEvent(e) || devices.isSimulator()) {
      return;
    }

    fireEvent({
      type: this._eventName,
      originalEvent: e,
      delegateTarget: e.delegateTarget
    });
  },
  remove: function remove(element, handleObj) {
    var handler = elementData(element, this._handlerArrayKeyPath)[handleObj.guid];
    eventsEngine.off(element, this._originalEventName, handleObj.selector, handler);
  },
  teardown: function teardown(element) {
    removeData(element, this._handlerArrayKeyPath);
  }
});
var HoverStart = Hover.inherit({
  ctor: function ctor() {
    this._eventNamespace = HOVERSTART_NAMESPACE;
    this._eventName = HOVERSTART;
    this._originalEventName = POINTERENTER_NAMESPACED_EVENT_NAME;
    this.callBase();
  },
  _handler: function _handler(e) {
    var pointers = e.pointers || [];

    if (!pointers.length) {
      this.callBase(e);
    }
  }
});
var HoverEnd = Hover.inherit({
  ctor: function ctor() {
    this._eventNamespace = HOVEREND_NAMESPACE;
    this._eventName = HOVEREND;
    this._originalEventName = POINTERLEAVE_NAMESPACED_EVENT_NAME;
    this.callBase();
  }
});
/**
 * @name UI Events.dxhoverstart
 * @type eventType
 * @type_function_param1 event:event
 * @module events/hover
*/

/**
 * @name UI Events.dxhoverend
 * @type eventType
 * @type_function_param1 event:event
 * @module events/hover
*/

registerEvent(HOVERSTART, new HoverStart());
registerEvent(HOVEREND, new HoverEnd());
export { HOVERSTART as start, HOVEREND as end };
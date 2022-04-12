import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import { touch } from '../core/utils/support';
import devices from '../core/devices';
import Class from '../core/class';
import registerEvent from './core/event_registrator';
import { addNamespace, fireEvent, isMouseEvent } from './utils/index';
import holdEvent from './hold';
var CONTEXTMENU_NAMESPACE = 'dxContexMenu';
var CONTEXTMENU_NAMESPACED_EVENT_NAME = addNamespace('contextmenu', CONTEXTMENU_NAMESPACE);
var HOLD_NAMESPACED_EVENT_NAME = addNamespace(holdEvent.name, CONTEXTMENU_NAMESPACE);
var CONTEXTMENU_EVENT_NAME = 'dxcontextmenu';
var ContextMenu = Class.inherit({
  setup: function setup(element) {
    var $element = $(element);
    eventsEngine.on($element, CONTEXTMENU_NAMESPACED_EVENT_NAME, this._contextMenuHandler.bind(this));

    if (touch || devices.isSimulator()) {
      eventsEngine.on($element, HOLD_NAMESPACED_EVENT_NAME, this._holdHandler.bind(this));
    }
  },
  _holdHandler: function _holdHandler(e) {
    if (isMouseEvent(e) && !devices.isSimulator()) {
      return;
    }

    this._fireContextMenu(e);
  },
  _contextMenuHandler: function _contextMenuHandler(e) {
    this._fireContextMenu(e);
  },
  _fireContextMenu: function _fireContextMenu(e) {
    return fireEvent({
      type: CONTEXTMENU_EVENT_NAME,
      originalEvent: e
    });
  },
  teardown: function teardown(element) {
    eventsEngine.off(element, '.' + CONTEXTMENU_NAMESPACE);
  }
});
/**
  * @name UI Events.dxcontextmenu
  * @type eventType
  * @type_function_param1 event:event
  * @module events/contextmenu
*/

registerEvent(CONTEXTMENU_EVENT_NAME, new ContextMenu());
export var name = CONTEXTMENU_EVENT_NAME;
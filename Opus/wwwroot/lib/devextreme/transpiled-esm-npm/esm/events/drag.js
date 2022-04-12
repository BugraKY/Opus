import $ from '../core/renderer';
import { data as elementData, removeData } from '../core/element_data';
import { wrapToArray, inArray } from '../core/utils/array';
import * as iteratorUtils from '../core/utils/iterator';
import { contains } from '../core/utils/dom';
import registerEvent from './core/event_registrator';
import { eventData as eData, fireEvent } from './utils/index';
import GestureEmitter from './gesture/emitter.gesture';
import registerEmitter from './core/emitter_registrator';
var DRAG_START_EVENT = 'dxdragstart';
var DRAG_EVENT = 'dxdrag';
var DRAG_END_EVENT = 'dxdragend';
var DRAG_ENTER_EVENT = 'dxdragenter';
var DRAG_LEAVE_EVENT = 'dxdragleave';
var DROP_EVENT = 'dxdrop';
var DX_DRAG_EVENTS_COUNT_KEY = 'dxDragEventsCount';
var knownDropTargets = [];
var knownDropTargetSelectors = [];
var knownDropTargetConfigs = [];
var dropTargetRegistration = {
  setup: function setup(element, data) {
    var knownDropTarget = inArray(element, knownDropTargets) !== -1;

    if (!knownDropTarget) {
      knownDropTargets.push(element);
      knownDropTargetSelectors.push([]);
      knownDropTargetConfigs.push(data || {});
    }
  },
  add: function add(element, handleObj) {
    var index = inArray(element, knownDropTargets);
    this.updateEventsCounter(element, handleObj.type, 1);
    var selector = handleObj.selector;

    if (inArray(selector, knownDropTargetSelectors[index]) === -1) {
      knownDropTargetSelectors[index].push(selector);
    }
  },
  updateEventsCounter: function updateEventsCounter(element, event, value) {
    if ([DRAG_ENTER_EVENT, DRAG_LEAVE_EVENT, DROP_EVENT].indexOf(event) > -1) {
      var eventsCount = elementData(element, DX_DRAG_EVENTS_COUNT_KEY) || 0;
      elementData(element, DX_DRAG_EVENTS_COUNT_KEY, Math.max(0, eventsCount + value));
    }
  },
  remove: function remove(element, handleObj) {
    this.updateEventsCounter(element, handleObj.type, -1);
  },
  teardown: function teardown(element) {
    var handlersCount = elementData(element, DX_DRAG_EVENTS_COUNT_KEY);

    if (!handlersCount) {
      var index = inArray(element, knownDropTargets);
      knownDropTargets.splice(index, 1);
      knownDropTargetSelectors.splice(index, 1);
      knownDropTargetConfigs.splice(index, 1);
      removeData(element, DX_DRAG_EVENTS_COUNT_KEY);
    }
  }
};
/**
* @name UI Events.dxdragenter
* @type eventType
* @type_function_param1 event:event
* @type_function_param1_field1 draggingElement:Element
* @module events/drag
*/

/**
* @name UI Events.dxdrop
* @type eventType
* @type_function_param1 event:event
* @type_function_param1_field1 draggingElement:Element
* @module events/drag
*/

/**
* @name UI Events.dxdragleave
* @type eventType
* @type_function_param1 event:event
* @type_function_param1_field1 draggingElement:Element
* @module events/drag
*/

registerEvent(DRAG_ENTER_EVENT, dropTargetRegistration);
registerEvent(DRAG_LEAVE_EVENT, dropTargetRegistration);
registerEvent(DROP_EVENT, dropTargetRegistration);

var getItemDelegatedTargets = function getItemDelegatedTargets($element) {
  var dropTargetIndex = inArray($element.get(0), knownDropTargets);
  var dropTargetSelectors = knownDropTargetSelectors[dropTargetIndex].filter(selector => selector);
  var $delegatedTargets = $element.find(dropTargetSelectors.join(', '));

  if (inArray(undefined, knownDropTargetSelectors[dropTargetIndex]) !== -1) {
    $delegatedTargets = $delegatedTargets.add($element);
  }

  return $delegatedTargets;
};

var getItemConfig = function getItemConfig($element) {
  var dropTargetIndex = inArray($element.get(0), knownDropTargets);
  return knownDropTargetConfigs[dropTargetIndex];
};

var getItemPosition = function getItemPosition(dropTargetConfig, $element) {
  if (dropTargetConfig.itemPositionFunc) {
    return dropTargetConfig.itemPositionFunc($element);
  } else {
    return $element.offset();
  }
};

var getItemSize = function getItemSize(dropTargetConfig, $element) {
  if (dropTargetConfig.itemSizeFunc) {
    return dropTargetConfig.itemSizeFunc($element);
  }

  return {
    width: $element.get(0).getBoundingClientRect().width,
    height: $element.get(0).getBoundingClientRect().height
  };
};

var DragEmitter = GestureEmitter.inherit({
  ctor: function ctor(element) {
    this.callBase(element);
    this.direction = 'both';
  },
  _init: function _init(e) {
    this._initEvent = e;
  },
  _start: function _start(e) {
    e = this._fireEvent(DRAG_START_EVENT, this._initEvent);
    this._maxLeftOffset = e.maxLeftOffset;
    this._maxRightOffset = e.maxRightOffset;
    this._maxTopOffset = e.maxTopOffset;
    this._maxBottomOffset = e.maxBottomOffset;
    var dropTargets = wrapToArray(e.targetElements || (e.targetElements === null ? [] : knownDropTargets));
    this._dropTargets = iteratorUtils.map(dropTargets, function (element) {
      return $(element).get(0);
    });
  },
  _move: function _move(e) {
    var eventData = eData(e);

    var dragOffset = this._calculateOffset(eventData);

    e = this._fireEvent(DRAG_EVENT, e, {
      offset: dragOffset
    });

    this._processDropTargets(e);

    if (!e._cancelPreventDefault) {
      e.preventDefault();
    }
  },
  _calculateOffset: function _calculateOffset(eventData) {
    return {
      x: this._calculateXOffset(eventData),
      y: this._calculateYOffset(eventData)
    };
  },
  _calculateXOffset: function _calculateXOffset(eventData) {
    if (this.direction !== 'vertical') {
      var offset = eventData.x - this._startEventData.x;
      return this._fitOffset(offset, this._maxLeftOffset, this._maxRightOffset);
    }

    return 0;
  },
  _calculateYOffset: function _calculateYOffset(eventData) {
    if (this.direction !== 'horizontal') {
      var offset = eventData.y - this._startEventData.y;
      return this._fitOffset(offset, this._maxTopOffset, this._maxBottomOffset);
    }

    return 0;
  },
  _fitOffset: function _fitOffset(offset, minOffset, maxOffset) {
    if (minOffset != null) {
      offset = Math.max(offset, -minOffset);
    }

    if (maxOffset != null) {
      offset = Math.min(offset, maxOffset);
    }

    return offset;
  },
  _processDropTargets: function _processDropTargets(e) {
    var target = this._findDropTarget(e);

    var sameTarget = target === this._currentDropTarget;

    if (!sameTarget) {
      this._fireDropTargetEvent(e, DRAG_LEAVE_EVENT);

      this._currentDropTarget = target;

      this._fireDropTargetEvent(e, DRAG_ENTER_EVENT);
    }
  },
  _fireDropTargetEvent: function _fireDropTargetEvent(event, eventName) {
    if (!this._currentDropTarget) {
      return;
    }

    var eventData = {
      type: eventName,
      originalEvent: event,
      draggingElement: this._$element.get(0),
      target: this._currentDropTarget
    };
    fireEvent(eventData);
  },
  _findDropTarget: function _findDropTarget(e) {
    var that = this;
    var result;
    iteratorUtils.each(knownDropTargets, function (_, target) {
      if (!that._checkDropTargetActive(target)) {
        return;
      }

      var $target = $(target);
      iteratorUtils.each(getItemDelegatedTargets($target), function (_, delegatedTarget) {
        var $delegatedTarget = $(delegatedTarget);

        if (that._checkDropTarget(getItemConfig($target), $delegatedTarget, $(result), e)) {
          result = delegatedTarget;
        }
      });
    });
    return result;
  },
  _checkDropTargetActive: function _checkDropTargetActive(target) {
    var active = false;
    iteratorUtils.each(this._dropTargets, function (_, activeTarget) {
      active = active || activeTarget === target || contains(activeTarget, target);
      return !active;
    });
    return active;
  },
  _checkDropTarget: function _checkDropTarget(config, $target, $prevTarget, e) {
    var isDraggingElement = $target.get(0) === $(e.target).get(0);

    if (isDraggingElement) {
      return false;
    }

    var targetPosition = getItemPosition(config, $target);

    if (e.pageX < targetPosition.left) {
      return false;
    }

    if (e.pageY < targetPosition.top) {
      return false;
    }

    var targetSize = getItemSize(config, $target);

    if (e.pageX > targetPosition.left + targetSize.width) {
      return false;
    }

    if (e.pageY > targetPosition.top + targetSize.height) {
      return false;
    }

    if ($prevTarget.length && $prevTarget.closest($target).length) {
      return false;
    }

    if (config.checkDropTarget && !config.checkDropTarget($target, e)) {
      return false;
    }

    return $target;
  },
  _end: function _end(e) {
    var eventData = eData(e);

    this._fireEvent(DRAG_END_EVENT, e, {
      offset: this._calculateOffset(eventData)
    });

    this._fireDropTargetEvent(e, DROP_EVENT);

    delete this._currentDropTarget;
  }
});
/**
 * @name UI Events.dxdragstart
 * @type eventType
 * @type_function_param1 event:event
 * @type_function_param1_field1 cancel:boolean
 * @module events/drag
*/

/**
  * @name UI Events.dxdrag
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 offset:number
  * @type_function_param1_field2 cancel:boolean
  * @module events/drag
*/

/**
  * @name UI Events.dxdragend
  * @type eventType
  * @type_function_param1 event:event
  * @type_function_param1_field1 offset:number
  * @type_function_param1_field2 cancel:boolean
  * @module events/drag
*/

registerEmitter({
  emitter: DragEmitter,
  events: [DRAG_START_EVENT, DRAG_EVENT, DRAG_END_EVENT]
});
export { DRAG_EVENT as move, DRAG_START_EVENT as start, DRAG_END_EVENT as end, DRAG_ENTER_EVENT as enter, DRAG_LEAVE_EVENT as leave, DROP_EVENT as drop };
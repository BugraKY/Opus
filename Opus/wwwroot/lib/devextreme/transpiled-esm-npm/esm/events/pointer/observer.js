import { each } from '../../core/utils/iterator';
import readyCallbacks from '../../core/utils/ready_callbacks';
import domAdapter from '../../core/dom_adapter';

var addEventsListener = function addEventsListener(events, handler) {
  readyCallbacks.add(function () {
    events.split(' ').forEach(function (event) {
      domAdapter.listen(domAdapter.getDocument(), event, handler, true);
    });
  });
};

var Observer = function Observer(eventMap, pointerEquals, onPointerAdding) {
  onPointerAdding = onPointerAdding || function () {};

  var pointers = [];

  var getPointerIndex = function getPointerIndex(e) {
    var index = -1;
    each(pointers, function (i, pointer) {
      if (!pointerEquals(e, pointer)) {
        return true;
      }

      index = i;
      return false;
    });
    return index;
  };

  var addPointer = function addPointer(e) {
    if (getPointerIndex(e) === -1) {
      onPointerAdding(e);
      pointers.push(e);
    }
  };

  var removePointer = function removePointer(e) {
    var index = getPointerIndex(e);

    if (index > -1) {
      pointers.splice(index, 1);
    }
  };

  var updatePointer = function updatePointer(e) {
    pointers[getPointerIndex(e)] = e;
  };

  addEventsListener(eventMap['dxpointerdown'], addPointer);
  addEventsListener(eventMap['dxpointermove'], updatePointer);
  addEventsListener(eventMap['dxpointerup'], removePointer);
  addEventsListener(eventMap['dxpointercancel'], removePointer);

  this.pointers = function () {
    return pointers;
  };

  this.reset = function () {
    pointers = [];
  };
};

export default Observer;
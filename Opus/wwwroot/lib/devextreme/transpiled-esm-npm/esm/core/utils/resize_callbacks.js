import { hasWindow, getWindow } from './window';
import domAdapter from '../dom_adapter';
import Callbacks from './callbacks';
import readyCallbacks from './ready_callbacks';
import callOnce from './call_once';

var resizeCallbacks = function () {
  var prevSize;
  var callbacks = Callbacks();
  var originalCallbacksAdd = callbacks.add;
  var originalCallbacksRemove = callbacks.remove;

  if (!hasWindow()) {
    return callbacks;
  }

  var formatSize = function formatSize() {
    var window = getWindow();
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  };

  var handleResize = function handleResize() {
    var now = formatSize();

    if (now.width === prevSize.width && now.height === prevSize.height) {
      return;
    }

    var changedDimension;

    if (now.width === prevSize.width) {
      changedDimension = 'height';
    }

    if (now.height === prevSize.height) {
      changedDimension = 'width';
    }

    prevSize = now;
    callbacks.fire(changedDimension);
  };

  var setPrevSize = callOnce(function () {
    prevSize = formatSize();
  });
  var removeListener;

  callbacks.add = function () {
    var result = originalCallbacksAdd.apply(callbacks, arguments);
    setPrevSize();
    readyCallbacks.add(function () {
      if (!removeListener && callbacks.has()) {
        removeListener = domAdapter.listen(getWindow(), 'resize', handleResize);
      }
    });
    return result;
  };

  callbacks.remove = function () {
    var result = originalCallbacksRemove.apply(callbacks, arguments);

    if (!callbacks.has() && removeListener) {
      removeListener();
      removeListener = undefined;
    }

    return result;
  };

  return callbacks;
}();

export default resizeCallbacks;
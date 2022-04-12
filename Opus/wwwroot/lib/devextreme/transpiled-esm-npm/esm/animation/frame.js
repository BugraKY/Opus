import { hasWindow, getWindow } from '../core/utils/window';
var window = hasWindow() ? getWindow() : {};
import callOnce from '../core/utils/call_once';
var FRAME_ANIMATION_STEP_TIME = 1000 / 60;

var request = function request(callback) {
  return setTimeout(callback, FRAME_ANIMATION_STEP_TIME);
};

var cancel = function cancel(requestID) {
  clearTimeout(requestID);
};

var setAnimationFrameMethods = callOnce(function () {
  var nativeRequest = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
  var nativeCancel = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;

  if (nativeRequest && nativeCancel) {
    request = nativeRequest;
    cancel = nativeCancel;
  }

  if (nativeRequest && !nativeCancel) {
    // NOTE: https://code.google.com/p/android/issues/detail?id=66243
    var canceledRequests = {};

    request = function request(callback) {
      var requestId = nativeRequest.call(window, function () {
        try {
          if (requestId in canceledRequests) {
            return;
          }

          callback.apply(this, arguments);
        } finally {
          delete canceledRequests[requestId];
        }
      });
      return requestId;
    };

    cancel = function cancel(requestId) {
      canceledRequests[requestId] = true;
    };
  }
});
export function requestAnimationFrame() {
  setAnimationFrameMethods();
  return request.apply(window, arguments);
}
export function cancelAnimationFrame() {
  setAnimationFrameMethods();
  cancel.apply(window, arguments);
}
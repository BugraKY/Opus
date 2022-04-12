import { isFunction } from '../core/utils/type';
import domAdapter from '../core/dom_adapter';
import readyCallbacks from '../core/utils/ready_callbacks';
import { getWindow } from '../core/utils/window';
import { map } from '../core/utils/iterator';
import { Deferred } from '../core/utils/deferred';
import { equalByValue } from '../core/utils/common';
var ready = readyCallbacks.add;
export var XHR_ERROR_UNLOAD = 'DEVEXTREME_XHR_ERROR_UNLOAD';
export var normalizeBinaryCriterion = function normalizeBinaryCriterion(crit) {
  return [crit[0], crit.length < 3 ? '=' : String(crit[1]).toLowerCase(), crit.length < 2 ? true : crit[crit.length - 1]];
};
export var normalizeSortingInfo = function normalizeSortingInfo(info) {
  if (!Array.isArray(info)) {
    info = [info];
  }

  return map(info, function (i) {
    var result = {
      selector: isFunction(i) || typeof i === 'string' ? i : i.getter || i.field || i.selector,
      desc: !!(i.desc || String(i.dir).charAt(0).toLowerCase() === 'd')
    };

    if (i.compare) {
      result.compare = i.compare;
    }

    return result;
  });
};
export var errorMessageFromXhr = function () {
  var textStatusMessages = {
    'timeout': 'Network connection timeout',
    'error': 'Unspecified network error',
    'parsererror': 'Unexpected server response'
  };

  var explainTextStatus = function explainTextStatus(textStatus) {
    var result = textStatusMessages[textStatus];

    if (!result) {
      return textStatus;
    }

    return result;
  }; // T542570, https://stackoverflow.com/a/18170879


  var unloading;
  ready(function () {
    var window = getWindow();
    domAdapter.listen(window, 'beforeunload', function () {
      unloading = true;
    });
  });
  return function (xhr, textStatus) {
    if (unloading) {
      return XHR_ERROR_UNLOAD;
    }

    if (xhr.status < 400) {
      return explainTextStatus(textStatus);
    }

    return xhr.statusText;
  };
}();
export var aggregators = {
  count: {
    seed: 0,
    step: function step(count) {
      return 1 + count;
    }
  },
  sum: {
    seed: 0,
    step: function step(sum, item) {
      return sum + item;
    }
  },
  min: {
    step: function step(min, item) {
      return item < min ? item : min;
    }
  },
  max: {
    step: function step(max, item) {
      return item > max ? item : max;
    }
  },
  avg: {
    seed: [0, 0],
    step: function step(pair, value) {
      return [pair[0] + value, pair[1] + 1];
    },
    finalize: function finalize(pair) {
      return pair[1] ? pair[0] / pair[1] : NaN;
    }
  }
};
export var processRequestResultLock = function () {
  var lockCount = 0;
  var lockDeferred;

  var obtain = function obtain() {
    if (lockCount === 0) {
      lockDeferred = new Deferred();
    }

    lockCount++;
  };

  var release = function release() {
    lockCount--;

    if (lockCount < 1) {
      lockDeferred.resolve();
    }
  };

  var promise = function promise() {
    var deferred = lockCount === 0 ? new Deferred().resolve() : lockDeferred;
    return deferred.promise();
  };

  var reset = function reset() {
    lockCount = 0;

    if (lockDeferred) {
      lockDeferred.resolve();
    }
  };

  return {
    obtain: obtain,
    release: release,
    promise: promise,
    reset: reset
  };
}();
export function isDisjunctiveOperator(condition) {
  return /^(or|\|\||\|)$/i.test(condition);
}
export function isConjunctiveOperator(condition) {
  return /^(and|&&|&)$/i.test(condition);
}
export var keysEqual = function keysEqual(keyExpr, key1, key2) {
  if (Array.isArray(keyExpr)) {
    var names = map(key1, function (v, k) {
      return k;
    });
    var name;

    for (var i = 0; i < names.length; i++) {
      name = names[i];

      if (!equalByValue(key1[name], key2[name], 0, false)) {
        return false;
      }
    }

    return true;
  }

  return equalByValue(key1, key2, 0, false);
};
var BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export var base64_encode = function base64_encode(input) {
  if (!Array.isArray(input)) {
    input = stringToByteArray(String(input));
  }

  var result = '';

  function getBase64Char(index) {
    return BASE64_CHARS.charAt(index);
  }

  for (var i = 0; i < input.length; i += 3) {
    var octet1 = input[i];
    var octet2 = input[i + 1];
    var octet3 = input[i + 2];
    result += map([octet1 >> 2, (octet1 & 3) << 4 | octet2 >> 4, isNaN(octet2) ? 64 : (octet2 & 15) << 2 | octet3 >> 6, isNaN(octet3) ? 64 : octet3 & 63], getBase64Char).join('');
  }

  return result;
};

function stringToByteArray(str) {
  var bytes = [];
  var code;
  var i;

  for (i = 0; i < str.length; i++) {
    code = str.charCodeAt(i);

    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push(192 + (code >> 6), 128 + (code & 63));
    } else if (code < 65536) {
      bytes.push(224 + (code >> 12), 128 + (code >> 6 & 63), 128 + (code & 63));
    } else if (code < 2097152) {
      bytes.push(240 + (code >> 18), 128 + (code >> 12 & 63), 128 + (code >> 6 & 63), 128 + (code & 63));
    }
  }

  return bytes;
}

export var isUnaryOperation = function isUnaryOperation(crit) {
  return crit[0] === '!' && Array.isArray(crit[1]);
};

var isGroupOperator = function isGroupOperator(value) {
  return value === 'and' || value === 'or';
};

export var isGroupCriterion = function isGroupCriterion(crit) {
  var first = crit[0];
  var second = crit[1];

  if (Array.isArray(first)) {
    return true;
  }

  if (isFunction(first)) {
    if (Array.isArray(second) || isFunction(second) || isGroupOperator(second)) {
      return true;
    }
  }

  return false;
};
export var trivialPromise = function trivialPromise() {
  var d = new Deferred();
  return d.resolve.apply(d, arguments).promise();
};
export var rejectedPromise = function rejectedPromise() {
  var d = new Deferred();
  return d.reject.apply(d, arguments).promise();
};

function throttle(func, timeout) {
  var timeoutId;
  var lastArgs;
  return function () {
    lastArgs = arguments;

    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = undefined;

        if (lastArgs) {
          func.call(this, lastArgs);
        }
      }, isFunction(timeout) ? timeout() : timeout);
    }

    return timeoutId;
  };
}

export function throttleChanges(func, timeout) {
  var cache = [];
  var throttled = throttle(function () {
    func.call(this, cache);
    cache = [];
  }, timeout);
  return function (changes) {
    if (Array.isArray(changes)) {
      cache.push(...changes);
    }

    return throttled.call(this, cache);
  };
}
/**
* @name Utils
*/
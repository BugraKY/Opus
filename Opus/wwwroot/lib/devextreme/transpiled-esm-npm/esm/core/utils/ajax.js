import { Deferred } from './deferred';
import domAdapter from '../../core/dom_adapter';
import httpRequest from '../../core/http_request';
import { getWindow, hasWindow } from '../../core/utils/window';
var window = getWindow();
import { extendFromObject } from './extend';
import { isDefined } from './type';
import Promise from '../polyfills/promise';
import injector from './dependency_injector';
var SUCCESS = 'success';
var ERROR = 'error';
var TIMEOUT = 'timeout';
var NO_CONTENT = 'nocontent';
var PARSER_ERROR = 'parsererror';

var isStatusSuccess = function isStatusSuccess(status) {
  return 200 <= status && status < 300;
};

var hasContent = function hasContent(status) {
  return status !== 204;
};

var paramsConvert = function paramsConvert(params) {
  var result = [];

  for (var name in params) {
    var value = params[name];

    if (value === undefined) {
      continue;
    }

    if (value === null) {
      value = '';
    }

    if (typeof value === 'function') {
      value = value();
    }

    result.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
  }

  return result.join('&');
};

var createScript = function createScript(options) {
  var script = domAdapter.createElement('script');

  for (var name in options) {
    script[name] = options[name];
  }

  return script;
};

var removeScript = function removeScript(scriptNode) {
  scriptNode.parentNode.removeChild(scriptNode);
};

var appendToHead = function appendToHead(element) {
  return domAdapter.getHead().appendChild(element);
};

var evalScript = function evalScript(code) {
  var script = createScript({
    text: code
  });
  appendToHead(script);
  removeScript(script);
};

var evalCrossDomainScript = function evalCrossDomainScript(url) {
  var script = createScript({
    src: url
  });
  return new Promise(function (resolve, reject) {
    var events = {
      'load': resolve,
      'error': reject
    };

    var loadHandler = function loadHandler(e) {
      events[e.type]();
      removeScript(script);
    };

    for (var event in events) {
      domAdapter.listen(script, event, loadHandler);
    }

    appendToHead(script);
  });
};

var getAcceptHeader = function getAcceptHeader(options) {
  var dataType = options.dataType || '*';
  var scriptAccept = 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript';
  var accepts = {
    '*': '*/*',
    text: 'text/plain',
    html: 'text/html',
    xml: 'application/xml, text/xml',
    json: 'application/json, text/javascript',
    jsonp: scriptAccept,
    script: scriptAccept
  };
  extendFromObject(accepts, options.accepts, true);
  return accepts[dataType] ? accepts[dataType] + (dataType !== '*' ? ', */*; q=0.01' : '') : accepts['*'];
};

var getContentTypeHeader = function getContentTypeHeader(options) {
  var defaultContentType;

  if (options.data && !options.upload && getMethod(options) !== 'GET') {
    defaultContentType = 'application/x-www-form-urlencoded;charset=utf-8';
  }

  return options.contentType || defaultContentType;
};

var getDataFromResponse = function getDataFromResponse(xhr) {
  return xhr.responseType && xhr.responseType !== 'text' || typeof xhr.responseText !== 'string' ? xhr.response : xhr.responseText;
};

var postProcess = function postProcess(deferred, xhr, dataType) {
  var data = getDataFromResponse(xhr);

  switch (dataType) {
    case 'jsonp':
      evalScript(data);
      break;

    case 'script':
      evalScript(data);
      deferred.resolve(data, SUCCESS, xhr);
      break;

    case 'json':
      try {
        deferred.resolve(JSON.parse(data), SUCCESS, xhr);
      } catch (e) {
        deferred.reject(xhr, PARSER_ERROR, e);
      }

      break;

    default:
      deferred.resolve(data, SUCCESS, xhr);
  }
};

var isCrossDomain = function isCrossDomain(url) {
  if (!hasWindow()) {
    return true;
  }

  var crossDomain = false;
  var originAnchor = domAdapter.createElement('a');
  var urlAnchor = domAdapter.createElement('a');
  originAnchor.href = window.location.href;

  try {
    urlAnchor.href = url; // NOTE: IE11
    // eslint-disable-next-line no-self-assign

    urlAnchor.href = urlAnchor.href;
    crossDomain = originAnchor.protocol + '//' + originAnchor.host !== urlAnchor.protocol + '//' + urlAnchor.host;
  } catch (e) {
    crossDomain = true;
  }

  return crossDomain;
};

var setHttpTimeout = function setHttpTimeout(timeout, xhr) {
  return timeout && setTimeout(function () {
    xhr.customStatus = TIMEOUT;
    xhr.abort();
  }, timeout);
};

var getJsonpOptions = function getJsonpOptions(options) {
  if (options.dataType === 'jsonp') {
    var random = Math.random().toString().replace(/\D/g, '');
    var callbackName = options.jsonpCallback || 'dxCallback' + Date.now() + '_' + random;
    var callbackParameter = options.jsonp || 'callback';
    options.data = options.data || {};
    options.data[callbackParameter] = callbackName;
    return callbackName;
  }
};

var getRequestOptions = function getRequestOptions(options, headers) {
  var params = options.data;
  var paramsAlreadyString = typeof params === 'string';
  var url = options.url || window.location.href;

  if (!paramsAlreadyString && !options.cache) {
    params = params || {};
    params['_'] = Date.now();
  }

  if (params && !options.upload) {
    if (!paramsAlreadyString) {
      params = paramsConvert(params);
    }

    if (getMethod(options) === 'GET') {
      if (params !== '') {
        url += (url.indexOf('?') > -1 ? '&' : '?') + params;
      }

      params = null;
    } else if (headers['Content-Type'] && headers['Content-Type'].indexOf('application/x-www-form-urlencoded') > -1) {
      params = params.replace(/%20/g, '+');
    }
  }

  return {
    url: url,
    parameters: params
  };
};

function getMethod(options) {
  return (options.method || 'GET').toUpperCase();
}

var getRequestHeaders = function getRequestHeaders(options) {
  var headers = options.headers || {};
  headers['Content-Type'] = headers['Content-Type'] || getContentTypeHeader(options);
  headers['Accept'] = headers['Accept'] || getAcceptHeader(options);

  if (!options.crossDomain && !headers['X-Requested-With']) {
    headers['X-Requested-With'] = 'XMLHttpRequest';
  }

  return headers;
};

var sendRequest = function sendRequest(options) {
  var xhr = httpRequest.getXhr();
  var d = new Deferred();
  var result = d.promise();
  var async = isDefined(options.async) ? options.async : true;
  var dataType = options.dataType;
  var timeout = options.timeout || 0;
  var timeoutId;
  options.crossDomain = isCrossDomain(options.url);
  var needScriptEvaluation = dataType === 'jsonp' || dataType === 'script';

  if (options.cache === undefined) {
    options.cache = !needScriptEvaluation;
  }

  var callbackName = getJsonpOptions(options);
  var headers = getRequestHeaders(options);
  var requestOptions = getRequestOptions(options, headers);
  var url = requestOptions.url;
  var parameters = requestOptions.parameters;

  if (callbackName) {
    window[callbackName] = function (data) {
      d.resolve(data, SUCCESS, xhr);
    };
  }

  if (options.crossDomain && needScriptEvaluation) {
    var reject = function reject() {
      d.reject(xhr, ERROR);
    };

    var resolve = function resolve() {
      if (dataType === 'jsonp') return;
      d.resolve(null, SUCCESS, xhr);
    };

    evalCrossDomainScript(url).then(resolve, reject);
    return result;
  }

  if (options.crossDomain && !('withCredentials' in xhr)) {
    d.reject(xhr, ERROR);
    return result;
  }

  xhr.open(getMethod(options), url, async, options.username, options.password);

  if (async) {
    xhr.timeout = timeout;
    timeoutId = setHttpTimeout(timeout, xhr, d);
  }

  xhr['onreadystatechange'] = function (e) {
    if (xhr.readyState === 4) {
      clearTimeout(timeoutId);

      if (isStatusSuccess(xhr.status)) {
        if (hasContent(xhr.status)) {
          postProcess(d, xhr, dataType);
        } else {
          d.resolve(null, NO_CONTENT, xhr);
        }
      } else {
        d.reject(xhr, xhr.customStatus || ERROR);
      }
    }
  };

  if (options.upload) {
    xhr.upload['onprogress'] = options.upload['onprogress'];
    xhr.upload['onloadstart'] = options.upload['onloadstart'];
    xhr.upload['onabort'] = options.upload['onabort'];
  }

  if (options.xhrFields) {
    for (var field in options.xhrFields) {
      xhr[field] = options.xhrFields[field];
    }
  }

  if (options.responseType === 'arraybuffer') {
    xhr.responseType = options.responseType;
  }

  for (var name in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, name) && isDefined(headers[name])) {
      xhr.setRequestHeader(name, headers[name]);
    }
  }

  if (options.beforeSend) {
    options.beforeSend(xhr);
  }

  xhr.send(parameters);

  result.abort = function () {
    xhr.abort();
  };

  return result;
};

export default injector({
  sendRequest: sendRequest
});
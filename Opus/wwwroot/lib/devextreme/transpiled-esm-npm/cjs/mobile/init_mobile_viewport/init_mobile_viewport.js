"use strict";

exports.initMobileViewport = void 0;

var _size = require("../../core/utils/size");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

var _window = require("../../core/utils/window");

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _extend = require("../../core/utils/extend");

var _resize_callbacks = _interopRequireDefault(require("../../core/utils/resize_callbacks"));

var _support = require("../../core/utils/support");

var _style = require("../../core/utils/style");

var _devices = _interopRequireDefault(require("../../core/devices"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var window = (0, _window.getWindow)();

var initMobileViewport = function initMobileViewport(options) {
  options = (0, _extend.extend)({}, options);

  var realDevice = _devices.default.real();

  var allowZoom = options.allowZoom;
  var allowPan = options.allowPan;
  var allowSelection = 'allowSelection' in options ? options.allowSelection : realDevice.platform === 'generic';
  var metaSelector = 'meta[name=viewport]';

  if (!(0, _renderer.default)(metaSelector).length) {
    (0, _renderer.default)('<meta>').attr('name', 'viewport').appendTo('head');
  }

  var metaVerbs = ['width=device-width'];
  var msTouchVerbs = [];

  if (allowZoom) {
    msTouchVerbs.push('pinch-zoom');
  } else {
    metaVerbs.push('initial-scale=1.0', 'maximum-scale=1.0, user-scalable=no');
  }

  if (allowPan) {
    msTouchVerbs.push('pan-x', 'pan-y');
  }

  if (!allowPan && !allowZoom) {
    (0, _renderer.default)('html, body').css({
      'msContentZooming': 'none',
      'msUserSelect': 'none',
      'overflow': 'hidden'
    });
  } else {
    (0, _renderer.default)('html').css('msOverflowStyle', '-ms-autohiding-scrollbar');
  }

  if (!allowSelection && (0, _support.supportProp)('userSelect')) {
    (0, _renderer.default)('.dx-viewport').css((0, _style.styleProp)('userSelect'), 'none');
  }

  (0, _renderer.default)(metaSelector).attr('content', metaVerbs.join());
  (0, _renderer.default)('html').css('msTouchAction', msTouchVerbs.join(' ') || 'none');
  realDevice = _devices.default.real();

  if (_support.touch) {
    _events_engine.default.off(_dom_adapter.default.getDocument(), '.dxInitMobileViewport');

    _events_engine.default.on(_dom_adapter.default.getDocument(), 'dxpointermove.dxInitMobileViewport', function (e) {
      var count = e.pointers.length;
      var isTouchEvent = e.pointerType === 'touch';
      var zoomDisabled = !allowZoom && count > 1;
      var panDisabled = !allowPan && count === 1 && !e.isScrollingEvent;

      if (isTouchEvent && (zoomDisabled || panDisabled)) {
        e.preventDefault();
      }
    });
  }

  if (realDevice.ios) {
    var isPhoneGap = _dom_adapter.default.getLocation().protocol === 'file:';

    if (!isPhoneGap) {
      // NOTE: fix app size after device rotation in Safari when keyboard was shown
      _resize_callbacks.default.add(function () {
        var windowWidth = (0, _size.getWidth)(window);
        (0, _size.setWidth)((0, _renderer.default)('body'), windowWidth);
      });
    }
  }

  if (realDevice.android) {
    _resize_callbacks.default.add(function () {
      setTimeout(function () {
        var activeElement = _dom_adapter.default.getActiveElement();

        activeElement.scrollIntoViewIfNeeded ? activeElement.scrollIntoViewIfNeeded() : activeElement.scrollIntoView(false);
      });
    });
  }
};

exports.initMobileViewport = initMobileViewport;
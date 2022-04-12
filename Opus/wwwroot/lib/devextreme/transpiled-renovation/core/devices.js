"use strict";

exports.default = void 0;

var _size = require("./utils/size");

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _window = require("./utils/window");

var _extend = require("./utils/extend");

var _type = require("./utils/type");

var _iterator = require("./utils/iterator");

var _errors = _interopRequireDefault(require("./errors"));

var _callbacks = _interopRequireDefault(require("./utils/callbacks"));

var _ready_callbacks = _interopRequireDefault(require("./utils/ready_callbacks"));

var _resize_callbacks = _interopRequireDefault(require("./utils/resize_callbacks"));

var _events_strategy = require("./events_strategy");

var _storage = require("./utils/storage");

var _view_port = require("./utils/view_port");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var navigator = (0, _window.getNavigator)();
var window = (0, _window.getWindow)();
var KNOWN_UA_TABLE = {
  'iPhone': 'iPhone',
  'iPhone5': 'iPhone',
  'iPhone6': 'iPhone',
  'iPhone6plus': 'iPhone',
  'iPad': 'iPad',
  'iPadMini': 'iPad Mini',
  'androidPhone': 'Android Mobile',
  'androidTablet': 'Android',
  'msSurface': 'Windows ARM Tablet PC',
  'desktop': 'desktop'
};
var DEFAULT_DEVICE = {
  deviceType: 'desktop',
  platform: 'generic',
  version: [],
  phone: false,
  tablet: false,
  android: false,
  ios: false,
  generic: true,
  grade: 'A',
  // TODO: For internal use (draft, do not document these options!)
  mac: false
};
var uaParsers = {
  generic: function generic(userAgent) {
    var isPhone = /windows phone/i.test(userAgent) || userAgent.match(/WPDesktop/);
    var isTablet = !isPhone && /Windows(.*)arm(.*)Tablet PC/i.test(userAgent);
    var isDesktop = !isPhone && !isTablet && /msapphost/i.test(userAgent);
    var isMac = /((intel|ppc) mac os x)/.test(userAgent.toLowerCase());

    if (!(isPhone || isTablet || isDesktop || isMac)) {
      return;
    }

    return {
      deviceType: isPhone ? 'phone' : isTablet ? 'tablet' : 'desktop',
      platform: 'generic',
      version: [],
      grade: 'A',
      mac: isMac
    };
  },
  ios: function ios(userAgent) {
    if (!/ip(hone|od|ad)/i.test(userAgent)) {
      return;
    }

    var isPhone = /ip(hone|od)/i.test(userAgent);
    var matches = userAgent.match(/os (\d+)_(\d+)_?(\d+)?/i);
    var version = matches ? [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3] || 0, 10)] : [];
    var isIPhone4 = window.screen.height === 960 / 2;
    var grade = isIPhone4 ? 'B' : 'A';
    return {
      deviceType: isPhone ? 'phone' : 'tablet',
      platform: 'ios',
      version: version,
      grade: grade
    };
  },
  android: function android(userAgent) {
    if (!/android|htc_|silk/i.test(userAgent)) {
      return;
    }

    var isPhone = /mobile/i.test(userAgent);
    var matches = userAgent.match(/android (\d+)\.?(\d+)?\.?(\d+)?/i);
    var version = matches ? [parseInt(matches[1], 10), parseInt(matches[2] || 0, 10), parseInt(matches[3] || 0, 10)] : [];
    var worseThan4_4 = version.length > 1 && (version[0] < 4 || version[0] === 4 && version[1] < 4);
    var grade = worseThan4_4 ? 'B' : 'A';
    return {
      deviceType: isPhone ? 'phone' : 'tablet',
      platform: 'android',
      version: version,
      grade: grade
    };
  }
};

var Devices = /*#__PURE__*/function () {
  /**
  * @name DevicesObject.ctor
  * @publicName ctor(options)
  * @param1 options:object
  * @param1_field1 window:Window
  * @hidden
  */
  function Devices(options) {
    this._window = (options === null || options === void 0 ? void 0 : options.window) || window;
    this._realDevice = this._getDevice();
    this._currentDevice = undefined;
    this._currentOrientation = undefined;
    this._eventsStrategy = new _events_strategy.EventsStrategy(this);
    this.changed = (0, _callbacks.default)();

    if ((0, _window.hasWindow)()) {
      _ready_callbacks.default.add(this._recalculateOrientation.bind(this));

      _resize_callbacks.default.add(this._recalculateOrientation.bind(this));
    }
  }

  var _proto = Devices.prototype;

  _proto.current = function current(deviceOrName) {
    if (deviceOrName) {
      this._currentDevice = this._getDevice(deviceOrName);
      this._forced = true;
      this.changed.fire();
      return;
    }

    if (!this._currentDevice) {
      deviceOrName = undefined;

      try {
        deviceOrName = this._getDeviceOrNameFromWindowScope();
      } catch (e) {
        deviceOrName = this._getDeviceNameFromSessionStorage();
      } finally {
        if (!deviceOrName) {
          deviceOrName = this._getDeviceNameFromSessionStorage();
        }

        if (deviceOrName) {
          this._forced = true;
        }
      }

      this._currentDevice = this._getDevice(deviceOrName);
    }

    return this._currentDevice;
  };

  _proto.real = function real(forceDevice) {
    ///#DEBUG
    if ((0, _type.isPlainObject)(forceDevice)) {
      (0, _extend.extend)(this._realDevice, forceDevice);
      return;
    } ///#ENDDEBUG


    return (0, _extend.extend)({}, this._realDevice);
  };

  _proto.orientation = function orientation() {
    return this._currentOrientation;
  };

  _proto.isForced = function isForced() {
    return this._forced;
  };

  _proto.isRippleEmulator = function isRippleEmulator() {
    return !!this._window.tinyHippos;
  };

  _proto._getCssClasses = function _getCssClasses(device) {
    var result = [];
    var realDevice = this._realDevice;
    device = device || this.current(); // TODO: use real device here?

    if (device.deviceType) {
      result.push("dx-device-".concat(device.deviceType));

      if (device.deviceType !== 'desktop') {
        result.push('dx-device-mobile');
      }
    }

    result.push("dx-device-".concat(realDevice.platform));

    if (realDevice.version && realDevice.version.length) {
      result.push("dx-device-".concat(realDevice.platform, "-").concat(realDevice.version[0]));
    }

    if (this.isSimulator()) {
      result.push('dx-simulator');
    }

    if ((0, _config.default)().rtlEnabled) {
      result.push('dx-rtl');
    }

    return result;
  };

  _proto.attachCssClasses = function attachCssClasses(element, device) {
    this._deviceClasses = this._getCssClasses(device).join(' ');
    (0, _renderer.default)(element).addClass(this._deviceClasses);
  };

  _proto.detachCssClasses = function detachCssClasses(element) {
    (0, _renderer.default)(element).removeClass(this._deviceClasses);
  };

  _proto.isSimulator = function isSimulator() {
    // NOTE: error may happen due to same-origin policy
    try {
      return this._isSimulator || (0, _window.hasWindow)() && this._window.top !== this._window.self && this._window.top['dx-force-device'] || this.isRippleEmulator();
    } catch (e) {
      return false;
    }
  };

  _proto.forceSimulator = function forceSimulator() {
    this._isSimulator = true;
  };

  _proto._getDevice = function _getDevice(deviceName) {
    if (deviceName === 'genericPhone') {
      deviceName = {
        deviceType: 'phone',
        platform: 'generic',
        generic: true
      };
    }

    if ((0, _type.isPlainObject)(deviceName)) {
      return this._fromConfig(deviceName);
    } else {
      var ua;

      if (deviceName) {
        ua = KNOWN_UA_TABLE[deviceName];

        if (!ua) {
          throw _errors.default.Error('E0005');
        }
      } else {
        ua = navigator.userAgent;
      }

      return this._fromUA(ua);
    }
  };

  _proto._getDeviceOrNameFromWindowScope = function _getDeviceOrNameFromWindowScope() {
    var result;

    if ((0, _window.hasWindow)() && (this._window.top['dx-force-device-object'] || this._window.top['dx-force-device'])) {
      result = this._window.top['dx-force-device-object'] || this._window.top['dx-force-device'];
    }

    return result;
  };

  _proto._getDeviceNameFromSessionStorage = function _getDeviceNameFromSessionStorage() {
    var sessionStorage = (0, _storage.sessionStorage)();

    if (!sessionStorage) {
      return;
    }

    var deviceOrName = sessionStorage.getItem('dx-force-device');

    try {
      return JSON.parse(deviceOrName);
    } catch (ex) {
      return deviceOrName;
    }
  };

  _proto._fromConfig = function _fromConfig(config) {
    var result = (0, _extend.extend)({}, DEFAULT_DEVICE, this._currentDevice, config);
    var shortcuts = {
      phone: result.deviceType === 'phone',
      tablet: result.deviceType === 'tablet',
      android: result.platform === 'android',
      ios: result.platform === 'ios',
      generic: result.platform === 'generic'
    };
    return (0, _extend.extend)(result, shortcuts);
  };

  _proto._fromUA = function _fromUA(ua) {
    var config;
    (0, _iterator.each)(uaParsers, function (platform, parser) {
      config = parser(ua);
      return !config;
    });

    if (config) {
      return this._fromConfig(config);
    }

    return DEFAULT_DEVICE;
  };

  _proto._changeOrientation = function _changeOrientation() {
    var $window = (0, _renderer.default)(this._window);
    var orientation = (0, _size.getHeight)($window) > (0, _size.getWidth)($window) ? 'portrait' : 'landscape';

    if (this._currentOrientation === orientation) {
      return;
    }

    this._currentOrientation = orientation;

    this._eventsStrategy.fireEvent('orientationChanged', [{
      orientation: orientation
    }]);
  };

  _proto._recalculateOrientation = function _recalculateOrientation() {
    var windowWidth = (0, _size.getWidth)(this._window);

    if (this._currentWidth === windowWidth) {
      return;
    }

    this._currentWidth = windowWidth;

    this._changeOrientation();
  };

  _proto.on = function on(eventName, eventHandler) {
    this._eventsStrategy.on(eventName, eventHandler);

    return this;
  };

  _proto.off = function off(eventName, eventHandler) {
    this._eventsStrategy.off(eventName, eventHandler);

    return this;
  };

  return Devices;
}();

var devices = new Devices();
var viewPortElement = (0, _view_port.value)();

if (viewPortElement) {
  devices.attachCssClasses(viewPortElement);
}

_view_port.changeCallback.add(function (viewPort, prevViewport) {
  devices.detachCssClasses(prevViewport);
  devices.attachCssClasses(viewPort);
}); ///#DEBUG


devices.Devices = Devices; ///#ENDDEBUG

var _default = devices;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
"use strict";

exports.Component = void 0;

var _config = _interopRequireDefault(require("./config"));

var _extend = require("./utils/extend");

var _index = require("./options/index");

var _utils = require("./options/utils");

var _class = _interopRequireDefault(require("./class"));

var _action = _interopRequireDefault(require("./action"));

var _errors = _interopRequireDefault(require("./errors"));

var _callbacks = _interopRequireDefault(require("./utils/callbacks"));

var _events_strategy = require("./events_strategy");

var _public_component = require("./utils/public_component");

var _postponed_operations = require("./postponed_operations");

var _type = require("./utils/type");

var _common = require("./utils/common");

var _data = require("./utils/data");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getEventName = function getEventName(actionName) {
  return actionName.charAt(2).toLowerCase() + actionName.substr(3);
};

var isInnerOption = function isInnerOption(optionName) {
  return optionName.indexOf('_', 0) === 0;
};

var Component = _class.default.inherit({
  _setDeprecatedOptions: function _setDeprecatedOptions() {
    this._deprecatedOptions = {};
  },
  _getDeprecatedOptions: function _getDeprecatedOptions() {
    return this._deprecatedOptions;
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return {
      onInitialized: null,
      onOptionChanged: null,
      onDisposing: null,
      defaultOptionsRules: null
    };
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return [];
  },
  _setOptionsByDevice: function _setOptionsByDevice(rules) {
    this._options.applyRules(rules);
  },
  _convertRulesToOptions: function _convertRulesToOptions(rules) {
    return (0, _utils.convertRulesToOptions)(rules);
  },
  _isInitialOptionValue: function _isInitialOptionValue(name) {
    return this._options.isInitial(name);
  },
  _setOptionsByReference: function _setOptionsByReference() {
    this._optionsByReference = {};
  },
  _getOptionsByReference: function _getOptionsByReference() {
    return this._optionsByReference;
  },

  /**
  * @name Component.ctor
  * @publicName ctor(options)
  * @param1 options:ComponentOptions|undefined
  * @hidden
  */
  ctor: function ctor() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _optionChangedCallbacks = options._optionChangedCallbacks,
        _disposingCallbacks = options._disposingCallbacks;
    this.NAME = (0, _public_component.name)(this.constructor);
    this._eventsStrategy = _events_strategy.EventsStrategy.create(this, options.eventsStrategy);
    this._updateLockCount = 0;
    this._optionChangedCallbacks = _optionChangedCallbacks || (0, _callbacks.default)();
    this._disposingCallbacks = _disposingCallbacks || (0, _callbacks.default)();
    this.postponedOperations = new _postponed_operations.PostponedOperations();

    this._createOptions(options);
  },
  _createOptions: function _createOptions(options) {
    var _this = this;

    this.beginUpdate();

    try {
      this._setOptionsByReference();

      this._setDeprecatedOptions();

      this._options = new _index.Options(this._getDefaultOptions(), this._getDefaultOptions(), this._getOptionsByReference(), this._getDeprecatedOptions());

      this._options.onChanging(function (name, previousValue, value) {
        return _this._initialized && _this._optionChanging(name, previousValue, value);
      });

      this._options.onDeprecated(function (option, info) {
        return _this._logDeprecatedOptionWarning(option, info);
      });

      this._options.onChanged(function (name, value, previousValue) {
        return _this._notifyOptionChanged(name, value, previousValue);
      });

      this._options.onStartChange(function () {
        return _this.beginUpdate();
      });

      this._options.onEndChange(function () {
        return _this.endUpdate();
      });

      this._options.addRules(this._defaultOptionsRules());

      if (options && options.onInitializing) {
        options.onInitializing.apply(this, [options]);
      }

      this._setOptionsByDevice(options.defaultOptionsRules);

      this._initOptions(options);
    } finally {
      this.endUpdate();
    }
  },
  _initOptions: function _initOptions(options) {
    this.option(options);
  },
  _init: function _init() {
    var _this2 = this;

    this._createOptionChangedAction();

    this.on('disposing', function (args) {
      _this2._disposingCallbacks.fireWith(_this2, [args]);
    });
  },
  _logDeprecatedOptionWarning: function _logDeprecatedOptionWarning(option, info) {
    var message = info.message || "Use the '".concat(info.alias, "' option instead");

    _errors.default.log('W0001', this.NAME, option, info.since, message);
  },
  _logDeprecatedComponentWarning: function _logDeprecatedComponentWarning(since, alias) {
    _errors.default.log('W0000', this.NAME, since, "Use the '".concat(alias, "' widget instead"));
  },
  _createOptionChangedAction: function _createOptionChangedAction() {
    this._optionChangedAction = this._createActionByOption('onOptionChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _createDisposingAction: function _createDisposingAction() {
    this._disposingAction = this._createActionByOption('onDisposing', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'onDisposing':
      case 'onInitialized':
        break;

      case 'onOptionChanged':
        this._createOptionChangedAction();

        break;

      case 'defaultOptionsRules':
        break;
    }
  },
  _dispose: function _dispose() {
    this._optionChangedCallbacks.empty();

    this._createDisposingAction();

    this._disposingAction();

    this._eventsStrategy.dispose();

    this._options.dispose();

    this._disposed = true;
  },
  _lockUpdate: function _lockUpdate() {
    this._updateLockCount++;
  },
  _unlockUpdate: function _unlockUpdate() {
    this._updateLockCount = Math.max(this._updateLockCount - 1, 0);
  },
  // TODO: remake as getter after ES6 refactor
  _isUpdateAllowed: function _isUpdateAllowed() {
    return this._updateLockCount === 0;
  },
  // TODO: remake as getter after ES6 refactor
  _isInitializingRequired: function _isInitializingRequired() {
    return !this._initializing && !this._initialized;
  },
  isInitialized: function isInitialized() {
    return this._initialized;
  },
  _commitUpdate: function _commitUpdate() {
    this.postponedOperations.callPostponedOperations();
    this._isInitializingRequired() && this._initializeComponent();
  },
  _initializeComponent: function _initializeComponent() {
    this._initializing = true;

    try {
      this._init();
    } finally {
      this._initializing = false;

      this._lockUpdate();

      this._createActionByOption('onInitialized', {
        excludeValidators: ['disabled', 'readOnly']
      })();

      this._unlockUpdate();

      this._initialized = true;
    }
  },
  instance: function instance() {
    return this;
  },
  beginUpdate: function beginUpdate() {
    this._lockUpdate();
  },
  endUpdate: function endUpdate() {
    this._unlockUpdate();

    this._isUpdateAllowed() && this._commitUpdate();
  },
  _optionChanging: _common.noop,
  _notifyOptionChanged: function _notifyOptionChanged(option, value, previousValue) {
    if (this._initialized) {
      var optionNames = [option].concat(this._options.getAliasesByName(option));

      for (var i = 0; i < optionNames.length; i++) {
        var name = optionNames[i];
        var args = {
          name: (0, _data.getPathParts)(name)[0],
          fullName: name,
          value: value,
          previousValue: previousValue
        };

        if (!isInnerOption(name)) {
          this._optionChangedCallbacks.fireWith(this, [(0, _extend.extend)(this._defaultActionArgs(), args)]);

          this._optionChangedAction((0, _extend.extend)({}, args));
        }

        if (!this._disposed && this._cancelOptionChange !== name) {
          this._optionChanged(args);
        }
      }
    }
  },
  initialOption: function initialOption(name) {
    return this._options.initial(name);
  },
  _defaultActionConfig: function _defaultActionConfig() {
    return {
      context: this,
      component: this
    };
  },
  _defaultActionArgs: function _defaultActionArgs() {
    return {
      component: this
    };
  },
  _createAction: function _createAction(actionSource, config) {
    var _this3 = this;

    var action;
    return function (e) {
      if (!(0, _type.isDefined)(e)) {
        e = {};
      }

      if (!(0, _type.isPlainObject)(e)) {
        e = {
          actionValue: e
        };
      }

      action = action || new _action.default(actionSource, (0, _extend.extend)(config, _this3._defaultActionConfig()));
      return action.execute.call(action, (0, _extend.extend)(e, _this3._defaultActionArgs()));
    };
  },
  _createActionByOption: function _createActionByOption(optionName, config) {
    var _this4 = this;

    var action;
    var eventName;
    var actionFunc;

    var result = function result() {
      if (!eventName) {
        config = config || {};

        if (typeof optionName !== 'string') {
          throw _errors.default.Error('E0008');
        }

        if (optionName.indexOf('on') === 0) {
          eventName = getEventName(optionName);
        }

        actionFunc = _this4.option()[optionName];
      }

      if (!action && !actionFunc && !config.beforeExecute && !config.afterExecute && !_this4._eventsStrategy.hasEvent(eventName)) {
        return;
      }

      if (!action) {
        var beforeExecute = config.beforeExecute;

        config.beforeExecute = function () {
          for (var _len2 = arguments.length, props = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            props[_key2] = arguments[_key2];
          }

          beforeExecute && beforeExecute.apply(_this4, props);

          _this4._eventsStrategy.fireEvent(eventName, props[0].args);
        };

        action = _this4._createAction(actionFunc, config);
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if ((0, _config.default)().wrapActionsBeforeExecute) {
        var beforeActionExecute = _this4.option('beforeActionExecute') || _common.noop;

        var wrappedAction = beforeActionExecute(_this4, action, config) || action;
        return wrappedAction.apply(_this4, args);
      }

      return action.apply(_this4, args);
    };

    if ((0, _config.default)().wrapActionsBeforeExecute) {
      return result;
    }

    var onActionCreated = this.option('onActionCreated') || _common.noop;

    return onActionCreated(this, result, config) || result;
  },
  on: function on(eventName, eventHandler) {
    this._eventsStrategy.on(eventName, eventHandler);

    return this;
  },
  off: function off(eventName, eventHandler) {
    this._eventsStrategy.off(eventName, eventHandler);

    return this;
  },
  hasActionSubscription: function hasActionSubscription(actionName) {
    return !!this._options.silent(actionName) || this._eventsStrategy.hasEvent(getEventName(actionName));
  },
  isOptionDeprecated: function isOptionDeprecated(name) {
    return this._options.isDeprecated(name);
  },
  _setOptionWithoutOptionChange: function _setOptionWithoutOptionChange(name, value) {
    this._cancelOptionChange = name;
    this.option(name, value);
    this._cancelOptionChange = false;
  },
  _getOptionValue: function _getOptionValue(name, context) {
    var value = this.option(name);

    if ((0, _type.isFunction)(value)) {
      return value.bind(context)();
    }

    return value;
  },
  option: function option() {
    var _this$_options;

    return (_this$_options = this._options).option.apply(_this$_options, arguments);
  },
  resetOption: function resetOption(name) {
    this.beginUpdate();

    this._options.reset(name);

    this.endUpdate();
  }
});

exports.Component = Component;
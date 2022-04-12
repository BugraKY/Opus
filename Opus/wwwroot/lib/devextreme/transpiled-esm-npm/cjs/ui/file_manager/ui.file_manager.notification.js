"use strict";

exports.default = void 0;

var _size = require("../../core/utils/size");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _type = require("../../core/utils/type");

var _deferred = require("../../core/utils/deferred");

var _window = require("../../core/utils/window");

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _popup = _interopRequireDefault(require("../popup"));

var _ui2 = _interopRequireDefault(require("../drawer/ui.drawer"));

var _uiFile_manager = require("./ui.file_manager.notification_manager");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var window = (0, _window.getWindow)();
var ADAPTIVE_STATE_SCREEN_WIDTH = 1000;
var FILE_MANAGER_NOTIFICATION_CLASS = 'dx-filemanager-notification';
var FILE_MANAGER_NOTIFICATION_DRAWER_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-drawer");
var FILE_MANAGER_NOTIFICATION_DRAWER_PANEL_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_DRAWER_CLASS, "-panel");
var FILE_MANAGER_NOTIFICATION_POPUP_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-popup");
var FILE_MANAGER_NOTIFICATION_POPUP_ERROR_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-popup-error");
var FILE_MANAGER_NOTIFICATION_COMMON_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-common");
var FILE_MANAGER_NOTIFICATION_SEPARATOR_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-separator");
var FILE_MANAGER_NOTIFICATION_DETAILS_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-details");
var FILE_MANAGER_NOTIFICATION_COMMON_NO_ITEM_CLASS = "".concat(FILE_MANAGER_NOTIFICATION_CLASS, "-common-no-item");

var FileManagerNotificationControl = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(FileManagerNotificationControl, _Widget);

  function FileManagerNotificationControl() {
    return _Widget.apply(this, arguments) || this;
  }

  var _proto = FileManagerNotificationControl.prototype;

  _proto._initMarkup = function _initMarkup() {
    var _this = this;

    _Widget.prototype._initMarkup.call(this);

    this._initActions();

    this._isInAdaptiveState = this._isSmallScreen();
    this._managerMap = {};
    this._notificationManagerStubId = null;

    this._setNotificationManager();

    var $progressPanelContainer = this.option('progressPanelContainer');
    var $progressDrawer = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_NOTIFICATION_DRAWER_CLASS).appendTo($progressPanelContainer);
    (0, _renderer.default)('<div>').addClass(FILE_MANAGER_NOTIFICATION_DRAWER_PANEL_CLASS).appendTo($progressDrawer);
    var drawerOptions = (0, _extend.extend)({
      opened: false,
      position: 'right',
      template: function template(container) {
        return _this._ensureProgressPanelCreated(container);
      }
    }, this._getProgressDrawerAdaptiveOptions());
    this._progressDrawer = this._createComponent($progressDrawer, _ui2.default, drawerOptions);
    var $drawerContent = $progressDrawer.find(".".concat(FILE_MANAGER_NOTIFICATION_DRAWER_PANEL_CLASS)).first();
    var contentRenderer = this.option('contentTemplate');

    if ((0, _type.isFunction)(contentRenderer)) {
      contentRenderer($drawerContent, this);
    }
  };

  _proto._setNotificationManager = function _setNotificationManager(options) {
    options = (0, _extend.extend)({
      onActionProgressStatusChanged: this._raiseActionProgress.bind(this)
    }, options);

    if (!this._notificationManagerStubId) {
      var stubManager = new _uiFile_manager.NotificationManagerStub(options);
      this._notificationManagerStubId = stubManager.getId();
      this._managerMap[this._notificationManagerStubId] = stubManager;
    }

    if (!this._isProgressDrawerDisabled()) {
      var notificationManagerComponent = this._getProgressManagerComponent();

      options.isActual = true;
      var defaultManager = new notificationManagerComponent(options);
      this._managerMap[defaultManager.getId()] = defaultManager;
    }
  };

  _proto._getNotificationManager = function _getNotificationManager(operationInfo) {
    var actualManagerId = (operationInfo === null || operationInfo === void 0 ? void 0 : operationInfo[_uiFile_manager.MANAGER_ID_NAME]) || this._getActualNotificationManagerId();

    return this._managerMap[actualManagerId] || this._managerMap[this._notificationManagerStubId];
  };

  _proto._clearManagerMap = function _clearManagerMap() {
    var stubManager = this._managerMap[this._notificationManagerStubId];
    delete this._managerMap;
    this._managerMap = _defineProperty({}, this._notificationManagerStubId, stubManager);
  };

  _proto._getActualNotificationManagerId = function _getActualNotificationManagerId() {
    var _this2 = this;

    return Object.keys(this._managerMap).filter(function (managerId) {
      return _this2._managerMap[managerId].isActual();
    })[0];
  };

  _proto.tryShowProgressPanel = function tryShowProgressPanel() {
    var _this3 = this;

    var promise = new _deferred.Deferred();

    var notificationManager = this._getNotificationManager();

    if (notificationManager.isActionProgressStatusDefault() || this._isProgressDrawerOpened() || this._isProgressDrawerDisabled()) {
      return promise.resolve().promise();
    }

    setTimeout(function () {
      _this3._progressDrawer.show().done(promise.resolve);

      _this3._hidePopup();

      notificationManager.tryHideActionProgress();
    });
    return promise.promise();
  };

  _proto.addOperation = function addOperation(processingMessage, allowCancel, allowProgressAutoUpdate) {
    var notificationManager = this._getNotificationManager();

    return notificationManager.addOperation(processingMessage, allowCancel, allowProgressAutoUpdate);
  };

  _proto.addOperationDetails = function addOperationDetails(operationInfo, details, showCloseButton) {
    var notificationManager = this._getNotificationManager(operationInfo);

    notificationManager.addOperationDetails(operationInfo, details, showCloseButton);
  };

  _proto.updateOperationItemProgress = function updateOperationItemProgress(operationInfo, itemIndex, itemProgress, commonProgress) {
    var notificationManager = this._getNotificationManager(operationInfo);

    notificationManager.updateOperationItemProgress(operationInfo, itemIndex, itemProgress, commonProgress);
  };

  _proto.completeOperationItem = function completeOperationItem(operationInfo, itemIndex, commonProgress) {
    var notificationManager = this._getNotificationManager(operationInfo);

    notificationManager.completeOperationItem(operationInfo, itemIndex, commonProgress);
  };

  _proto.completeOperation = function completeOperation(operationInfo, commonText, isError, statusText) {
    var notificationManager = this._getNotificationManager(operationInfo);

    if (!isError) {
      this._showPopup(commonText);
    }

    notificationManager.completeOperation(operationInfo, commonText, isError, statusText);

    if (!this._isProgressDrawerOpened() || !notificationManager.hasNoOperations()) {
      notificationManager.updateActionProgressStatus(operationInfo);
    } else {
      notificationManager.tryHideActionProgress();
    }
  };

  _proto.completeSingleOperationWithError = function completeSingleOperationWithError(operationInfo, errorInfo) {
    var notificationManager = this._getNotificationManager(operationInfo);

    notificationManager.completeSingleOperationWithError(operationInfo, errorInfo);

    this._showPopupError(errorInfo);
  };

  _proto.addOperationDetailsError = function addOperationDetailsError(operationInfo, errorInfo) {
    var notificationManager = this._getNotificationManager(operationInfo);

    notificationManager.addOperationDetailsError(operationInfo, errorInfo);

    this._showPopupError(errorInfo);
  };

  _proto._hideProgressPanel = function _hideProgressPanel() {
    var _this4 = this;

    setTimeout(function () {
      return _this4._progressDrawer.hide();
    });
  };

  _proto._isSmallScreen = function _isSmallScreen() {
    if (!(0, _window.hasWindow)()) {
      return false;
    }

    return (0, _size.getWidth)(window) <= ADAPTIVE_STATE_SCREEN_WIDTH;
  };

  _proto._dimensionChanged = function _dimensionChanged(dimension) {
    if (!(dimension && dimension === 'height')) {
      this._checkAdaptiveState();
    }
  };

  _proto._checkAdaptiveState = function _checkAdaptiveState() {
    var oldState = this._isInAdaptiveState;
    this._isInAdaptiveState = this._isSmallScreen();

    if (oldState !== this._isInAdaptiveState && this._progressDrawer) {
      var notificationManager = this._getNotificationManager();

      if (notificationManager.handleDimensionChanged()) {
        var options = this._getProgressDrawerAdaptiveOptions();

        this._progressDrawer.option(options);
      }
    }
  };

  _proto._getProgressDrawerAdaptiveOptions = function _getProgressDrawerAdaptiveOptions() {
    if (this._isInAdaptiveState) {
      return {
        openedStateMode: 'overlap',
        shading: true,
        closeOnOutsideClick: true
      };
    } else {
      return {
        openedStateMode: 'shrink',
        shading: false,
        closeOnOutsideClick: false
      };
    }
  };

  _proto._ensureProgressPanelCreated = function _ensureProgressPanelCreated(container) {
    var _this5 = this;

    var notificationManager = this._getNotificationManager();

    notificationManager.ensureProgressPanelCreated(container, {
      onOperationCanceled: function onOperationCanceled(_ref) {
        var info = _ref.info;
        return _this5._raiseOperationCanceled(info);
      },
      onOperationItemCanceled: function onOperationItemCanceled(_ref2) {
        var item = _ref2.item,
            itemIndex = _ref2.itemIndex;
        return _this5._raiseOperationItemCanceled(item, itemIndex);
      },
      onPanelClosed: function onPanelClosed() {
        return _this5._hideProgressPanel();
      }
    });
  } // needed for editingProgress.tests.js
  ;

  _proto._getProgressManagerComponent = function _getProgressManagerComponent() {
    return _uiFile_manager.NotificationManager;
  };

  _proto._isProgressDrawerDisabled = function _isProgressDrawerDisabled() {
    return !this.option('showProgressPanel');
  };

  _proto._isProgressDrawerOpened = function _isProgressDrawerOpened() {
    return this._progressDrawer.option('opened');
  };

  _proto._hidePopup = function _hidePopup(forceHide) {
    if (!this.option('showNotificationPopup') && !forceHide) {
      return;
    }

    this._getNotificationPopup().hide();
  };

  _proto._showPopup = function _showPopup(content, errorMode) {
    if (this._isProgressDrawerOpened() || !this.option('showNotificationPopup')) {
      return;
    }

    this._getNotificationPopup().$wrapper().toggleClass(FILE_MANAGER_NOTIFICATION_POPUP_ERROR_CLASS, !!errorMode);

    this._getNotificationPopup().option('contentTemplate', content);

    if (!this._getNotificationPopup().option('visible')) {
      this._getNotificationPopup().show();
    }
  };

  _proto._showPopupError = function _showPopupError(errorInfo) {
    if (!this.option('showNotificationPopup')) {
      return;
    }

    var notificationManager = this._getNotificationManager();

    var $content = (0, _renderer.default)('<div>');
    var $message = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_NOTIFICATION_COMMON_CLASS).text(errorInfo.commonErrorText);
    var $separator = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_NOTIFICATION_SEPARATOR_CLASS);
    (0, _renderer.default)('<div>').appendTo($separator);
    var $details = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_NOTIFICATION_DETAILS_CLASS);

    if (errorInfo.item) {
      notificationManager.createErrorDetailsProgressBox($details, errorInfo.item, errorInfo.detailErrorText);
    } else {
      $message.addClass(FILE_MANAGER_NOTIFICATION_COMMON_NO_ITEM_CLASS);
      notificationManager.renderError($details, errorInfo.detailErrorText);
    }

    $content.append($message, $separator, $details);

    this._showPopup($content, true);
  };

  _proto._getNotificationPopup = function _getNotificationPopup() {
    if (!this._notificationPopup) {
      var $popup = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_NOTIFICATION_POPUP_CLASS).appendTo(this.$element());
      this._notificationPopup = this._createComponent($popup, _popup.default, {
        container: this.$element(),
        width: 'auto',
        height: 'auto',
        showTitle: false,
        dragEnabled: false,
        shading: false,
        visible: false,
        closeOnOutsideClick: true,
        animation: {
          duration: 0
        },
        position: {
          my: 'right top',
          at: 'right top',
          of: this.option('positionTarget'),
          offset: '-10 -5'
        }
      });
    }

    return this._notificationPopup;
  };

  _proto._raiseActionProgress = function _raiseActionProgress(message, status) {
    this._actions.onActionProgress({
      message: message,
      status: status
    });
  };

  _proto._raiseOperationCanceled = function _raiseOperationCanceled(info) {
    this._actions.onOperationCanceled({
      info: info
    });
  };

  _proto._raiseOperationItemCanceled = function _raiseOperationItemCanceled(item, index) {
    this._actions.onOperationItemCanceled({
      item: item,
      itemIndex: index
    });
  };

  _proto._initActions = function _initActions() {
    this._actions = {
      onActionProgress: this._createActionByOption('onActionProgress'),
      onOperationCanceled: this._createActionByOption('onOperationCanceled'),
      onOperationItemCanceled: this._createActionByOption('onOperationItemCanceled')
    };
  };

  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      progressPanelContainer: null,
      contentTemplate: null,
      onActionProgress: null,
      onOperationCanceled: null,
      onOperationItemCanceled: null,
      showProgressPanel: true,
      showNotificationPopup: true
    });
  };

  _proto._optionChanged = function _optionChanged(args) {
    var name = args.name;

    switch (name) {
      case 'progressPanelContainer':
      case 'contentTemplate':
        break;

      case 'showProgressPanel':
        this._setNotificationManager();

        this._getNotificationManager().updateActionProgressStatus();

        if (!args.value) {
          this._hideProgressPanel();

          this._clearManagerMap();
        }

        this._progressDrawer.repaint();

        break;

      case 'showNotificationPopup':
        if (!args.value) {
          this._hidePopup(true);
        }

        break;

      case 'onActionProgress':
      case 'onOperationCanceled':
      case 'onOperationItemCanceled':
        this._actions[name] = this._createActionByOption(name);
        break;

      default:
        _Widget.prototype._optionChanged.call(this, args);

    }
  };

  return FileManagerNotificationControl;
}(_ui.default);

exports.default = FileManagerNotificationControl;
module.exports = exports.default;
module.exports.default = exports.default;
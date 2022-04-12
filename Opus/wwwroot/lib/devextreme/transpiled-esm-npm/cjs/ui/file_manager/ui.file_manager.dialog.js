"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _type = require("../../core/utils/type");

var _message = _interopRequireDefault(require("../../localization/message"));

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _popup = _interopRequireDefault(require("../popup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FILE_MANAGER_DIALOG_CONTENT = 'dx-filemanager-dialog';
var FILE_MANAGER_DIALOG_POPUP = 'dx-filemanager-dialog-popup';

var FileManagerDialogBase = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(FileManagerDialogBase, _Widget);

  function FileManagerDialogBase() {
    return _Widget.apply(this, arguments) || this;
  }

  var _proto = FileManagerDialogBase.prototype;

  _proto._initMarkup = function _initMarkup() {
    var _this = this;

    _Widget.prototype._initMarkup.call(this);

    this._createOnClosedAction();

    var options = this._getDialogOptions();

    var $popup = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_DIALOG_POPUP).appendTo(this.$element());

    if (options.popupCssClass) {
      $popup.addClass(options.popupCssClass);
    }

    var popupOptions = {
      showTitle: true,
      title: options.title,
      visible: false,
      closeOnOutsideClick: true,
      copyRootClassesToWrapper: true,
      _ignoreCopyRootClassesToWrapperDeprecation: true,
      contentTemplate: this._createContentTemplate.bind(this),
      toolbarItems: [{
        widget: 'dxButton',
        toolbar: 'bottom',
        location: 'after',
        options: {
          text: options.buttonText,
          onClick: this._applyDialogChanges.bind(this)
        }
      }, {
        widget: 'dxButton',
        toolbar: 'bottom',
        location: 'after',
        options: {
          text: _message.default.format('dxFileManager-dialogButtonCancel'),
          onClick: this._closeDialog.bind(this)
        }
      }],
      onInitialized: function onInitialized(_ref) {
        var component = _ref.component;
        component.registerKeyHandler('enter', _this._applyDialogChanges.bind(_this));
      },
      onHidden: this._onPopupHidden.bind(this),
      onShown: this._onPopupShown.bind(this)
    };

    if ((0, _type.isDefined)(options.height)) {
      popupOptions.height = options.height;
    }

    if ((0, _type.isDefined)(options.maxHeight)) {
      popupOptions.maxHeight = options.maxHeight;
    }

    this._popup = this._createComponent($popup, _popup.default, popupOptions);
  };

  _proto.show = function show() {
    this._dialogResult = null;

    this._popup.show();
  };

  _proto._getDialogOptions = function _getDialogOptions() {
    return {
      title: 'Title',
      buttonText: 'ButtonText',
      contentCssClass: '',
      popupCssClass: ''
    };
  };

  _proto._createContentTemplate = function _createContentTemplate(element) {
    this._$contentElement = (0, _renderer.default)('<div>').appendTo(element).addClass(FILE_MANAGER_DIALOG_CONTENT);

    var cssClass = this._getDialogOptions().contentCssClass;

    if (cssClass) {
      this._$contentElement.addClass(cssClass);
    }
  };

  _proto._getDialogResult = function _getDialogResult() {
    return null;
  };

  _proto._applyDialogChanges = function _applyDialogChanges() {
    var result = this._getDialogResult();

    if (result) {
      this._dialogResult = result;

      this._closeDialog();
    }
  };

  _proto._closeDialog = function _closeDialog() {
    this._popup.hide();
  };

  _proto._onPopupHidden = function _onPopupHidden() {
    this._onClosedAction({
      dialogResult: this._dialogResult
    });
  };

  _proto._onPopupShown = function _onPopupShown() {};

  _proto._createOnClosedAction = function _createOnClosedAction() {
    this._onClosedAction = this._createActionByOption('onClosed');
  };

  _proto._setTitle = function _setTitle(newTitle) {
    this._popup.option('title', newTitle);
  };

  _proto._setButtonText = function _setButtonText(newText) {
    this._popup.option('toolbarItems[0].options.text', newText);
  };

  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      onClosed: null
    });
  };

  _proto._optionChanged = function _optionChanged(args) {
    var name = args.name;

    switch (name) {
      case 'onClosed':
        this._createOnPathChangedAction();

        break;

      default:
        _Widget.prototype._optionChanged.call(this, args);

    }
  };

  return FileManagerDialogBase;
}(_ui.default);

var _default = FileManagerDialogBase;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
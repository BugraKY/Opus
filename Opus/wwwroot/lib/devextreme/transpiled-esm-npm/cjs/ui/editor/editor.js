"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _element_data = require("../../core/element_data");

var _callbacks = _interopRequireDefault(require("../../core/utils/callbacks"));

var _window = require("../../core/utils/window");

var _index = require("../../events/utils/index");

var _extend = require("../../core/utils/extend");

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _validation_engine = _interopRequireDefault(require("../validation_engine"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _validation_message = _interopRequireDefault(require("../validation_message"));

var _guid = _interopRequireDefault(require("../../core/guid"));

var _common = require("../../core/utils/common");

var _dom = require("../../core/utils/dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
var READONLY_STATE_CLASS = 'dx-state-readonly';
var INVALID_CLASS = 'dx-invalid';
var DX_INVALID_BADGE_CLASS = 'dx-show-invalid-badge';
var VALIDATION_TARGET = 'dx-validation-target';
var VALIDATION_STATUS_VALID = 'valid';
var VALIDATION_STATUS_INVALID = 'invalid';
var READONLY_NAMESPACE = 'editorReadOnly';
var ALLOWED_STYLING_MODES = ['outlined', 'filled', 'underlined'];
var VALIDATION_MESSAGE_KEYS_MAP = {
  validationMessageMode: 'mode',
  validationMessageOffset: 'offset',
  validationBoundary: 'boundary'
};

var Editor = _ui.default.inherit({
  ctor: function ctor() {
    this.showValidationMessageTimeout = null;
    this.validationRequest = (0, _callbacks.default)();
    this.callBase.apply(this, arguments);
  },
  _createElement: function _createElement(element) {
    this.callBase(element);
    var $element = this.$element();

    if ($element) {
      (0, _element_data.data)($element[0], VALIDATION_TARGET, this);
    }
  },
  _initOptions: function _initOptions(options) {
    this.callBase.apply(this, arguments);
    this.option(_validation_engine.default.initValidationOptions(options));
  },
  _init: function _init() {
    this.callBase();

    this._options.cache('validationTooltipOptions', this.option('validationTooltipOptions'));

    var $element = this.$element();
    $element.addClass(DX_INVALID_BADGE_CLASS);
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      value: null,

      /**
      * @name EditorOptions.name
      * @type string
      * @default ""
      * @hidden
      */
      name: '',
      onValueChanged: null,
      readOnly: false,
      isValid: true,
      validationError: null,
      validationErrors: null,
      validationStatus: VALIDATION_STATUS_VALID,
      validationMessageMode: 'auto',
      validationBoundary: undefined,
      validationMessageOffset: {
        h: 0,
        v: 0
      },
      validationTooltipOptions: {}
    });
  },
  _attachKeyboardEvents: function _attachKeyboardEvents() {
    if (!this.option('readOnly')) {
      this.callBase();
    }
  },
  _setOptionsByReference: function _setOptionsByReference() {
    this.callBase();
    (0, _extend.extend)(this._optionsByReference, {
      validationError: true
    });
  },
  _createValueChangeAction: function _createValueChangeAction() {
    this._valueChangeAction = this._createActionByOption('onValueChanged', {
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _suppressValueChangeAction: function _suppressValueChangeAction() {
    this._valueChangeActionSuppressed = true;
  },
  _resumeValueChangeAction: function _resumeValueChangeAction() {
    this._valueChangeActionSuppressed = false;
  },
  _initMarkup: function _initMarkup() {
    var _this$option;

    this._toggleReadOnlyState();

    this._setSubmitElementName(this.option('name'));

    this.callBase();

    this._renderValidationState();

    (_this$option = this.option('_onMarkupRendered')) === null || _this$option === void 0 ? void 0 : _this$option();
  },
  _raiseValueChangeAction: function _raiseValueChangeAction(value, previousValue) {
    if (!this._valueChangeAction) {
      this._createValueChangeAction();
    }

    this._valueChangeAction(this._valueChangeArgs(value, previousValue));
  },
  _valueChangeArgs: function _valueChangeArgs(value, previousValue) {
    return {
      value: value,
      previousValue: previousValue,
      event: this._valueChangeEventInstance
    };
  },
  _saveValueChangeEvent: function _saveValueChangeEvent(e) {
    this._valueChangeEventInstance = e;
  },
  _focusInHandler: function _focusInHandler(e) {
    var isValidationMessageShownOnFocus = this.option('validationMessageMode') === 'auto'; // NOTE: The click should be processed before the validation message is shown because
    // it can change the editor's value

    if (this._canValueBeChangedByClick() && isValidationMessageShownOnFocus) {
      var _this$_validationMess;

      // NOTE: Prevent the validation message from showing
      var $validationMessageWrapper = (_this$_validationMess = this._validationMessage) === null || _this$_validationMess === void 0 ? void 0 : _this$_validationMess.$wrapper();
      $validationMessageWrapper === null || $validationMessageWrapper === void 0 ? void 0 : $validationMessageWrapper.removeClass(INVALID_MESSAGE_AUTO);
      clearTimeout(this.showValidationMessageTimeout); // NOTE: Show the validation message after a click changes the value

      this.showValidationMessageTimeout = setTimeout(function () {
        return $validationMessageWrapper === null || $validationMessageWrapper === void 0 ? void 0 : $validationMessageWrapper.addClass(INVALID_MESSAGE_AUTO);
      }, 150);
    }

    return this.callBase(e);
  },
  _canValueBeChangedByClick: function _canValueBeChangedByClick() {
    return false;
  },
  _getStylingModePrefix: function _getStylingModePrefix() {
    return 'dx-editor-';
  },
  _renderStylingMode: function _renderStylingMode() {
    var _this = this;

    var optionName = 'stylingMode';
    var optionValue = this.option(optionName);

    var prefix = this._getStylingModePrefix();

    var allowedStylingClasses = ALLOWED_STYLING_MODES.map(function (mode) {
      return prefix + mode;
    });
    allowedStylingClasses.forEach(function (className) {
      return _this.$element().removeClass(className);
    });
    var stylingModeClass = prefix + optionValue;

    if (allowedStylingClasses.indexOf(stylingModeClass) === -1) {
      var defaultOptionValue = this._getDefaultOptions()[optionName];

      var platformOptionValue = this._convertRulesToOptions(this._defaultOptionsRules())[optionName];

      stylingModeClass = prefix + (platformOptionValue || defaultOptionValue);
    }

    this.$element().addClass(stylingModeClass);
  },
  _getValidationErrors: function _getValidationErrors() {
    var validationErrors = this.option('validationErrors');

    if (!validationErrors && this.option('validationError')) {
      validationErrors = [this.option('validationError')];
    }

    return validationErrors;
  },
  _disposeValidationMessage: function _disposeValidationMessage() {
    if (this._$validationMessage) {
      this._$validationMessage.remove();

      this.setAria('describedby', null);
      this._$validationMessage = undefined;
      this._validationMessage = undefined;
    }
  },
  _toggleValidationClasses: function _toggleValidationClasses(isInvalid) {
    this.$element().toggleClass(INVALID_CLASS, isInvalid);
    this.setAria(VALIDATION_STATUS_INVALID, isInvalid || undefined);
  },
  _renderValidationState: function _renderValidationState() {
    var isValid = this.option('isValid') && this.option('validationStatus') !== VALIDATION_STATUS_INVALID;

    var validationErrors = this._getValidationErrors();

    var $element = this.$element();

    this._toggleValidationClasses(!isValid);

    if (!(0, _window.hasWindow)()) {
      return;
    }

    this._disposeValidationMessage();

    if (!isValid && validationErrors) {
      var _this$option2 = this.option(),
          validationMessageMode = _this$option2.validationMessageMode,
          validationMessageOffset = _this$option2.validationMessageOffset,
          validationBoundary = _this$option2.validationBoundary,
          rtlEnabled = _this$option2.rtlEnabled;

      this._$validationMessage = (0, _renderer.default)('<div>').appendTo($element);
      var validationMessageContentId = "dx-".concat(new _guid.default());
      this.setAria('describedby', validationMessageContentId);
      this._validationMessage = new _validation_message.default(this._$validationMessage, (0, _extend.extend)({
        validationErrors: validationErrors,
        rtlEnabled: rtlEnabled,
        target: this._getValidationMessageTarget(),
        container: $element,
        mode: validationMessageMode,
        positionRequest: 'below',
        offset: validationMessageOffset,
        boundary: validationBoundary,
        contentId: validationMessageContentId
      }, this._options.cache('validationTooltipOptions')));

      this._bindInnerWidgetOptions(this._validationMessage, 'validationTooltipOptions');
    }
  },
  _getValidationMessageTarget: function _getValidationMessageTarget() {
    return this.$element();
  },
  _toggleReadOnlyState: function _toggleReadOnlyState() {
    var readOnly = this.option('readOnly');

    this._toggleBackspaceHandler(readOnly);

    this.$element().toggleClass(READONLY_STATE_CLASS, !!readOnly);
    this.setAria('readonly', readOnly || undefined);
  },
  _toggleBackspaceHandler: function _toggleBackspaceHandler(isReadOnly) {
    var $eventTarget = this._keyboardEventBindingTarget();

    var eventName = (0, _index.addNamespace)('keydown', READONLY_NAMESPACE);

    _events_engine.default.off($eventTarget, eventName);

    if (isReadOnly) {
      _events_engine.default.on($eventTarget, eventName, function (e) {
        if ((0, _index.normalizeKeyName)(e) === 'backspace') {
          e.preventDefault();
        }
      });
    }
  },
  _dispose: function _dispose() {
    var element = this.$element()[0];
    (0, _element_data.data)(element, VALIDATION_TARGET, null);
    clearTimeout(this.showValidationMessageTimeout);

    this._disposeValidationMessage();

    this.callBase();
  },
  _setSubmitElementName: function _setSubmitElementName(name) {
    var $submitElement = this._getSubmitElement();

    if (!$submitElement) {
      return;
    }

    if (name.length > 0) {
      $submitElement.attr('name', name);
    } else {
      $submitElement.removeAttr('name');
    }
  },
  _getSubmitElement: function _getSubmitElement() {
    return null;
  },
  _setValidationMessageOption: function _setValidationMessageOption(_ref) {
    var _this$_validationMess2;

    var name = _ref.name,
        value = _ref.value;
    var optionKey = VALIDATION_MESSAGE_KEYS_MAP[name] ? VALIDATION_MESSAGE_KEYS_MAP[name] : name;
    (_this$_validationMess2 = this._validationMessage) === null || _this$_validationMess2 === void 0 ? void 0 : _this$_validationMess2.option(optionKey, value);
  },
  _hasActiveElement: _common.noop,
  _optionChanged: function _optionChanged(args) {
    var _this$_validationMess3;

    switch (args.name) {
      case 'onValueChanged':
        this._createValueChangeAction();

        break;

      case 'readOnly':
        this._toggleReadOnlyState();

        this._refreshFocusState();

        break;

      case 'value':
        if (args.value != args.previousValue) {
          // eslint-disable-line eqeqeq
          this.validationRequest.fire({
            value: args.value,
            editor: this
          });
        }

        if (!this._valueChangeActionSuppressed) {
          this._raiseValueChangeAction(args.value, args.previousValue);

          this._saveValueChangeEvent(undefined);
        }

        break;

      case 'width':
        this.callBase(args);
        (_this$_validationMess3 = this._validationMessage) === null || _this$_validationMess3 === void 0 ? void 0 : _this$_validationMess3.updateMaxWidth();
        break;

      case 'name':
        this._setSubmitElementName(args.value);

        break;

      case 'isValid':
      case 'validationError':
      case 'validationErrors':
      case 'validationStatus':
        this.option(_validation_engine.default.synchronizeValidationOptions(args, this.option()));

        this._renderValidationState();

        break;

      case 'validationBoundary':
      case 'validationMessageMode':
      case 'validationMessageOffset':
        this._setValidationMessageOption(args);

        break;

      case 'rtlEnabled':
        this._setValidationMessageOption(args);

        this.callBase(args);
        break;

      case 'validationTooltipOptions':
        this._innerWidgetOptionChanged(this._validationMessage, args);

        break;

      default:
        this.callBase(args);
    }
  },
  blur: function blur() {
    if (this._hasActiveElement()) {
      (0, _dom.resetActiveElement)();
    }
  },
  reset: function reset() {
    var defaultOptions = this._getDefaultOptions();

    this.option('value', defaultOptions.value);
  }
});

Editor.isEditor = function (instance) {
  return instance instanceof Editor;
};

var _default = Editor;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
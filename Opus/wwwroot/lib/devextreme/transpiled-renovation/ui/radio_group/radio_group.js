"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _devices = _interopRequireDefault(require("../../core/devices"));

var _common = require("../../core/utils/common");

var _type = require("../../core/utils/type");

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _uiCollection_widget = _interopRequireDefault(require("../collection/ui.collection_widget.edit"));

var _ui = _interopRequireDefault(require("../editor/ui.data_expression"));

var _editor = _interopRequireDefault(require("../editor/editor"));

var _deferred = require("../../core/utils/deferred");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// STYLE radioGroup
var RADIO_BUTTON_CHECKED_CLASS = 'dx-radiobutton-checked';
var RADIO_BUTTON_CLASS = 'dx-radiobutton';
var RADIO_BUTTON_ICON_CHECKED_CLASS = 'dx-radiobutton-icon-checked';
var RADIO_BUTTON_ICON_CLASS = 'dx-radiobutton-icon';
var RADIO_BUTTON_ICON_DOT_CLASS = 'dx-radiobutton-icon-dot';
var RADIO_GROUP_HORIZONTAL_CLASS = 'dx-radiogroup-horizontal';
var RADIO_GROUP_VERTICAL_CLASS = 'dx-radiogroup-vertical';
var RADIO_VALUE_CONTAINER_CLASS = 'dx-radio-value-container';
var RADIO_GROUP_CLASS = 'dx-radiogroup';
var RADIO_FEEDBACK_HIDE_TIMEOUT = 100;

var RadioCollection = /*#__PURE__*/function (_CollectionWidget) {
  _inheritsLoose(RadioCollection, _CollectionWidget);

  function RadioCollection() {
    return _CollectionWidget.apply(this, arguments) || this;
  }

  var _proto = RadioCollection.prototype;

  _proto._focusTarget = function _focusTarget() {
    return this.$element().parent();
  };

  _proto._nullValueSelectionSupported = function _nullValueSelectionSupported() {
    return true;
  };

  _proto._getDefaultOptions = function _getDefaultOptions() {
    var defaultOptions = _CollectionWidget.prototype._getDefaultOptions.call(this);

    return (0, _extend.extend)(defaultOptions, _ui.default._dataExpressionDefaultOptions(), {
      _itemAttributes: {
        role: 'radio'
      }
    });
  };

  _proto._initMarkup = function _initMarkup() {
    var _this = this;

    _CollectionWidget.prototype._initMarkup.call(this);

    (0, _common.deferRender)(function () {
      _this.itemElements().addClass(RADIO_BUTTON_CLASS);
    });
  };

  _proto._keyboardEventBindingTarget = function _keyboardEventBindingTarget() {
    return this._focusTarget();
  };

  _proto._postprocessRenderItem = function _postprocessRenderItem(args) {
    var html = args.itemData.html,
        itemElement = args.itemElement;

    if (!html) {
      var $radio = (0, _renderer.default)('<div>').addClass(RADIO_BUTTON_ICON_CLASS);
      (0, _renderer.default)('<div>').addClass(RADIO_BUTTON_ICON_DOT_CLASS).appendTo($radio);
      var $radioContainer = (0, _renderer.default)('<div>').append($radio).addClass(RADIO_VALUE_CONTAINER_CLASS);
      (0, _renderer.default)(itemElement).prepend($radioContainer);
    }

    _CollectionWidget.prototype._postprocessRenderItem.call(this, args);
  };

  _proto._processSelectableItem = function _processSelectableItem($itemElement, isSelected) {
    _CollectionWidget.prototype._processSelectableItem.call(this, $itemElement, isSelected);

    $itemElement.toggleClass(RADIO_BUTTON_CHECKED_CLASS, isSelected).find(".".concat(RADIO_BUTTON_ICON_CLASS)).first().toggleClass(RADIO_BUTTON_ICON_CHECKED_CLASS, isSelected);
    this.setAria('checked', isSelected, $itemElement);
  };

  _proto._refreshContent = function _refreshContent() {
    this._prepareContent();

    this._renderContent();
  };

  _proto._supportedKeys = function _supportedKeys() {
    var parent = _CollectionWidget.prototype._supportedKeys.call(this);

    return (0, _extend.extend)({}, parent, {
      enter: function enter(e) {
        e.preventDefault();
        return parent.enter.apply(this, arguments);
      },
      space: function space(e) {
        e.preventDefault();
        return parent.space.apply(this, arguments);
      }
    });
  };

  _proto._itemElements = function _itemElements() {
    return this._itemContainer().children(this._itemSelector());
  };

  return RadioCollection;
}(_uiCollection_widget.default);

var RadioGroup = /*#__PURE__*/function (_Editor) {
  _inheritsLoose(RadioGroup, _Editor);

  function RadioGroup() {
    return _Editor.apply(this, arguments) || this;
  }

  var _proto2 = RadioGroup.prototype;

  _proto2._dataSourceOptions = function _dataSourceOptions() {
    return {
      paginate: false
    };
  };

  _proto2._defaultOptionsRules = function _defaultOptionsRules() {
    var defaultOptionsRules = _Editor.prototype._defaultOptionsRules.call(this);

    return defaultOptionsRules.concat([{
      device: {
        tablet: true
      },
      options: {
        layout: 'horizontal'
      }
    }, {
      device: function device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }]);
  };

  _proto2._fireContentReadyAction = function _fireContentReadyAction(force) {
    force && _Editor.prototype._fireContentReadyAction.call(this);
  };

  _proto2._focusTarget = function _focusTarget() {
    return this.$element();
  };

  _proto2._getAriaTarget = function _getAriaTarget() {
    return this.$element();
  };

  _proto2._getDefaultOptions = function _getDefaultOptions() {
    var defaultOptions = _Editor.prototype._getDefaultOptions.call(this);

    return (0, _extend.extend)(defaultOptions, (0, _extend.extend)(_ui.default._dataExpressionDefaultOptions(), {
      hoverStateEnabled: true,
      activeStateEnabled: true,
      layout: 'vertical'
    }));
  };

  _proto2._getItemValue = function _getItemValue(item) {
    return this._valueGetter ? this._valueGetter(item) : item.text;
  };

  _proto2._getSubmitElement = function _getSubmitElement() {
    return this._$submitElement;
  };

  _proto2._init = function _init() {
    _Editor.prototype._init.call(this);

    this._activeStateUnit = ".".concat(RADIO_BUTTON_CLASS);
    this._feedbackHideTimeout = RADIO_FEEDBACK_HIDE_TIMEOUT;

    this._initDataExpressions();
  };

  _proto2._initMarkup = function _initMarkup() {
    this.$element().addClass(RADIO_GROUP_CLASS);

    this._renderSubmitElement();

    this.setAria('role', 'radiogroup');

    this._renderRadios();

    this._renderLayout();

    _Editor.prototype._initMarkup.call(this);
  };

  _proto2._itemClickHandler = function _itemClickHandler(_ref) {
    var itemElement = _ref.itemElement,
        event = _ref.event,
        itemData = _ref.itemData;

    if (this.itemElements().is(itemElement)) {
      var newValue = this._getItemValue(itemData);

      if (newValue !== this.option('value')) {
        this._saveValueChangeEvent(event);

        this.option('value', newValue);
      }
    }
  };

  _proto2._getSelectedItemKeys = function _getSelectedItemKeys() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.option('value');
    var isNullSelectable = this.option('valueExpr') !== 'this';
    var shouldSelectValue = isNullSelectable && value === null || (0, _type.isDefined)(value);
    return shouldSelectValue ? [value] : [];
  };

  _proto2._setSelection = function _setSelection(currentValue) {
    var value = this._unwrappedValue(currentValue);

    this._setCollectionWidgetOption('selectedItemKeys', this._getSelectedItemKeys(value));
  };

  _proto2._optionChanged = function _optionChanged(args) {
    var name = args.name,
        value = args.value;

    this._dataExpressionOptionChanged(args);

    switch (name) {
      case 'dataSource':
        this._invalidate();

        break;

      case 'focusStateEnabled':
      case 'accessKey':
      case 'tabIndex':
        this._setCollectionWidgetOption(name, value);

        break;

      case 'disabled':
        _Editor.prototype._optionChanged.call(this, args);

        this._setCollectionWidgetOption(name, value);

        break;

      case 'valueExpr':
        this._setCollectionWidgetOption('keyExpr', this._getCollectionKeyExpr());

        break;

      case 'value':
        this._setSelection(value);

        this._setSubmitValue(value);

        _Editor.prototype._optionChanged.call(this, args);

        break;

      case 'items':
        this._setSelection(this.option('value'));

        break;

      case 'itemTemplate':
      case 'displayExpr':
        break;

      case 'layout':
        this._renderLayout();

        this._updateItemsSize();

        break;

      default:
        _Editor.prototype._optionChanged.call(this, args);

    }
  };

  _proto2._render = function _render() {
    _Editor.prototype._render.call(this);

    this._updateItemsSize();
  };

  _proto2._renderLayout = function _renderLayout() {
    var layout = this.option('layout');
    var $element = this.$element();
    $element.toggleClass(RADIO_GROUP_VERTICAL_CLASS, layout === 'vertical');
    $element.toggleClass(RADIO_GROUP_HORIZONTAL_CLASS, layout === 'horizontal');
  };

  _proto2._renderRadios = function _renderRadios() {
    var _this2 = this;

    this._areRadiosCreated = new _deferred.Deferred();
    var $radios = (0, _renderer.default)('<div>').appendTo(this.$element());

    var _this$option = this.option(),
        displayExpr = _this$option.displayExpr,
        accessKey = _this$option.accessKey,
        focusStateEnabled = _this$option.focusStateEnabled,
        itemTemplate = _this$option.itemTemplate,
        tabIndex = _this$option.tabIndex;

    this._createComponent($radios, RadioCollection, {
      onInitialized: function onInitialized(_ref2) {
        var component = _ref2.component;
        _this2._radios = component;
      },
      onContentReady: function onContentReady(e) {
        _this2._fireContentReadyAction(true);
      },
      onItemClick: this._itemClickHandler.bind(this),
      displayExpr: displayExpr,
      accessKey: accessKey,
      dataSource: this._dataSource,
      focusStateEnabled: focusStateEnabled,
      itemTemplate: itemTemplate,
      keyExpr: this._getCollectionKeyExpr(),
      noDataText: '',
      scrollingEnabled: false,
      selectionByClick: false,
      selectionMode: 'single',
      selectedItemKeys: this._getSelectedItemKeys(),
      tabIndex: tabIndex
    });

    this._areRadiosCreated.resolve();
  };

  _proto2._renderSubmitElement = function _renderSubmitElement() {
    this._$submitElement = (0, _renderer.default)('<input>').attr('type', 'hidden').appendTo(this.$element());

    this._setSubmitValue();
  };

  _proto2._setOptionsByReference = function _setOptionsByReference() {
    _Editor.prototype._setOptionsByReference.call(this);

    (0, _extend.extend)(this._optionsByReference, {
      value: true
    });
  };

  _proto2._setSubmitValue = function _setSubmitValue(value) {
    var _value;

    value = (_value = value) !== null && _value !== void 0 ? _value : this.option('value');
    var submitValue = this.option('valueExpr') === 'this' ? this._displayGetter(value) : value;

    this._$submitElement.val(submitValue);
  };

  _proto2._setCollectionWidgetOption = function _setCollectionWidgetOption() {
    this._areRadiosCreated.done(this._setWidgetOption.bind(this, '_radios', arguments));
  };

  _proto2._updateItemsSize = function _updateItemsSize() {
    if (this.option('layout') === 'horizontal') {
      this.itemElements().css('height', 'auto');
    } else {
      var itemsCount = this.option('items').length;
      this.itemElements().css('height', 100 / itemsCount + '%');
    }
  };

  _proto2.focus = function focus() {
    var _this$_radios;

    (_this$_radios = this._radios) === null || _this$_radios === void 0 ? void 0 : _this$_radios.focus();
  };

  _proto2.itemElements = function itemElements() {
    var _this$_radios2;

    return (_this$_radios2 = this._radios) === null || _this$_radios2 === void 0 ? void 0 : _this$_radios2.itemElements();
  };

  return RadioGroup;
}(_editor.default);

RadioGroup.include(_ui.default);
(0, _component_registrator.default)('dxRadioGroup', RadioGroup);
var _default = RadioGroup;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
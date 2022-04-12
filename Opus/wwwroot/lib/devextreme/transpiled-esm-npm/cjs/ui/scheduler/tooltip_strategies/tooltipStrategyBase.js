"use strict";

exports.TooltipStrategyBase = void 0;

var _button = _interopRequireDefault(require("../../button"));

var _function_template = require("../../../core/templates/function_template");

var _renderer = _interopRequireDefault(require("../../../core/renderer"));

var _uiList = _interopRequireDefault(require("../../list/ui.list.edit"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TOOLTIP_APPOINTMENT_ITEM = 'dx-tooltip-appointment-item';
var TOOLTIP_APPOINTMENT_ITEM_CONTENT = TOOLTIP_APPOINTMENT_ITEM + '-content';
var TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT = TOOLTIP_APPOINTMENT_ITEM + '-content-subject';
var TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE = TOOLTIP_APPOINTMENT_ITEM + '-content-date';
var TOOLTIP_APPOINTMENT_ITEM_MARKER = TOOLTIP_APPOINTMENT_ITEM + '-marker';
var TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY = TOOLTIP_APPOINTMENT_ITEM + '-marker-body';
var TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER = TOOLTIP_APPOINTMENT_ITEM + '-delete-button-container';
var TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON = TOOLTIP_APPOINTMENT_ITEM + '-delete-button';

var TooltipStrategyBase = /*#__PURE__*/function () {
  function TooltipStrategyBase(options) {
    this._tooltip = null;
    this._options = options;
    this._extraOptions = null;
  }

  var _proto = TooltipStrategyBase.prototype;

  _proto.show = function show(target, dataList, extraOptions) {
    if (this._canShowTooltip(dataList)) {
      this.hide();
      this._extraOptions = extraOptions;

      this._showCore(target, dataList);
    }
  };

  _proto._showCore = function _showCore(target, dataList) {
    if (!this._tooltip) {
      this._tooltip = this._createTooltip(target, dataList);
    } else {
      this._shouldUseTarget() && this._tooltip.option('target', target);

      this._list.option('dataSource', dataList);
    }

    this._prepareBeforeVisibleChanged(dataList);

    this._tooltip.option('visible', true);
  };

  _proto._prepareBeforeVisibleChanged = function _prepareBeforeVisibleChanged(dataList) {};

  _proto._getContentTemplate = function _getContentTemplate(dataList) {
    var _this = this;

    return function (container) {
      var listElement = (0, _renderer.default)('<div>');
      (0, _renderer.default)(container).append(listElement);
      _this._list = _this._createList(listElement, dataList);
    };
  };

  _proto.isAlreadyShown = function isAlreadyShown(target) {
    if (this._tooltip && this._tooltip.option('visible')) {
      return this._tooltip.option('target')[0] === target[0];
    }
  };

  _proto._onShown = function _onShown() {
    this._list.option('focusStateEnabled', this._extraOptions.focusStateEnabled);
  };

  _proto.dispose = function dispose() {};

  _proto.hide = function hide() {
    if (this._tooltip) {
      this._tooltip.option('visible', false);
    }
  };

  _proto._shouldUseTarget = function _shouldUseTarget() {
    return true;
  };

  _proto._createTooltip = function _createTooltip() {};

  _proto._canShowTooltip = function _canShowTooltip(dataList) {
    if (!dataList.length) {
      return false;
    }

    return true;
  };

  _proto._createListOption = function _createListOption(dataList) {
    var _this2 = this;

    return {
      dataSource: dataList,
      onContentReady: this._onListRender.bind(this),
      onItemClick: function onItemClick(e) {
        return _this2._onListItemClick(e);
      },
      itemTemplate: function itemTemplate(item, index) {
        return _this2._renderTemplate(item.appointment, item.targetedAppointment, index, item.color);
      },
      _swipeEnabled: false,
      pageLoadMode: 'scrollBottom'
    };
  };

  _proto._onListRender = function _onListRender() {};

  _proto._createTooltipElement = function _createTooltipElement(wrapperClass) {
    return (0, _renderer.default)('<div>').appendTo(this._options.container).addClass(wrapperClass);
  };

  _proto._createList = function _createList(listElement, dataList) {
    return this._options.createComponent(listElement, _uiList.default, this._createListOption(dataList));
  };

  _proto._renderTemplate = function _renderTemplate(appointment, targetedAppointment, index, color) {
    var itemListContent = this._createItemListContent(appointment, targetedAppointment, color);

    this._options.addDefaultTemplates(_defineProperty({}, this._getItemListTemplateName(), new _function_template.FunctionTemplate(function (options) {
      var $container = (0, _renderer.default)(options.container);
      $container.append(itemListContent);
      return $container;
    })));

    var template = this._options.getAppointmentTemplate(this._getItemListTemplateName() + 'Template');

    return this._createFunctionTemplate(template, appointment, targetedAppointment, index);
  };

  _proto._createFunctionTemplate = function _createFunctionTemplate(template, data, targetData, index) {
    var isEmptyDropDownAppointmentTemplate = this._isEmptyDropDownAppointmentTemplate();

    return new _function_template.FunctionTemplate(function (options) {
      return template.render({
        model: isEmptyDropDownAppointmentTemplate ? {
          appointmentData: data,
          targetedAppointmentData: targetData
        } : data,
        container: options.container,
        index: index
      });
    });
  };

  _proto._getItemListTemplateName = function _getItemListTemplateName() {
    return this._isEmptyDropDownAppointmentTemplate() ? 'appointmentTooltip' : 'dropDownAppointment';
  };

  _proto._isEmptyDropDownAppointmentTemplate = function _isEmptyDropDownAppointmentTemplate() {
    return !this._extraOptions.dropDownAppointmentTemplate || this._extraOptions.dropDownAppointmentTemplate === 'dropDownAppointment';
  };

  _proto._onListItemClick = function _onListItemClick(e) {
    this.hide();
    this._extraOptions.clickEvent && this._extraOptions.clickEvent(e);

    this._options.showAppointmentPopup(e.itemData.appointment, false, e.itemData.targetedAppointment);
  };

  _proto._createItemListContent = function _createItemListContent(appointment, targetedAppointment, color) {
    var editing = this._extraOptions.editing;
    var $itemElement = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM);
    $itemElement.append(this._createItemListMarker(color));
    $itemElement.append(this._createItemListInfo(this._options.createFormattedDateText(appointment, targetedAppointment)));

    var disabled = this._options.getAppointmentDisabled(appointment);

    if (!disabled && (editing && editing.allowDeleting === true || editing === true)) {
      $itemElement.append(this._createDeleteButton(appointment, targetedAppointment));
    }

    return $itemElement;
  };

  _proto._createItemListMarker = function _createItemListMarker(color) {
    var $marker = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_MARKER);
    var $markerBody = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY);
    $marker.append($markerBody);
    color && color.done(function (value) {
      return $markerBody.css('background', value);
    });
    return $marker;
  };

  _proto._createItemListInfo = function _createItemListInfo(object) {
    var result = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT);
    var $title = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT).text(object.text);
    var $date = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE).text(object.formatDate);
    return result.append($title).append($date);
  };

  _proto._createDeleteButton = function _createDeleteButton(appointment, targetedAppointment) {
    var _this3 = this;

    var $container = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER);
    var $deleteButton = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON);
    $container.append($deleteButton);

    this._options.createComponent($deleteButton, _button.default, {
      icon: 'trash',
      stylingMode: 'text',
      onClick: function onClick(e) {
        _this3.hide();

        e.event.stopPropagation();

        _this3._options.checkAndDeleteAppointment(appointment, targetedAppointment);
      }
    });

    return $container;
  };

  return TooltipStrategyBase;
}();

exports.TooltipStrategyBase = TooltipStrategyBase;
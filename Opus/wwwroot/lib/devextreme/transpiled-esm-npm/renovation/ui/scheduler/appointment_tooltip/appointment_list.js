"use strict";

exports.viewFunction = exports.AppointmentListProps = exports.AppointmentList = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _list = require("../../list");

var _item_layout = require("./item_layout");

var _get_current_appointment = _interopRequireDefault(require("./utils/get_current_appointment"));

var _default_functions = require("./utils/default_functions");

var _excluded = ["appointments", "checkAndDeleteAppointment", "focusStateEnabled", "getSingleAppointmentData", "getTextAndFormatDate", "isEditingAllowed", "itemContentTemplate", "onHide", "showAppointmentPopup", "target"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var viewFunction = function viewFunction(viewModel) {
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _list.List, _extends({
    "itemTemplate": function itemTemplate(_ref) {
      var index = _ref.index,
          item = _ref.item;
      return (0, _inferno.createComponentVNode)(2, _item_layout.TooltipItemLayout, {
        "item": item,
        "index": index,
        "onDelete": viewModel.props.checkAndDeleteAppointment,
        "onHide": viewModel.props.onHide,
        "itemContentTemplate": viewModel.props.itemContentTemplate,
        "getTextAndFormatDate": viewModel.props.getTextAndFormatDate,
        "singleAppointment": viewModel.props.getSingleAppointmentData(item.data, viewModel.props.target),
        "showDeleteButton": viewModel.props.isEditingAllowed && !item.data.disabled
      });
    },
    "dataSource": viewModel.props.appointments,
    "focusStateEnabled": viewModel.props.focusStateEnabled,
    "onItemClick": viewModel.onItemClick
  }, viewModel.restAttributes)));
};

exports.viewFunction = viewFunction;
var AppointmentListProps = {
  isEditingAllowed: true,
  focusStateEnabled: false,
  getTextAndFormatDate: _default_functions.defaultGetTextAndFormatDate,
  getSingleAppointmentData: _default_functions.defaultGetSingleAppointment
};
exports.AppointmentListProps = AppointmentListProps;

var getTemplate = function getTemplate(TemplateProp) {
  return TemplateProp && (TemplateProp.defaultProps ? function (props) {
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)));
  } : TemplateProp);
};

var AppointmentList = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(AppointmentList, _BaseInfernoComponent);

  function AppointmentList(props) {
    var _this;

    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }

  var _proto = AppointmentList.prototype;

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        itemContentTemplate: getTemplate(props.itemContentTemplate)
      }),
      onItemClick: this.onItemClick,
      restAttributes: this.restAttributes
    });
  };

  _createClass(AppointmentList, [{
    key: "onItemClick",
    get: function get() {
      var _this2 = this;

      return function (_ref2) {
        var itemData = _ref2.itemData;
        var showAppointmentPopup = _this2.props.showAppointmentPopup;
        showAppointmentPopup === null || showAppointmentPopup === void 0 ? void 0 : showAppointmentPopup(itemData.data, false, (0, _get_current_appointment.default)(itemData));
      };
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          appointments = _this$props.appointments,
          checkAndDeleteAppointment = _this$props.checkAndDeleteAppointment,
          focusStateEnabled = _this$props.focusStateEnabled,
          getSingleAppointmentData = _this$props.getSingleAppointmentData,
          getTextAndFormatDate = _this$props.getTextAndFormatDate,
          isEditingAllowed = _this$props.isEditingAllowed,
          itemContentTemplate = _this$props.itemContentTemplate,
          onHide = _this$props.onHide,
          showAppointmentPopup = _this$props.showAppointmentPopup,
          target = _this$props.target,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return AppointmentList;
}(_inferno2.BaseInfernoComponent);

exports.AppointmentList = AppointmentList;
AppointmentList.defaultProps = AppointmentListProps;
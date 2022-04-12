"use strict";

exports.viewFunction = exports.Scheduler = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _props = require("./props");

var _widget = require("../common/widget");

var _data_source = _interopRequireDefault(require("../../../data/data_source"));

var _views = require("./model/views");

var _work_space = require("./workspaces/base/work_space");

var _header = require("./header/header");

var _utils = require("../../../ui/scheduler/workspaces/view_model/utils");

var _common = require("./common");

var _createTimeZoneCalculator = require("./timeZoneCalculator/createTimeZoneCalculator");

var _utils2 = require("../../../ui/scheduler/resources/utils");

var _appointments = require("./view_model/appointments/appointments");

var _appointments2 = require("./model/appointments");

var _layout = require("./appointment/layout");

var _work_space_config = require("./workspaces/base/work_space_config");

var _data = require("./utils/data");

var _filter = require("./utils/filter");

var _excluded = ["accessKey", "activeStateEnabled", "adaptivityEnabled", "allDayExpr", "appointmentCollectorTemplate", "appointmentDragging", "appointmentTemplate", "appointmentTooltipTemplate", "cellDuration", "className", "crossScrollingEnabled", "currentDate", "currentDateChange", "currentView", "currentViewChange", "customizeDateNavigatorText", "dataCellTemplate", "dataSource", "dateCellTemplate", "dateSerializationFormat", "defaultCurrentDate", "defaultCurrentView", "descriptionExpr", "disabled", "editing", "endDateExpr", "endDateTimeZoneExpr", "endDayHour", "firstDayOfWeek", "focusStateEnabled", "groupByDate", "groups", "height", "hint", "hoverStateEnabled", "indicatorUpdateInterval", "max", "maxAppointmentsPerCell", "min", "noDataText", "onAppointmentAdded", "onAppointmentAdding", "onAppointmentClick", "onAppointmentContextMenu", "onAppointmentDblClick", "onAppointmentDeleted", "onAppointmentDeleting", "onAppointmentFormOpening", "onAppointmentRendered", "onAppointmentUpdated", "onAppointmentUpdating", "onCellClick", "onCellContextMenu", "onClick", "onKeyDown", "recurrenceEditMode", "recurrenceExceptionExpr", "recurrenceRuleExpr", "remoteFiltering", "resourceCellTemplate", "resources", "rtlEnabled", "scrolling", "selectedCellData", "shadeUntilCurrentTime", "showAllDayPanel", "showCurrentTimeIndicator", "startDateExpr", "startDateTimeZoneExpr", "startDayHour", "tabIndex", "textExpr", "timeCellTemplate", "timeZone", "toolbar", "useDropDownViewSwitcher", "views", "visible", "width"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var viewFunction = function viewFunction(_ref) {
  var appointmentsViewModel = _ref.appointmentsViewModel,
      currentViewConfig = _ref.currentViewConfig,
      dataCellTemplate = _ref.dataCellTemplate,
      dateCellTemplate = _ref.dateCellTemplate,
      loadedResources = _ref.loadedResources,
      onViewRendered = _ref.onViewRendered,
      _ref$props = _ref.props,
      accessKey = _ref$props.accessKey,
      activeStateEnabled = _ref$props.activeStateEnabled,
      className = _ref$props.className,
      currentView = _ref$props.currentView,
      customizeDateNavigatorText = _ref$props.customizeDateNavigatorText,
      disabled = _ref$props.disabled,
      focusStateEnabled = _ref$props.focusStateEnabled,
      height = _ref$props.height,
      hint = _ref$props.hint,
      hoverStateEnabled = _ref$props.hoverStateEnabled,
      max = _ref$props.max,
      min = _ref$props.min,
      rtlEnabled = _ref$props.rtlEnabled,
      tabIndex = _ref$props.tabIndex,
      toolbarItems = _ref$props.toolbar,
      useDropDownViewSwitcher = _ref$props.useDropDownViewSwitcher,
      views = _ref$props.views,
      visible = _ref$props.visible,
      width = _ref$props.width,
      resourceCellTemplate = _ref.resourceCellTemplate,
      restAttributes = _ref.restAttributes,
      setCurrentDate = _ref.setCurrentDate,
      setCurrentView = _ref.setCurrentView,
      startViewDate = _ref.startViewDate,
      timeCellTemplate = _ref.timeCellTemplate,
      workSpaceKey = _ref.workSpaceKey;
  var allDayPanelExpanded = currentViewConfig.allDayPanelExpanded,
      allowMultipleCellSelection = currentViewConfig.allowMultipleCellSelection,
      cellDuration = currentViewConfig.cellDuration,
      crossScrollingEnabled = currentViewConfig.crossScrollingEnabled,
      currentDate = currentViewConfig.currentDate,
      endDayHour = currentViewConfig.endDayHour,
      firstDayOfWeek = currentViewConfig.firstDayOfWeek,
      groupByDate = currentViewConfig.groupByDate,
      groupOrientation = currentViewConfig.groupOrientation,
      hoursInterval = currentViewConfig.hoursInterval,
      indicatorTime = currentViewConfig.indicatorTime,
      indicatorUpdateInterval = currentViewConfig.indicatorUpdateInterval,
      intervalCount = currentViewConfig.intervalCount,
      scrolling = currentViewConfig.scrolling,
      shadeUntilCurrentTime = currentViewConfig.shadeUntilCurrentTime,
      showAllDayPanel = currentViewConfig.showAllDayPanel,
      showCurrentTimeIndicator = currentViewConfig.showCurrentTimeIndicator,
      startDate = currentViewConfig.startDate,
      startDayHour = currentViewConfig.startDayHour,
      type = currentViewConfig.type;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "classes": "dx-scheduler dx-scheduler-native",
    "accessKey": accessKey,
    "activeStateEnabled": activeStateEnabled,
    "disabled": disabled,
    "focusStateEnabled": focusStateEnabled,
    "height": height,
    "hint": hint,
    "hoverStateEnabled": hoverStateEnabled,
    "rtlEnabled": rtlEnabled,
    "tabIndex": tabIndex,
    "visible": visible,
    "width": width,
    "className": className
  }, restAttributes, {
    children: (0, _inferno.createVNode)(1, "div", "dx-scheduler-container", [toolbarItems.length !== 0 && (0, _inferno.createComponentVNode)(2, _header.SchedulerToolbar, {
      "items": toolbarItems,
      "views": views,
      "currentView": currentView,
      "onCurrentViewUpdate": setCurrentView,
      "currentDate": currentDate,
      "onCurrentDateUpdate": setCurrentDate,
      "startViewDate": startViewDate,
      "min": min,
      "max": max,
      "intervalCount": intervalCount,
      "firstDayOfWeek": firstDayOfWeek,
      "useDropDownViewSwitcher": useDropDownViewSwitcher,
      "customizationFunction": customizeDateNavigatorText,
      "viewType": type
    }), (0, _inferno.createComponentVNode)(2, _work_space.WorkSpace, {
      "firstDayOfWeek": firstDayOfWeek,
      "startDayHour": startDayHour,
      "endDayHour": endDayHour,
      "cellDuration": cellDuration,
      "groupByDate": groupByDate,
      "scrolling": scrolling,
      "currentDate": currentDate,
      "intervalCount": intervalCount,
      "groupOrientation": groupOrientation,
      "startDate": startDate,
      "showAllDayPanel": showAllDayPanel,
      "showCurrentTimeIndicator": showCurrentTimeIndicator,
      "indicatorUpdateInterval": indicatorUpdateInterval,
      "shadeUntilCurrentTime": shadeUntilCurrentTime,
      "crossScrollingEnabled": crossScrollingEnabled,
      "hoursInterval": hoursInterval,
      "groups": loadedResources,
      "type": type,
      "schedulerHeight": height,
      "schedulerWidth": width,
      "indicatorTime": indicatorTime,
      "allowMultipleCellSelection": allowMultipleCellSelection,
      "allDayPanelExpanded": allDayPanelExpanded,
      "onViewRendered": onViewRendered,
      "dataCellTemplate": dataCellTemplate,
      "timeCellTemplate": timeCellTemplate,
      "dateCellTemplate": dateCellTemplate,
      "resourceCellTemplate": resourceCellTemplate,
      "allDayAppointments": (0, _inferno.createComponentVNode)(2, _layout.AppointmentLayout, {
        "isAllDay": true,
        "appointments": appointmentsViewModel.allDay,
        "overflowIndicators": appointmentsViewModel.allDayCompact
      }),
      "appointments": (0, _inferno.createComponentVNode)(2, _layout.AppointmentLayout, {
        "appointments": appointmentsViewModel.regular,
        "overflowIndicators": appointmentsViewModel.regularCompact
      })
    }, workSpaceKey)], 0)
  })));
};

exports.viewFunction = viewFunction;

var getTemplate = function getTemplate(TemplateProp) {
  return TemplateProp && (TemplateProp.defaultProps ? function (props) {
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)));
  } : TemplateProp);
};

var Scheduler = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(Scheduler, _InfernoWrapperCompon);

  function Scheduler(props) {
    var _this;

    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.__getterCache = {};
    _this.state = {
      instance: undefined,
      workSpaceViewModel: undefined,
      resourcePromisesMap: new Map(),
      loadedResources: undefined,
      dataItems: [],
      currentDate: _this.props.currentDate !== undefined ? _this.props.currentDate : _this.props.defaultCurrentDate,
      currentView: _this.props.currentView !== undefined ? _this.props.currentView : _this.props.defaultCurrentView
    };
    _this.getComponentInstance = _this.getComponentInstance.bind(_assertThisInitialized(_this));
    _this.addAppointment = _this.addAppointment.bind(_assertThisInitialized(_this));
    _this.deleteAppointment = _this.deleteAppointment.bind(_assertThisInitialized(_this));
    _this.updateAppointment = _this.updateAppointment.bind(_assertThisInitialized(_this));
    _this.getDataSource = _this.getDataSource.bind(_assertThisInitialized(_this));
    _this.getEndViewDate = _this.getEndViewDate.bind(_assertThisInitialized(_this));
    _this.getStartViewDate = _this.getStartViewDate.bind(_assertThisInitialized(_this));
    _this.hideAppointmentPopup = _this.hideAppointmentPopup.bind(_assertThisInitialized(_this));
    _this.hideAppointmentTooltip = _this.hideAppointmentTooltip.bind(_assertThisInitialized(_this));
    _this.scrollTo = _this.scrollTo.bind(_assertThisInitialized(_this));
    _this.scrollToTime = _this.scrollToTime.bind(_assertThisInitialized(_this));
    _this.showAppointmentPopup = _this.showAppointmentPopup.bind(_assertThisInitialized(_this));
    _this.showAppointmentTooltip = _this.showAppointmentTooltip.bind(_assertThisInitialized(_this));
    _this.dispose = _this.dispose.bind(_assertThisInitialized(_this));
    _this.loadGroupResources = _this.loadGroupResources.bind(_assertThisInitialized(_this));
    _this.loadDataSource = _this.loadDataSource.bind(_assertThisInitialized(_this));
    _this.onViewRendered = _this.onViewRendered.bind(_assertThisInitialized(_this));
    _this.setCurrentView = _this.setCurrentView.bind(_assertThisInitialized(_this));
    _this.setCurrentDate = _this.setCurrentDate.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Scheduler.prototype;

  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.dispose, []), new _inferno2.InfernoEffect(this.loadGroupResources, [this.props.groups, this.props.resources, this.state.currentView, this.props.currentView, this.props.views, this.state.resourcePromisesMap]), new _inferno2.InfernoEffect(this.loadDataSource, [this.props.dataSource]), (0, _inferno2.createReRenderEffect)()];
  };

  _proto.updateEffects = function updateEffects() {
    var _this$_effects$, _this$_effects$2;

    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.groups, this.props.resources, this.state.currentView, this.props.currentView, this.props.views, this.state.resourcePromisesMap]);
    (_this$_effects$2 = this._effects[2]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props.dataSource]);
  };

  _proto.dispose = function dispose() {
    var _this2 = this;

    return function () {
      _this2.state.instance.dispose();
    };
  };

  _proto.loadGroupResources = function loadGroupResources() {
    var _this3 = this;

    var _this$props = this.props,
        schedulerGroups = _this$props.groups,
        resources = _this$props.resources;
    var currentViewProps = this.currentViewProps.groups;
    var validGroups = currentViewProps !== null && currentViewProps !== void 0 ? currentViewProps : schedulerGroups;
    (0, _utils2.loadResources)(validGroups, resources, this.state.resourcePromisesMap).then(function (loadedResources) {
      _this3.setState(function (__state_argument) {
        return {
          loadedResources: loadedResources
        };
      });
    });
  };

  _proto.loadDataSource = function loadDataSource() {
    var _this4 = this;

    if (!this.internalDataSource.isLoaded() && !this.internalDataSource.isLoading()) {
      this.internalDataSource.load().done(function (loadOptions) {
        _this4.setState(function (__state_argument) {
          return {
            dataItems: (0, _data.resolveDataItems)(loadOptions)
          };
        });
      });
    }
  };

  _proto.onViewRendered = function onViewRendered(viewMetaData) {
    this.setState(function (__state_argument) {
      return {
        workSpaceViewModel: viewMetaData
      };
    });
  };

  _proto.setCurrentView = function setCurrentView(view) {
    {
      var __newValue;

      this.setState(function (__state_argument) {
        __newValue = view;
        return {
          currentView: __newValue
        };
      });
      this.props.currentViewChange(__newValue);
    }
  };

  _proto.setCurrentDate = function setCurrentDate(date) {
    {
      var __newValue;

      this.setState(function (__state_argument) {
        __newValue = date;
        return {
          currentDate: __newValue
        };
      });
      this.props.currentDateChange(__newValue);
    }
  };

  _proto.getComponentInstance = function getComponentInstance() {
    return this.state.instance;
  };

  _proto.addAppointment = function addAppointment(appointment) {
    this.state.instance.addAppointment(appointment);
  };

  _proto.deleteAppointment = function deleteAppointment(appointment) {
    this.state.instance.deleteAppointment(appointment);
  };

  _proto.updateAppointment = function updateAppointment(target, appointment) {
    this.state.instance.updateAppointment(target, appointment);
  };

  _proto.getDataSource = function getDataSource() {
    return this.state.instance.getDataSource();
  };

  _proto.getEndViewDate = function getEndViewDate() {
    return this.state.instance.getEndViewDate();
  };

  _proto.getStartViewDate = function getStartViewDate() {
    return this.state.instance.getStartViewDate();
  };

  _proto.hideAppointmentPopup = function hideAppointmentPopup(saveChanges) {
    this.state.instance.hideAppointmentPopup(saveChanges);
  };

  _proto.hideAppointmentTooltip = function hideAppointmentTooltip() {
    this.state.instance.hideAppointmentTooltip();
  };

  _proto.scrollTo = function scrollTo(date, group, allDay) {
    this.state.instance.scrollTo(date, group, allDay);
  };

  _proto.scrollToTime = function scrollToTime(hours, minutes, date) {
    this.state.instance.scrollToTime(hours, minutes, date);
  };

  _proto.showAppointmentPopup = function showAppointmentPopup(appointmentData, createNewAppointment, currentAppointmentData) {
    this.state.instance.showAppointmentPopup(appointmentData, createNewAppointment, currentAppointmentData);
  };

  _proto.showAppointmentTooltip = function showAppointmentTooltip(appointmentData, target, currentAppointmentData) {
    this.state.instance.showAppointmentTooltip(appointmentData, target, currentAppointmentData);
  };

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoWrapperCompon.prototype.componentWillUpdate.call(this);

    if (this.props["views"] !== nextProps["views"] || this.state["currentView"] !== nextState["currentView"] || this.props["currentView"] !== nextProps["currentView"] || this.props !== nextProps) {
      this.__getterCache["currentViewConfig"] = undefined;
    }

    if (this.props !== nextProps) {
      this.__getterCache["dataAccessors"] = undefined;
    }

    if (this.props["views"] !== nextProps["views"] || this.state["currentView"] !== nextState["currentView"] || this.props["currentView"] !== nextProps["currentView"] || this.props !== nextProps) {
      this.__getterCache["startViewDate"] = undefined;
    }

    if (this.props["timeZone"] !== nextProps["timeZone"]) {
      this.__getterCache["timeZoneCalculator"] = undefined;
    }

    if (this.props["views"] !== nextProps["views"] || this.state["currentView"] !== nextState["currentView"] || this.props["currentView"] !== nextProps["currentView"] || this.props !== nextProps || this.state["workSpaceViewModel"] !== nextState["workSpaceViewModel"] || this.state["loadedResources"] !== nextState["loadedResources"]) {
      this.__getterCache["appointmentsConfig"] = undefined;
    }

    if (this.state["dataItems"] !== nextState["dataItems"] || this.props !== nextProps || this.props["views"] !== nextProps["views"] || this.state["currentView"] !== nextState["currentView"] || this.props["currentView"] !== nextProps["currentView"] || this.props["timeZone"] !== nextProps["timeZone"]) {
      this.__getterCache["preparedDataItems"] = undefined;
    }

    if (this.props["views"] !== nextProps["views"] || this.state["currentView"] !== nextState["currentView"] || this.props["currentView"] !== nextProps["currentView"] || this.props !== nextProps || this.state["workSpaceViewModel"] !== nextState["workSpaceViewModel"] || this.state["loadedResources"] !== nextState["loadedResources"] || this.props["timeZone"] !== nextProps["timeZone"] || this.state["dataItems"] !== nextState["dataItems"]) {
      this.__getterCache["filteredItems"] = undefined;
    }

    if (this.props["views"] !== nextProps["views"] || this.state["currentView"] !== nextState["currentView"] || this.props["currentView"] !== nextProps["currentView"] || this.props !== nextProps || this.state["workSpaceViewModel"] !== nextState["workSpaceViewModel"] || this.state["loadedResources"] !== nextState["loadedResources"] || this.props["timeZone"] !== nextProps["timeZone"] || this.state["dataItems"] !== nextState["dataItems"]) {
      this.__getterCache["appointmentsViewModel"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        currentDate: this.props.currentDate !== undefined ? this.props.currentDate : this.state.currentDate,
        currentView: this.props.currentView !== undefined ? this.props.currentView : this.state.currentView,
        dataCellTemplate: getTemplate(props.dataCellTemplate),
        dateCellTemplate: getTemplate(props.dateCellTemplate),
        timeCellTemplate: getTemplate(props.timeCellTemplate),
        resourceCellTemplate: getTemplate(props.resourceCellTemplate),
        appointmentCollectorTemplate: getTemplate(props.appointmentCollectorTemplate),
        appointmentTemplate: getTemplate(props.appointmentTemplate),
        appointmentTooltipTemplate: getTemplate(props.appointmentTooltipTemplate)
      }),
      instance: this.state.instance,
      workSpaceViewModel: this.state.workSpaceViewModel,
      resourcePromisesMap: this.state.resourcePromisesMap,
      loadedResources: this.state.loadedResources,
      dataItems: this.state.dataItems,
      currentViewProps: this.currentViewProps,
      currentViewConfig: this.currentViewConfig,
      isValidViewDataProvider: this.isValidViewDataProvider,
      dataAccessors: this.dataAccessors,
      startViewDate: this.startViewDate,
      isVirtualScrolling: this.isVirtualScrolling,
      timeZoneCalculator: this.timeZoneCalculator,
      internalDataSource: this.internalDataSource,
      appointmentsConfig: this.appointmentsConfig,
      preparedDataItems: this.preparedDataItems,
      filteredItems: this.filteredItems,
      appointmentsViewModel: this.appointmentsViewModel,
      workSpaceKey: this.workSpaceKey,
      dataCellTemplate: this.dataCellTemplate,
      dateCellTemplate: this.dateCellTemplate,
      timeCellTemplate: this.timeCellTemplate,
      resourceCellTemplate: this.resourceCellTemplate,
      onViewRendered: this.onViewRendered,
      setCurrentView: this.setCurrentView,
      setCurrentDate: this.setCurrentDate,
      restAttributes: this.restAttributes
    });
  };

  _createClass(Scheduler, [{
    key: "currentViewProps",
    get: function get() {
      var views = this.props.views;
      return (0, _views.getCurrentViewProps)(this.props.currentView !== undefined ? this.props.currentView : this.state.currentView, views);
    }
  }, {
    key: "currentViewConfig",
    get: function get() {
      var _this5 = this;

      if (this.__getterCache["currentViewConfig"] !== undefined) {
        return this.__getterCache["currentViewConfig"];
      }

      return this.__getterCache["currentViewConfig"] = function () {
        return (0, _views.getCurrentViewConfig)(_this5.currentViewProps, _extends({}, _this5.props, {
          currentDate: _this5.props.currentDate !== undefined ? _this5.props.currentDate : _this5.state.currentDate,
          currentView: _this5.props.currentView !== undefined ? _this5.props.currentView : _this5.state.currentView
        }));
      }();
    }
  }, {
    key: "isValidViewDataProvider",
    get: function get() {
      var _this$state$workSpace;

      var _this$currentViewConf = this.currentViewConfig,
          allDayPanelExpanded = _this$currentViewConf.allDayPanelExpanded,
          cellDuration = _this$currentViewConf.cellDuration,
          crossScrollingEnabled = _this$currentViewConf.crossScrollingEnabled,
          currentDate = _this$currentViewConf.currentDate,
          endDayHour = _this$currentViewConf.endDayHour,
          firstDayOfWeek = _this$currentViewConf.firstDayOfWeek,
          groupByDate = _this$currentViewConf.groupByDate,
          groupOrientation = _this$currentViewConf.groupOrientation,
          hoursInterval = _this$currentViewConf.hoursInterval,
          intervalCount = _this$currentViewConf.intervalCount,
          scrolling = _this$currentViewConf.scrolling,
          showAllDayPanel = _this$currentViewConf.showAllDayPanel,
          startDate = _this$currentViewConf.startDate,
          startDayHour = _this$currentViewConf.startDayHour,
          type = _this$currentViewConf.type;
      return (0, _common.isViewDataProviderConfigValid)((_this$state$workSpace = this.state.workSpaceViewModel) === null || _this$state$workSpace === void 0 ? void 0 : _this$state$workSpace.viewDataProviderValidationOptions, {
        intervalCount: intervalCount !== null && intervalCount !== void 0 ? intervalCount : 1,
        currentDate: currentDate,
        type: type,
        hoursInterval: hoursInterval,
        startDayHour: startDayHour,
        endDayHour: endDayHour,
        groupOrientation: groupOrientation,
        groupByDate: groupByDate,
        crossScrollingEnabled: crossScrollingEnabled,
        firstDayOfWeek: firstDayOfWeek,
        startDate: startDate,
        showAllDayPanel: showAllDayPanel,
        allDayPanelExpanded: allDayPanelExpanded,
        scrolling: scrolling,
        cellDuration: cellDuration,
        groups: this.state.loadedResources
      });
    }
  }, {
    key: "dataAccessors",
    get: function get() {
      var _this6 = this;

      if (this.__getterCache["dataAccessors"] !== undefined) {
        return this.__getterCache["dataAccessors"];
      }

      return this.__getterCache["dataAccessors"] = function () {
        return (0, _common.createDataAccessors)(_extends({}, _this6.props, {
          currentDate: _this6.props.currentDate !== undefined ? _this6.props.currentDate : _this6.state.currentDate,
          currentView: _this6.props.currentView !== undefined ? _this6.props.currentView : _this6.state.currentView
        }));
      }();
    }
  }, {
    key: "startViewDate",
    get: function get() {
      var _this7 = this;

      if (this.__getterCache["startViewDate"] !== undefined) {
        return this.__getterCache["startViewDate"];
      }

      return this.__getterCache["startViewDate"] = function () {
        var _this7$currentViewCon = _this7.currentViewConfig,
            currentDate = _this7$currentViewCon.currentDate,
            firstDayOfWeek = _this7$currentViewCon.firstDayOfWeek,
            intervalCount = _this7$currentViewCon.intervalCount,
            startDate = _this7$currentViewCon.startDate,
            startDayHour = _this7$currentViewCon.startDayHour,
            type = _this7$currentViewCon.type;
        var options = {
          currentDate: currentDate,
          startDayHour: startDayHour,
          startDate: startDate,
          intervalCount: intervalCount,
          firstDayOfWeek: firstDayOfWeek
        };
        var viewDataGenerator = (0, _utils.getViewDataGeneratorByViewType)(type);
        var startViewDate = viewDataGenerator.getStartViewDate(options);
        return startViewDate;
      }();
    }
  }, {
    key: "isVirtualScrolling",
    get: function get() {
      var _this$currentViewProp;

      return this.props.scrolling.mode === "virtual" || ((_this$currentViewProp = this.currentViewProps.scrolling) === null || _this$currentViewProp === void 0 ? void 0 : _this$currentViewProp.mode) === "virtual";
    }
  }, {
    key: "timeZoneCalculator",
    get: function get() {
      var _this8 = this;

      if (this.__getterCache["timeZoneCalculator"] !== undefined) {
        return this.__getterCache["timeZoneCalculator"];
      }

      return this.__getterCache["timeZoneCalculator"] = function () {
        return (0, _createTimeZoneCalculator.createTimeZoneCalculator)(_this8.props.timeZone);
      }();
    }
  }, {
    key: "internalDataSource",
    get: function get() {
      if (this.props.dataSource instanceof _data_source.default) {
        return this.props.dataSource;
      }

      if (this.props.dataSource instanceof Array) {
        return new _data_source.default({
          store: {
            type: "array",
            data: this.props.dataSource
          },
          paginate: false
        });
      }

      return new _data_source.default(this.props.dataSource);
    }
  }, {
    key: "appointmentsConfig",
    get: function get() {
      var _this9 = this;

      if (this.__getterCache["appointmentsConfig"] !== undefined) {
        return this.__getterCache["appointmentsConfig"];
      }

      return this.__getterCache["appointmentsConfig"] = function () {
        if (!_this9.isValidViewDataProvider || !_this9.state.loadedResources) {
          return undefined;
        }

        var renderConfig = (0, _work_space_config.getViewRenderConfigByType)(_this9.currentViewConfig.type, _this9.currentViewConfig.crossScrollingEnabled, _this9.currentViewConfig.intervalCount, _this9.state.loadedResources, _this9.currentViewConfig.groupOrientation);
        return (0, _appointments2.getAppointmentsConfig)(_extends({}, _this9.props, {
          currentDate: _this9.props.currentDate !== undefined ? _this9.props.currentDate : _this9.state.currentDate,
          currentView: _this9.props.currentView !== undefined ? _this9.props.currentView : _this9.state.currentView
        }), _this9.currentViewConfig, _this9.state.loadedResources, _this9.state.workSpaceViewModel.viewDataProvider, renderConfig.isAllDayPanelSupported);
      }();
    }
  }, {
    key: "preparedDataItems",
    get: function get() {
      var _this10 = this;

      if (this.__getterCache["preparedDataItems"] !== undefined) {
        return this.__getterCache["preparedDataItems"];
      }

      return this.__getterCache["preparedDataItems"] = function () {
        return (0, _data.getPreparedDataItems)(_this10.state.dataItems, _this10.dataAccessors, _this10.currentViewConfig.cellDuration, _this10.timeZoneCalculator);
      }();
    }
  }, {
    key: "filteredItems",
    get: function get() {
      var _this11 = this;

      if (this.__getterCache["filteredItems"] !== undefined) {
        return this.__getterCache["filteredItems"];
      }

      return this.__getterCache["filteredItems"] = function () {
        if (!_this11.appointmentsConfig) {
          return [];
        }

        var filterStrategy = (0, _filter.getFilterStrategy)(_this11.appointmentsConfig.resources, _this11.appointmentsConfig.startDayHour, _this11.appointmentsConfig.endDayHour, _this11.appointmentsConfig.cellDurationInMinutes, _this11.appointmentsConfig.showAllDayPanel, _this11.appointmentsConfig.supportAllDayRow, _this11.appointmentsConfig.firstDayOfWeek, _this11.appointmentsConfig.viewType, _this11.appointmentsConfig.dateRange, _this11.appointmentsConfig.groupCount, _this11.appointmentsConfig.loadedResources, _this11.appointmentsConfig.isVirtualScrolling, _this11.timeZoneCalculator, _this11.dataAccessors, _this11.state.workSpaceViewModel.viewDataProvider);
        return filterStrategy.filter(_this11.preparedDataItems);
      }();
    }
  }, {
    key: "appointmentsViewModel",
    get: function get() {
      var _this12 = this;

      if (this.__getterCache["appointmentsViewModel"] !== undefined) {
        return this.__getterCache["appointmentsViewModel"];
      }

      return this.__getterCache["appointmentsViewModel"] = function () {
        if (!_this12.appointmentsConfig || _this12.filteredItems.length === 0) {
          return {
            allDay: [],
            allDayCompact: [],
            regular: [],
            regularCompact: []
          };
        }

        var model = (0, _appointments2.getAppointmentsModel)(_this12.appointmentsConfig, _this12.state.workSpaceViewModel.viewDataProvider, _this12.timeZoneCalculator, _this12.dataAccessors, _this12.state.workSpaceViewModel.cellsMetaData);
        return (0, _appointments.getAppointmentsViewModel)(model, _this12.filteredItems);
      }();
    }
  }, {
    key: "workSpaceKey",
    get: function get() {
      var _this$state$loadedRes;

      var crossScrollingEnabled = this.props.crossScrollingEnabled;
      var _this$currentViewConf2 = this.currentViewConfig,
          groupOrientation = _this$currentViewConf2.groupOrientation,
          intervalCount = _this$currentViewConf2.intervalCount;

      if (!crossScrollingEnabled) {
        return "";
      }

      var groupCount = (0, _utils2.getGroupCount)((_this$state$loadedRes = this.state.loadedResources) !== null && _this$state$loadedRes !== void 0 ? _this$state$loadedRes : []);
      return "".concat(this.props.currentView !== undefined ? this.props.currentView : this.state.currentView, "_").concat(groupOrientation, "_").concat(intervalCount, "_").concat(groupCount);
    }
  }, {
    key: "dataCellTemplate",
    get: function get() {
      return this.currentViewConfig.dataCellTemplate;
    }
  }, {
    key: "dateCellTemplate",
    get: function get() {
      return this.currentViewConfig.dateCellTemplate;
    }
  }, {
    key: "timeCellTemplate",
    get: function get() {
      return this.currentViewConfig.timeCellTemplate;
    }
  }, {
    key: "resourceCellTemplate",
    get: function get() {
      return this.currentViewConfig.resourceCellTemplate;
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props$currentDa = _extends({}, this.props, {
        currentDate: this.props.currentDate !== undefined ? this.props.currentDate : this.state.currentDate,
        currentView: this.props.currentView !== undefined ? this.props.currentView : this.state.currentView
      }),
          accessKey = _this$props$currentDa.accessKey,
          activeStateEnabled = _this$props$currentDa.activeStateEnabled,
          adaptivityEnabled = _this$props$currentDa.adaptivityEnabled,
          allDayExpr = _this$props$currentDa.allDayExpr,
          appointmentCollectorTemplate = _this$props$currentDa.appointmentCollectorTemplate,
          appointmentDragging = _this$props$currentDa.appointmentDragging,
          appointmentTemplate = _this$props$currentDa.appointmentTemplate,
          appointmentTooltipTemplate = _this$props$currentDa.appointmentTooltipTemplate,
          cellDuration = _this$props$currentDa.cellDuration,
          className = _this$props$currentDa.className,
          crossScrollingEnabled = _this$props$currentDa.crossScrollingEnabled,
          currentDate = _this$props$currentDa.currentDate,
          currentDateChange = _this$props$currentDa.currentDateChange,
          currentView = _this$props$currentDa.currentView,
          currentViewChange = _this$props$currentDa.currentViewChange,
          customizeDateNavigatorText = _this$props$currentDa.customizeDateNavigatorText,
          dataCellTemplate = _this$props$currentDa.dataCellTemplate,
          dataSource = _this$props$currentDa.dataSource,
          dateCellTemplate = _this$props$currentDa.dateCellTemplate,
          dateSerializationFormat = _this$props$currentDa.dateSerializationFormat,
          defaultCurrentDate = _this$props$currentDa.defaultCurrentDate,
          defaultCurrentView = _this$props$currentDa.defaultCurrentView,
          descriptionExpr = _this$props$currentDa.descriptionExpr,
          disabled = _this$props$currentDa.disabled,
          editing = _this$props$currentDa.editing,
          endDateExpr = _this$props$currentDa.endDateExpr,
          endDateTimeZoneExpr = _this$props$currentDa.endDateTimeZoneExpr,
          endDayHour = _this$props$currentDa.endDayHour,
          firstDayOfWeek = _this$props$currentDa.firstDayOfWeek,
          focusStateEnabled = _this$props$currentDa.focusStateEnabled,
          groupByDate = _this$props$currentDa.groupByDate,
          groups = _this$props$currentDa.groups,
          height = _this$props$currentDa.height,
          hint = _this$props$currentDa.hint,
          hoverStateEnabled = _this$props$currentDa.hoverStateEnabled,
          indicatorUpdateInterval = _this$props$currentDa.indicatorUpdateInterval,
          max = _this$props$currentDa.max,
          maxAppointmentsPerCell = _this$props$currentDa.maxAppointmentsPerCell,
          min = _this$props$currentDa.min,
          noDataText = _this$props$currentDa.noDataText,
          onAppointmentAdded = _this$props$currentDa.onAppointmentAdded,
          onAppointmentAdding = _this$props$currentDa.onAppointmentAdding,
          onAppointmentClick = _this$props$currentDa.onAppointmentClick,
          onAppointmentContextMenu = _this$props$currentDa.onAppointmentContextMenu,
          onAppointmentDblClick = _this$props$currentDa.onAppointmentDblClick,
          onAppointmentDeleted = _this$props$currentDa.onAppointmentDeleted,
          onAppointmentDeleting = _this$props$currentDa.onAppointmentDeleting,
          onAppointmentFormOpening = _this$props$currentDa.onAppointmentFormOpening,
          onAppointmentRendered = _this$props$currentDa.onAppointmentRendered,
          onAppointmentUpdated = _this$props$currentDa.onAppointmentUpdated,
          onAppointmentUpdating = _this$props$currentDa.onAppointmentUpdating,
          onCellClick = _this$props$currentDa.onCellClick,
          onCellContextMenu = _this$props$currentDa.onCellContextMenu,
          onClick = _this$props$currentDa.onClick,
          onKeyDown = _this$props$currentDa.onKeyDown,
          recurrenceEditMode = _this$props$currentDa.recurrenceEditMode,
          recurrenceExceptionExpr = _this$props$currentDa.recurrenceExceptionExpr,
          recurrenceRuleExpr = _this$props$currentDa.recurrenceRuleExpr,
          remoteFiltering = _this$props$currentDa.remoteFiltering,
          resourceCellTemplate = _this$props$currentDa.resourceCellTemplate,
          resources = _this$props$currentDa.resources,
          rtlEnabled = _this$props$currentDa.rtlEnabled,
          scrolling = _this$props$currentDa.scrolling,
          selectedCellData = _this$props$currentDa.selectedCellData,
          shadeUntilCurrentTime = _this$props$currentDa.shadeUntilCurrentTime,
          showAllDayPanel = _this$props$currentDa.showAllDayPanel,
          showCurrentTimeIndicator = _this$props$currentDa.showCurrentTimeIndicator,
          startDateExpr = _this$props$currentDa.startDateExpr,
          startDateTimeZoneExpr = _this$props$currentDa.startDateTimeZoneExpr,
          startDayHour = _this$props$currentDa.startDayHour,
          tabIndex = _this$props$currentDa.tabIndex,
          textExpr = _this$props$currentDa.textExpr,
          timeCellTemplate = _this$props$currentDa.timeCellTemplate,
          timeZone = _this$props$currentDa.timeZone,
          toolbar = _this$props$currentDa.toolbar,
          useDropDownViewSwitcher = _this$props$currentDa.useDropDownViewSwitcher,
          views = _this$props$currentDa.views,
          visible = _this$props$currentDa.visible,
          width = _this$props$currentDa.width,
          restProps = _objectWithoutProperties(_this$props$currentDa, _excluded);

      return restProps;
    }
  }]);

  return Scheduler;
}(_inferno2.InfernoWrapperComponent);

exports.Scheduler = Scheduler;
Scheduler.defaultProps = _props.SchedulerProps;
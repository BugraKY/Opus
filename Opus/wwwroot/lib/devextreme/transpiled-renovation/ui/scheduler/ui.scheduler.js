"use strict";

exports.default = void 0;

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _config = _interopRequireDefault(require("../../core/config"));

var _devices = _interopRequireDefault(require("../../core/devices"));

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _bindable_template = require("../../core/templates/bindable_template");

var _empty_template = require("../../core/templates/empty_template");

var _array = require("../../core/utils/array");

var _callbacks = _interopRequireDefault(require("../../core/utils/callbacks"));

var _common = require("../../core/utils/common");

var _data = require("../../core/utils/data");

var _position = require("../../core/utils/position");

var _date = _interopRequireDefault(require("../../core/utils/date"));

var _date_serialization = _interopRequireDefault(require("../../core/utils/date_serialization"));

var _deferred = require("../../core/utils/deferred");

var _extend = require("../../core/utils/extend");

var _iterator = require("../../core/utils/iterator");

var _type = require("../../core/utils/type");

var _window = require("../../core/utils/window");

var _data_helper = _interopRequireDefault(require("../../data_helper"));

var _visibility_change = require("../../events/visibility_change");

var _date2 = _interopRequireDefault(require("../../localization/date"));

var _message = _interopRequireDefault(require("../../localization/message"));

var _dialog = require("../dialog");

var _themes = require("../themes");

var _ui = _interopRequireDefault(require("../widget/ui.errors"));

var _ui2 = _interopRequireDefault(require("../widget/ui.widget"));

var _popup = require("./appointmentPopup/popup");

var _form = require("./appointmentPopup/form");

var _compactAppointmentsHelper = require("./compactAppointmentsHelper");

var _desktopTooltipStrategy = require("./tooltip_strategies/desktopTooltipStrategy");

var _mobileTooltipStrategy = require("./tooltip_strategies/mobileTooltipStrategy");

var _loading = require("./loading");

var _appointmentCollection = _interopRequireDefault(require("./appointments/appointmentCollection"));

var _appointments = _interopRequireDefault(require("./appointments.layout_manager"));

var _header = require("./header/header");

var _subscribes = _interopRequireDefault(require("./subscribes"));

var _recurrence = require("./recurrence");

var _utils = _interopRequireDefault(require("./utils.timeZone"));

var _uiScheduler = _interopRequireDefault(require("./workspaces/ui.scheduler.agenda"));

var _uiScheduler2 = _interopRequireDefault(require("./workspaces/ui.scheduler.timeline_day"));

var _uiScheduler3 = _interopRequireDefault(require("./workspaces/ui.scheduler.timeline_month"));

var _uiScheduler4 = _interopRequireDefault(require("./workspaces/ui.scheduler.timeline_week"));

var _uiScheduler5 = _interopRequireDefault(require("./workspaces/ui.scheduler.timeline_work_week"));

var _uiScheduler6 = _interopRequireDefault(require("./workspaces/ui.scheduler.work_space_day"));

var _uiScheduler7 = _interopRequireDefault(require("./workspaces/ui.scheduler.work_space_month"));

var _uiScheduler8 = _interopRequireDefault(require("./workspaces/ui.scheduler.work_space_week"));

var _uiScheduler9 = _interopRequireDefault(require("./workspaces/ui.scheduler.work_space_work_week"));

var _appointmentAdapter = require("./appointmentAdapter");

var _dataStructures = require("./dataStructures");

var _utils2 = require("./utils");

var _utils3 = require("./resources/utils");

var _expressionUtils = require("./expressionUtils");

var _base = require("../../renovation/ui/scheduler/view_model/to_test/views/utils/base");

var _render2 = require("./appointments/render");

var _agendaResourceProcessor = require("./resources/agendaResourceProcessor");

var _appointmentDataProvider = require("./appointments/dataProvider/appointmentDataProvider");

var _utils4 = require("./appointments/dataProvider/utils");

var _data2 = require("../../renovation/ui/scheduler/utils/data");

var _views = require("../../renovation/ui/scheduler/model/views");

var _createTimeZoneCalculator = require("../../renovation/ui/scheduler/timeZoneCalculator/createTimeZoneCalculator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// STYLE scheduler
var MINUTES_IN_HOUR = 60;
var WIDGET_CLASS = 'dx-scheduler';
var WIDGET_SMALL_CLASS = "".concat(WIDGET_CLASS, "-small");
var WIDGET_ADAPTIVE_CLASS = "".concat(WIDGET_CLASS, "-adaptive");
var WIDGET_READONLY_CLASS = "".concat(WIDGET_CLASS, "-readonly");
var WIDGET_SMALL_WIDTH = 400;
var FULL_DATE_FORMAT = 'yyyyMMddTHHmmss';
var UTC_FULL_DATE_FORMAT = FULL_DATE_FORMAT + 'Z';
var DEFAULT_AGENDA_DURATION = 7;
var DEFAULT_APPOINTMENT_TEMPLATE_NAME = 'item';
var DEFAULT_APPOINTMENT_COLLECTOR_TEMPLATE_NAME = 'appointmentCollector';
var DEFAULT_DROP_DOWN_APPOINTMENT_TEMPLATE_NAME = 'dropDownAppointment';
var VIEWS_CONFIG = {
  day: {
    workSpace: _uiScheduler6.default,
    renderingStrategy: 'vertical'
  },
  week: {
    workSpace: _uiScheduler8.default,
    renderingStrategy: 'vertical'
  },
  workWeek: {
    workSpace: _uiScheduler9.default,
    renderingStrategy: 'vertical'
  },
  month: {
    workSpace: _uiScheduler7.default,
    renderingStrategy: 'horizontalMonth'
  },
  timelineDay: {
    workSpace: _uiScheduler2.default,
    renderingStrategy: 'horizontal'
  },
  timelineWeek: {
    workSpace: _uiScheduler4.default,
    renderingStrategy: 'horizontal'
  },
  timelineWorkWeek: {
    workSpace: _uiScheduler5.default,
    renderingStrategy: 'horizontal'
  },
  timelineMonth: {
    workSpace: _uiScheduler3.default,
    renderingStrategy: 'horizontalMonthLine'
  },
  agenda: {
    workSpace: _uiScheduler.default,
    renderingStrategy: 'agenda'
  }
};
var StoreEventNames = {
  ADDING: 'onAppointmentAdding',
  ADDED: 'onAppointmentAdded',
  DELETING: 'onAppointmentDeleting',
  DELETED: 'onAppointmentDeleted',
  UPDATING: 'onAppointmentUpdating',
  UPDATED: 'onAppointmentUpdated'
};
var RECURRENCE_EDITING_MODE = {
  SERIES: 'editSeries',
  OCCURENCE: 'editOccurence',
  CANCEL: 'cancel'
};

var Scheduler = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(Scheduler, _Widget);

  function Scheduler() {
    return _Widget.apply(this, arguments) || this;
  }

  var _proto = Scheduler.prototype;

  _proto._getDefaultOptions = function _getDefaultOptions() {
    var defaultOptions = (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      views: ['day', 'week'],
      currentView: 'day',
      // TODO: should we calculate currentView if views array contains only one item, for example 'month'?
      currentDate: _date.default.trimTime(new Date()),
      min: undefined,
      max: undefined,
      dateSerializationFormat: undefined,
      firstDayOfWeek: undefined,
      groups: [],
      resources: [],
      loadedResources: [],
      resourceLoaderMap: new Map(),
      dataSource: null,
      customizeDateNavigatorText: undefined,
      appointmentTemplate: DEFAULT_APPOINTMENT_TEMPLATE_NAME,
      dropDownAppointmentTemplate: DEFAULT_DROP_DOWN_APPOINTMENT_TEMPLATE_NAME,
      appointmentCollectorTemplate: DEFAULT_APPOINTMENT_COLLECTOR_TEMPLATE_NAME,
      dataCellTemplate: null,
      timeCellTemplate: null,
      resourceCellTemplate: null,
      dateCellTemplate: null,
      startDayHour: 0,
      endDayHour: 24,
      editing: {
        allowAdding: true,
        allowDeleting: true,
        allowDragging: true,
        allowResizing: true,
        allowUpdating: true,
        allowTimeZoneEditing: false
      },
      showAllDayPanel: true,
      showCurrentTimeIndicator: true,
      shadeUntilCurrentTime: false,
      indicatorUpdateInterval: 300000,

      /**
          * @hidden
          * @name dxSchedulerOptions.indicatorTime
          * @type Date
          * @default undefined
          */
      indicatorTime: undefined,
      recurrenceEditMode: 'dialog',
      cellDuration: 30,
      maxAppointmentsPerCell: 'auto',
      selectedCellData: [],
      groupByDate: false,
      onAppointmentRendered: null,
      onAppointmentClick: null,
      onAppointmentDblClick: null,
      onAppointmentContextMenu: null,
      onCellClick: null,
      onCellContextMenu: null,
      onAppointmentAdding: null,
      onAppointmentAdded: null,
      onAppointmentUpdating: null,
      onAppointmentUpdated: null,
      onAppointmentDeleting: null,
      onAppointmentDeleted: null,
      onAppointmentFormOpening: null,
      appointmentTooltipTemplate: 'appointmentTooltip',

      /**
          * @hidden
          * @name dxSchedulerOptions.appointmentPopupTemplate
          * @type template|function
          * @default "appointmentPopup"
          * @type_function_param1 appointmentData:object
          * @type_function_param2 contentElement:DxElement
          * @type_function_return string|Element|jQuery
          */
      appointmentPopupTemplate: 'appointmentPopup',
      crossScrollingEnabled: false,
      useDropDownViewSwitcher: false,
      startDateExpr: 'startDate',
      endDateExpr: 'endDate',
      textExpr: 'text',
      descriptionExpr: 'description',
      allDayExpr: 'allDay',
      recurrenceRuleExpr: 'recurrenceRule',
      recurrenceExceptionExpr: 'recurrenceException',
      disabledExpr: 'disabled',
      remoteFiltering: false,
      timeZone: '',
      startDateTimeZoneExpr: 'startDateTimeZone',
      endDateTimeZoneExpr: 'endDateTimeZone',
      noDataText: _message.default.format('dxCollectionWidget-noDataText'),
      adaptivityEnabled: false,
      allowMultipleCellSelection: true,
      scrolling: {
        mode: 'standard'
      },
      renovateRender: true,
      _draggingMode: 'outlook',
      _appointmentTooltipOffset: {
        x: 0,
        y: 0
      },
      _appointmentTooltipButtonsPosition: 'bottom',
      _appointmentTooltipOpenButtonText: _message.default.format('dxScheduler-openAppointment'),
      _dropDownButtonIcon: 'overflow',
      _appointmentCountPerCell: 2,
      _collectorOffset: 0,
      _appointmentOffset: 26,
      toolbar: [{
        location: 'before',
        defaultElement: 'dateNavigator'
      }, {
        location: 'after',
        defaultElement: 'viewSwitcher'
      }]
      /**
          * @name dxSchedulerOptions.activeStateEnabled
          * @hidden
          */

      /**
          * @name dxSchedulerOptions.hoverStateEnabled
          * @hidden
          */

    });
    return (0, _extend.extend)(true, defaultOptions, {
      integrationOptions: {
        useDeferUpdateForTemplates: false
      }
    });
  };

  _proto._setDeprecatedOptions = function _setDeprecatedOptions() {
    _Widget.prototype._setDeprecatedOptions.call(this);

    (0, _extend.extend)(this._deprecatedOptions, {
      dropDownAppointmentTemplate: {
        since: '19.2',
        message: 'appointmentTooltipTemplate'
      }
    });
  };

  _proto._defaultOptionsRules = function _defaultOptionsRules() {
    return _Widget.prototype._defaultOptionsRules.call(this).concat([{
      device: function device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device: function device() {
        return !_devices.default.current().generic;
      },
      options: {
        useDropDownViewSwitcher: true,
        editing: {
          allowDragging: false,
          allowResizing: false
        }
      }
    }, {
      device: function device() {
        return (0, _themes.isMaterial)();
      },
      options: {
        useDropDownViewSwitcher: true,
        dateCellTemplate: function dateCellTemplate(data, index, element) {
          var text = data.text;
          text.split(' ').forEach(function (text, index) {
            var span = (0, _renderer.default)('<span>').text(text).addClass('dx-scheduler-header-panel-cell-date');
            (0, _renderer.default)(element).append(span);
            if (!index) (0, _renderer.default)(element).append(' ');
          });
        },
        _appointmentTooltipOffset: {
          x: 0,
          y: 11
        },
        _appointmentTooltipButtonsPosition: 'top',
        _appointmentTooltipOpenButtonText: null,
        _dropDownButtonIcon: 'chevrondown',
        _appointmentCountPerCell: 1,
        _collectorOffset: 20,
        _appointmentOffset: 30
      }
    }]);
  };

  _proto._postponeDataSourceLoading = function _postponeDataSourceLoading(promise) {
    this.postponedOperations.add('_reloadDataSource', this._reloadDataSource.bind(this), promise);
  };

  _proto._postponeResourceLoading = function _postponeResourceLoading() {
    var _this = this;

    var whenLoaded = this.postponedOperations.add('loadResources', function () {
      var groups = _this._getCurrentViewOption('groups');

      return (0, _utils3.loadResources)(groups, _this.option('resources'), _this.option('resourceLoaderMap'));
    });
    var resolveCallbacks = new _deferred.Deferred();
    whenLoaded.done(function (resources) {
      _this.option('loadedResources', resources);

      resolveCallbacks.resolve(resources);
    });

    this._postponeDataSourceLoading(whenLoaded);

    return resolveCallbacks.promise();
  };

  _proto._optionChanged = function _optionChanged(args) {
    var _this$_header,
        _this$_header2,
        _this2 = this,
        _this$_header4;

    var value = args.value;
    var name = args.name;

    switch (args.name) {
      case 'customizeDateNavigatorText':
        this._updateOption('header', name, value);

        break;

      case 'firstDayOfWeek':
        this._updateOption('workSpace', name, value);

        this._updateOption('header', name, value);

        break;

      case 'currentDate':
        value = this._dateOption(name);
        value = _date.default.trimTime(new Date(value));
        this.option('selectedCellData', []);

        this._workSpace.option(name, new Date(value));

        (_this$_header = this._header) === null || _this$_header === void 0 ? void 0 : _this$_header.option(name, new Date(value));
        (_this$_header2 = this._header) === null || _this$_header2 === void 0 ? void 0 : _this$_header2.option('startViewDate', this.getStartViewDate());

        this._appointments.option('items', []);

        this._filterAppointmentsByDate();

        this._postponeDataSourceLoading();

        break;

      case 'dataSource':
        this._initDataSource();

        this.appointmentDataProvider.setDataSource(this._dataSource);

        this._postponeResourceLoading().done(function (resources) {
          _this2._filterAppointmentsByDate();

          _this2._updateOption('workSpace', 'showAllDayPanel', _this2.option('showAllDayPanel'));
        });

        break;

      case 'min':
      case 'max':
        value = this._dateOption(name);

        this._updateOption('header', name, new Date(value));

        this._updateOption('workSpace', name, new Date(value));

        break;

      case 'views':
        if (this._getCurrentViewOptions()) {
          this.repaint();
        } else {
          var _this$_header3;

          (_this$_header3 = this._header) === null || _this$_header3 === void 0 ? void 0 : _this$_header3.option(name, value);
        }

        break;

      case 'useDropDownViewSwitcher':
        (_this$_header4 = this._header) === null || _this$_header4 === void 0 ? void 0 : _this$_header4.option(name, value);
        break;

      case 'currentView':
        this._validateDayHours();

        this._validateCellDuration();

        this._appointments.option({
          items: [],
          allowDrag: this._allowDragging(),
          allowResize: this._allowResizing(),
          itemTemplate: this._getAppointmentTemplate('appointmentTemplate')
        });

        this._postponeResourceLoading().done(function (resources) {
          _this2._refreshWorkSpace(resources);

          _this2._updateHeader();

          _this2._filterAppointmentsByDate();

          _this2._appointments.option('allowAllDayResize', value !== 'day');
        });

        break;

      case 'appointmentTemplate':
        this._appointments.option('itemTemplate', value);

        break;

      case 'dateCellTemplate':
      case 'resourceCellTemplate':
      case 'dataCellTemplate':
      case 'timeCellTemplate':
        this.repaint();
        break;

      case 'groups':
        this._postponeResourceLoading().done(function (resources) {
          _this2._refreshWorkSpace(resources);

          _this2._filterAppointmentsByDate();
        });

        break;

      case 'resources':
        this._dataAccessors.resources = (0, _utils3.createExpressions)(this.option('resources'));
        this.agendaResourceProcessor.initializeState(value);
        this.updateInstances();

        this._postponeResourceLoading().done(function (resources) {
          _this2._appointments.option('items', []);

          _this2._refreshWorkSpace(resources);

          _this2._filterAppointmentsByDate();

          _this2._createAppointmentPopupForm();
        });

        break;

      case 'startDayHour':
      case 'endDayHour':
        this._validateDayHours();

        this.updateInstances();

        this._appointments.option('items', []);

        this._updateOption('workSpace', name, value);

        this._appointments.repaint();

        this._filterAppointmentsByDate();

        this._postponeDataSourceLoading();

        break;

      case StoreEventNames.ADDING:
      case StoreEventNames.ADDED:
      case StoreEventNames.UPDATING:
      case StoreEventNames.UPDATED:
      case StoreEventNames.DELETING:
      case StoreEventNames.DELETED:
      case 'onAppointmentFormOpening':
        this._actions[name] = this._createActionByOption(name);
        break;

      case 'onAppointmentRendered':
        this._appointments.option('onItemRendered', this._getAppointmentRenderedAction());

        break;

      case 'onAppointmentClick':
        this._appointments.option('onItemClick', this._createActionByOption(name));

        break;

      case 'onAppointmentDblClick':
        this._appointments.option(name, this._createActionByOption(name));

        break;

      case 'onAppointmentContextMenu':
        this._appointments.option('onItemContextMenu', this._createActionByOption(name));

        break;

      case 'noDataText':
      case 'allowMultipleCellSelection':
      case 'selectedCellData':
      case 'accessKey':
      case 'onCellClick':
        this._workSpace.option(name, value);

        break;

      case 'onCellContextMenu':
        this._workSpace.option(name, value);

        break;

      case 'crossScrollingEnabled':
        this._postponeResourceLoading().done(function (resources) {
          _this2._appointments.option('items', []);

          _this2._refreshWorkSpace(resources);

          if (_this2._readyToRenderAppointments) {
            _this2._appointments.option('items', _this2._getAppointmentsToRepaint());
          }
        });

        break;

      case 'cellDuration':
        this._validateCellDuration();

        this._appointments.option('items', []);

        if (this._readyToRenderAppointments) {
          this._updateOption('workSpace', 'hoursInterval', value / 60);

          this._appointments.option('items', this._getAppointmentsToRepaint());
        }

        break;

      case 'tabIndex':
      case 'focusStateEnabled':
        this._updateOption('header', name, value);

        this._updateOption('workSpace', name, value);

        this._appointments.option(name, value);

        _Widget.prototype._optionChanged.call(this, args);

        break;

      case 'width':
        // TODO: replace with css
        this._updateOption('header', name, value);

        if (this.option('crossScrollingEnabled')) {
          this._updateOption('workSpace', 'width', value);
        }

        this._updateOption('workSpace', 'schedulerWidth', value);

        _Widget.prototype._optionChanged.call(this, args);

        this._dimensionChanged();

        break;

      case 'height':
        _Widget.prototype._optionChanged.call(this, args);

        this._dimensionChanged();

        this._updateOption('workSpace', 'schedulerHeight', value);

        break;

      case 'editing':
        {
          this._initEditing();

          var editing = this._editing;

          this._bringEditingModeToAppointments(editing);

          this.hideAppointmentTooltip();

          this._cleanPopup();

          break;
        }

      case 'showAllDayPanel':
        this.updateInstances();

        this._postponeResourceLoading().done(function (resources) {
          _this2._filterAppointmentsByDate();

          _this2._updateOption('workSpace', 'allDayExpanded', value);

          _this2._updateOption('workSpace', name, value);
        });

        break;

      case 'showCurrentTimeIndicator':
      case 'indicatorTime':
      case 'indicatorUpdateInterval':
      case 'shadeUntilCurrentTime':
      case 'groupByDate':
        this._updateOption('workSpace', name, value);

        this.repaint();
        break;

      case 'appointmentDragging':
      case 'appointmentTooltipTemplate':
      case 'appointmentPopupTemplate':
      case 'recurrenceEditMode':
      case 'remoteFiltering':
      case 'timeZone':
        this.updateInstances();
        this.repaint();
        break;

      case 'dropDownAppointmentTemplate':
      case 'appointmentCollectorTemplate':
      case '_appointmentTooltipOffset':
      case '_appointmentTooltipButtonsPosition':
      case '_appointmentTooltipOpenButtonText':
      case '_dropDownButtonIcon':
      case '_appointmentCountPerCell':
      case '_collectorOffset':
      case '_appointmentOffset':
        this.repaint();
        break;

      case 'dateSerializationFormat':
        break;

      case 'maxAppointmentsPerCell':
        break;

      case 'startDateExpr':
      case 'endDateExpr':
      case 'startDateTimeZoneExpr':
      case 'endDateTimeZoneExpr':
      case 'textExpr':
      case 'descriptionExpr':
      case 'allDayExpr':
      case 'recurrenceRuleExpr':
      case 'recurrenceExceptionExpr':
      case 'disabledExpr':
        this._updateExpression(name, value);

        this.appointmentDataProvider.updateDataAccessors(this._dataAccessors);

        this._initAppointmentTemplate();

        this.repaint();
        break;

      case 'adaptivityEnabled':
        this._toggleAdaptiveClass();

        this.repaint();
        break;

      case 'scrolling':
        this.option('crossScrollingEnabled', this._isHorizontalVirtualScrolling() || this.option('crossScrollingEnabled'));

        this._updateOption('workSpace', args.fullName, value);

        break;

      case 'renovateRender':
        this._updateOption('workSpace', name, value);

        break;

      case '_draggingMode':
        this._workSpace.option('draggingMode', value);

        break;

      case 'toolbar':
        this._header ? this._header.option('items', value) : this.repaint();
        break;

      case 'loadedResources':
      case 'resourceLoaderMap':
        break;

      default:
        _Widget.prototype._optionChanged.call(this, args);

    }
  };

  _proto._updateHeader = function _updateHeader() {
    var _this$_header5;

    (_this$_header5 = this._header) === null || _this$_header5 === void 0 ? void 0 : _this$_header5.option({
      'intervalCount': this._getViewCountConfig().intervalCount,
      'startViewDate': this.getStartViewDate(),
      'min': this._dateOption('min'),
      'max': this._dateOption('max'),
      'currentDate': this._dateOption('currentDate'),
      'firstDayOfWeek': this.getFirstDayOfWeek(),
      'currentView': this.currentView
    });
  };

  _proto._dateOption = function _dateOption(optionName) {
    var optionValue = this._getCurrentViewOption(optionName);

    return _date_serialization.default.deserializeDate(optionValue);
  };

  _proto._getSerializationFormat = function _getSerializationFormat(optionName) {
    var value = this._getCurrentViewOption(optionName);

    if (typeof value === 'number') {
      return 'number';
    }

    if (!(0, _type.isString)(value)) {
      return;
    }

    return _date_serialization.default.getDateSerializationFormat(value);
  };

  _proto._bringEditingModeToAppointments = function _bringEditingModeToAppointments(editing) {
    var editingConfig = {
      allowDelete: editing.allowUpdating && editing.allowDeleting
    };

    if (!this._isAgenda()) {
      editingConfig.allowDrag = editing.allowDragging;
      editingConfig.allowResize = editing.allowResizing;
      editingConfig.allowAllDayResize = editing.allowResizing && this._supportAllDayResizing();
    }

    this._appointments.option(editingConfig);

    this.repaint();
  };

  _proto._isAgenda = function _isAgenda() {
    return this.getLayoutManager().appointmentRenderingStrategyName === 'agenda';
  };

  _proto._allowDragging = function _allowDragging() {
    return this._editing.allowDragging && !this._isAgenda();
  };

  _proto._allowResizing = function _allowResizing() {
    return this._editing.allowResizing && !this._isAgenda();
  };

  _proto._allowAllDayResizing = function _allowAllDayResizing() {
    return this._editing.allowResizing && this._supportAllDayResizing();
  };

  _proto._supportAllDayResizing = function _supportAllDayResizing() {
    return this.currentViewType !== 'day' || this.currentView.intervalCount > 1;
  };

  _proto._isAllDayExpanded = function _isAllDayExpanded() {
    return this.option('showAllDayPanel') && this.appointmentDataProvider.hasAllDayAppointments(this.filteredItems, this.preparedItems);
  };

  _proto._getTimezoneOffsetByOption = function _getTimezoneOffsetByOption(date) {
    return _utils.default.calculateTimezoneByValue(this.option('timeZone'), date);
  };

  _proto._filterAppointmentsByDate = function _filterAppointmentsByDate() {
    var dateRange = this._workSpace.getDateRange();

    var startDate = this.timeZoneCalculator.createDate(dateRange[0], {
      path: 'fromGrid'
    });
    var endDate = this.timeZoneCalculator.createDate(dateRange[1], {
      path: 'fromGrid'
    });
    this.appointmentDataProvider.filterByDate(startDate, endDate, this.option('remoteFiltering'), this.option('dateSerializationFormat'));
  };

  _proto._reloadDataSource = function _reloadDataSource() {
    var result = new _deferred.Deferred();

    if (this._dataSource) {
      this._dataSource.load().done(function () {
        (0, _loading.hide)();

        this._fireContentReadyAction(result);
      }.bind(this)).fail(function () {
        (0, _loading.hide)();
        result.reject();
      });

      this._dataSource.isLoading() && (0, _loading.show)({
        container: this.$element(),
        position: {
          of: this.$element()
        }
      });
    } else {
      this._fireContentReadyAction(result);
    }

    return result.promise();
  };

  _proto._fireContentReadyAction = function _fireContentReadyAction(result) {
    var contentReadyBase = _Widget.prototype._fireContentReadyAction.bind(this);

    var fireContentReady = function fireContentReady() {
      contentReadyBase();
      result === null || result === void 0 ? void 0 : result.resolve();
    };

    if (this._workSpaceRecalculation) {
      var _this$_workSpaceRecal;

      (_this$_workSpaceRecal = this._workSpaceRecalculation) === null || _this$_workSpaceRecal === void 0 ? void 0 : _this$_workSpaceRecal.done(function () {
        fireContentReady();
      });
    } else {
      fireContentReady();
    }
  };

  _proto._dimensionChanged = function _dimensionChanged() {
    if (!this._isVisible()) {
      return;
    }

    this._toggleSmallClass();

    var workspace = this.getWorkSpace();

    if (!this._isAgenda() && this.filteredItems && workspace) {
      workspace.option('allDayExpanded', this._isAllDayExpanded());

      workspace._dimensionChanged();

      var appointments = this.getLayoutManager().createAppointmentsMap(this.filteredItems);

      this._appointments.option('items', appointments);
    }

    this.hideAppointmentTooltip(); // TODO popup

    this._appointmentPopup.triggerResize();

    this._appointmentPopup.updatePopupFullScreenMode();
  };

  _proto._clean = function _clean() {
    this._cleanPopup();

    _Widget.prototype._clean.call(this);
  };

  _proto._toggleSmallClass = function _toggleSmallClass() {
    var width = (0, _position.getBoundingRect)(this.$element().get(0)).width;
    this.$element().toggleClass(WIDGET_SMALL_CLASS, width < WIDGET_SMALL_WIDTH);
  };

  _proto._toggleAdaptiveClass = function _toggleAdaptiveClass() {
    this.$element().toggleClass(WIDGET_ADAPTIVE_CLASS, this.option('adaptivityEnabled'));
  };

  _proto._visibilityChanged = function _visibilityChanged(visible) {
    visible && this._dimensionChanged();
  };

  _proto._dataSourceOptions = function _dataSourceOptions() {
    return {
      paginate: false
    };
  };

  _proto._init = function _init() {
    this._initExpressions({
      startDate: this.option('startDateExpr'),
      endDate: this.option('endDateExpr'),
      startDateTimeZone: this.option('startDateTimeZoneExpr'),
      endDateTimeZone: this.option('endDateTimeZoneExpr'),
      allDay: this.option('allDayExpr'),
      text: this.option('textExpr'),
      description: this.option('descriptionExpr'),
      recurrenceRule: this.option('recurrenceRuleExpr'),
      recurrenceException: this.option('recurrenceExceptionExpr'),
      disabled: this.option('disabledExpr')
    });

    _Widget.prototype._init.call(this);

    this._initDataSource();

    this.$element().addClass(WIDGET_CLASS);

    this._initEditing();

    this.updateInstances();

    this._initActions();

    this._compactAppointmentsHelper = new _compactAppointmentsHelper.CompactAppointmentsHelper(this);
    this._asyncTemplatesTimers = [];
    this._dataSourceLoadedCallback = (0, _callbacks.default)();
    this._subscribes = _subscribes.default;
    this.agendaResourceProcessor = new _agendaResourceProcessor.AgendaResourceProcessor(this.option('resources'));
  };

  _proto.createAppointmentDataProvider = function createAppointmentDataProvider() {
    var _this3 = this;

    this.appointmentDataProvider = new _appointmentDataProvider.AppointmentDataProvider({
      dataSource: this._dataSource,
      dataAccessors: this._dataAccessors,
      timeZoneCalculator: this.timeZoneCalculator,
      dateSerializationFormat: this.option('dateSerializationFormat'),
      resources: this.option('resources'),
      startDayHour: this._getCurrentViewOption('startDayHour'),
      endDayHour: this._getCurrentViewOption('endDayHour'),
      appointmentDuration: this._getCurrentViewOption('cellDuration'),
      showAllDayPanel: this.option('showAllDayPanel'),
      getLoadedResources: function getLoadedResources() {
        return _this3.option('loadedResources');
      },
      getIsVirtualScrolling: function getIsVirtualScrolling() {
        return _this3.isVirtualScrolling();
      },
      getSupportAllDayRow: function getSupportAllDayRow() {
        return _this3._workSpace.supportAllDayRow();
      },
      getViewType: function getViewType() {
        return _this3._workSpace.type;
      },
      getViewDirection: function getViewDirection() {
        return _this3._workSpace.viewDirection;
      },
      getDateRange: function getDateRange() {
        return _this3._workSpace.getDateRange();
      },
      getGroupCount: function getGroupCount() {
        return _this3._workSpace._getGroupCount();
      },
      getViewDataProvider: function getViewDataProvider() {
        return _this3._workSpace.viewDataProvider;
      }
    });
  };

  _proto.updateInstances = function updateInstances() {
    this._timeZoneCalculator = null;

    if (this.getWorkSpace()) {
      this.createAppointmentDataProvider();
    }
  };

  _proto._initTemplates = function _initTemplates() {
    this._initAppointmentTemplate();

    this._templateManager.addDefaultTemplates({
      appointmentTooltip: new _empty_template.EmptyTemplate(),
      dropDownAppointment: new _empty_template.EmptyTemplate()
    });

    _Widget.prototype._initTemplates.call(this);
  };

  _proto._initAppointmentTemplate = function _initAppointmentTemplate() {
    var _this4 = this;

    var expr = this._dataAccessors.expr;

    var createGetter = function createGetter(property) {
      return (0, _data.compileGetter)("appointmentData.".concat(property));
    };

    var getDate = function getDate(getter) {
      return function (data) {
        var value = getter(data);

        if (value instanceof Date) {
          return value.valueOf();
        }

        return value;
      };
    };

    this._templateManager.addDefaultTemplates(_defineProperty({}, 'item', new _bindable_template.BindableTemplate(function ($container, data, model) {
      return _this4.getAppointmentsInstance()._renderAppointmentTemplate($container, data, model);
    }, ['html', 'text', 'startDate', 'endDate', 'allDay', 'description', 'recurrenceRule', 'recurrenceException', 'startDateTimeZone', 'endDateTimeZone'], this.option('integrationOptions.watchMethod'), {
      'text': createGetter(expr.textExpr),
      'startDate': getDate(createGetter(expr.startDateExpr)),
      'endDate': getDate(createGetter(expr.endDateExpr)),
      'startDateTimeZone': createGetter(expr.startDateTimeZoneExpr),
      'endDateTimeZone': createGetter(expr.endDateTimeZoneExpr),
      'allDay': createGetter(expr.allDayExpr),
      'recurrenceRule': createGetter(expr.recurrenceRuleExpr)
    })));
  };

  _proto._renderContent = function _renderContent() {
    this._renderContentImpl();
  };

  _proto._updatePreparedItems = function _updatePreparedItems(items) {
    this.preparedItems = (0, _data2.getPreparedDataItems)(items, this._dataAccessors, this._getCurrentViewOption('cellDuration'), this.timeZoneCalculator);
  };

  _proto._dataSourceChangedHandler = function _dataSourceChangedHandler(result) {
    if (this._readyToRenderAppointments) {
      this._workSpaceRecalculation.done(function () {
        this._updatePreparedItems(result);

        this._renderAppointments();

        this.getWorkSpace().onDataSourceChanged(this.filteredItems);
      }.bind(this));
    }
  };

  _proto.isVirtualScrolling = function isVirtualScrolling() {
    var _currentViewOptions$s;

    var workspace = this.getWorkSpace();

    if (workspace) {
      return workspace.isVirtualScrolling();
    }

    var currentViewOptions = this._getCurrentViewOptions();

    var scrolling = this.option('scrolling');
    return (scrolling === null || scrolling === void 0 ? void 0 : scrolling.mode) === 'virtual' || (currentViewOptions === null || currentViewOptions === void 0 ? void 0 : (_currentViewOptions$s = currentViewOptions.scrolling) === null || _currentViewOptions$s === void 0 ? void 0 : _currentViewOptions$s.mode) === 'virtual';
  };

  _proto._filterAppointments = function _filterAppointments() {
    this.filteredItems = this.appointmentDataProvider.filter(this.preparedItems);
  };

  _proto._renderAppointments = function _renderAppointments() {
    var workspace = this.getWorkSpace();

    this._filterAppointments();

    workspace.option('allDayExpanded', this._isAllDayExpanded());
    var viewModel = [];

    if (this._isVisible()) {
      viewModel = this._getAppointmentsToRepaint();
    }

    if (this.option('isRenovatedAppointments')) {
      (0, _render2.renderAppointments)({
        instance: this,
        $dateTable: this.getWorkSpace()._getDateTable(),
        viewModel: viewModel
      });
    } else {
      this._appointments.option('items', viewModel);
    }

    this.appointmentDataProvider.cleanState();
  };

  _proto._getAppointmentsToRepaint = function _getAppointmentsToRepaint() {
    var layoutManager = this.getLayoutManager();
    var appointmentsMap = layoutManager.createAppointmentsMap(this.filteredItems);

    if (this.option('isRenovatedAppointments')) {
      var appointmentTemplate = this.option('appointmentTemplate') !== DEFAULT_APPOINTMENT_TEMPLATE_NAME ? this.option('appointmentTemplate') : undefined;
      return {
        appointments: appointmentsMap,
        appointmentTemplate: appointmentTemplate
      };
    }

    return layoutManager.getRepaintedAppointments(appointmentsMap, this.getAppointmentsInstance().option('items'));
  };

  _proto._initExpressions = function _initExpressions(fields) {
    this._dataAccessors = _utils2.utils.dataAccessors.create(fields, this._dataAccessors, (0, _config.default)().forceIsoDateParsing, this.option('dateSerializationFormat'));
    this._dataAccessors.resources = (0, _utils3.createExpressions)(this.option('resources'));
  };

  _proto._updateExpression = function _updateExpression(name, value) {
    var exprObj = {};
    exprObj[name.replace('Expr', '')] = value;

    this._initExpressions(exprObj);
  };

  _proto.getResourceDataAccessors = function getResourceDataAccessors() {
    return this._dataAccessors.resources;
  };

  _proto._initEditing = function _initEditing() {
    var editing = this.option('editing');
    this._editing = {
      allowAdding: !!editing,
      allowUpdating: !!editing,
      allowDeleting: !!editing,
      allowResizing: !!editing,
      allowDragging: !!editing
    };

    if ((0, _type.isObject)(editing)) {
      this._editing = (0, _extend.extend)(this._editing, editing);
    }

    this._editing.allowDragging = this._editing.allowDragging && this._editing.allowUpdating;
    this._editing.allowResizing = this._editing.allowResizing && this._editing.allowUpdating;
    this.$element().toggleClass(WIDGET_READONLY_CLASS, this._isReadOnly());
  };

  _proto._isReadOnly = function _isReadOnly() {
    var result = true;
    var editing = this._editing;

    for (var prop in editing) {
      if (Object.prototype.hasOwnProperty.call(editing, prop)) {
        result = result && !editing[prop];
      }
    }

    return result;
  };

  _proto._dispose = function _dispose() {
    var _this$_recurrenceDial;

    this._appointmentTooltip && this._appointmentTooltip.dispose();
    (_this$_recurrenceDial = this._recurrenceDialog) === null || _this$_recurrenceDial === void 0 ? void 0 : _this$_recurrenceDial.hide(RECURRENCE_EDITING_MODE.CANCEL);
    this.hideAppointmentPopup();
    this.hideAppointmentTooltip();

    this._asyncTemplatesTimers.forEach(clearTimeout);

    this._asyncTemplatesTimers = [];

    _Widget.prototype._dispose.call(this);
  };

  _proto._initActions = function _initActions() {
    this._actions = {
      'onAppointmentAdding': this._createActionByOption(StoreEventNames.ADDING),
      'onAppointmentAdded': this._createActionByOption(StoreEventNames.ADDED),
      'onAppointmentUpdating': this._createActionByOption(StoreEventNames.UPDATING),
      'onAppointmentUpdated': this._createActionByOption(StoreEventNames.UPDATED),
      'onAppointmentDeleting': this._createActionByOption(StoreEventNames.DELETING),
      'onAppointmentDeleted': this._createActionByOption(StoreEventNames.DELETED),
      'onAppointmentFormOpening': this._createActionByOption('onAppointmentFormOpening')
    };
  };

  _proto._getAppointmentRenderedAction = function _getAppointmentRenderedAction() {
    return this._createActionByOption('onAppointmentRendered', {
      excludeValidators: ['disabled', 'readOnly']
    });
  };

  _proto._renderFocusTarget = function _renderFocusTarget() {
    return (0, _common.noop)();
  };

  _proto._initMarkup = function _initMarkup() {
    var _this5 = this;

    _Widget.prototype._initMarkup.call(this);

    this._validateDayHours();

    this._validateCellDuration();

    this._renderMainContainer();

    this._renderHeader();

    this._layoutManager = new _appointments.default(this);
    this._appointments = this._createComponent('<div>', _appointmentCollection.default, this._appointmentsConfig());

    this._appointments.option('itemTemplate', this._getAppointmentTemplate('appointmentTemplate'));

    this._appointmentTooltip = new (this.option('adaptivityEnabled') ? _mobileTooltipStrategy.MobileTooltipStrategy : _desktopTooltipStrategy.DesktopTooltipStrategy)(this._getAppointmentTooltipOptions());

    this._createAppointmentPopupForm();

    if (this._isDataSourceLoaded() || this._isDataSourceLoading()) {
      this._initMarkupCore(this.option('loadedResources'));

      this._dataSourceChangedHandler(this._dataSource.items());

      this._fireContentReadyAction();
    } else {
      var groups = this._getCurrentViewOption('groups');

      (0, _utils3.loadResources)(groups, this.option('resources'), this.option('resourceLoaderMap')).done(function (resources) {
        _this5.option('loadedResources', resources);

        _this5._initMarkupCore(resources);

        _this5._reloadDataSource();
      });
    }
  };

  _proto._createAppointmentPopupForm = function _createAppointmentPopupForm() {
    var _this$_appointmentPop;

    if (this._appointmentForm) {
      var _this$_appointmentFor;

      (_this$_appointmentFor = this._appointmentForm.form) === null || _this$_appointmentFor === void 0 ? void 0 : _this$_appointmentFor.dispose();
    }

    this._appointmentForm = this.createAppointmentForm();
    (_this$_appointmentPop = this._appointmentPopup) === null || _this$_appointmentPop === void 0 ? void 0 : _this$_appointmentPop.dispose();
    this._appointmentPopup = this.createAppointmentPopup(this._appointmentForm);
  };

  _proto._renderMainContainer = function _renderMainContainer() {
    this._mainContainer = (0, _renderer.default)('<div>').addClass('dx-scheduler-container');
    this.$element().append(this._mainContainer);
  };

  _proto.createAppointmentForm = function createAppointmentForm() {
    var _this6 = this;

    var scheduler = {
      createResourceEditorModel: function createResourceEditorModel() {
        return (0, _utils3.createResourceEditorModel)(_this6.option('resources'), _this6.option('loadedResources'));
      },
      getDataAccessors: function getDataAccessors() {
        return _this6._dataAccessors;
      },
      createComponent: function createComponent(element, component, options) {
        return _this6._createComponent(element, component, options);
      },
      getEditingConfig: function getEditingConfig() {
        return _this6._editing;
      },
      getFirstDayOfWeek: function getFirstDayOfWeek() {
        return _this6.option('firstDayOfWeek');
      },
      getStartDayHour: function getStartDayHour() {
        return _this6.option('startDayHour');
      },
      getCalculatedEndDate: function getCalculatedEndDate(startDateWithStartHour) {
        return _this6._workSpace.calculateEndDate(startDateWithStartHour);
      }
    };
    return new _form.AppointmentForm(scheduler);
  };

  _proto.createAppointmentPopup = function createAppointmentPopup(form) {
    var _this7 = this;

    var scheduler = {
      getElement: function getElement() {
        return _this7.$element();
      },
      createComponent: function createComponent(element, component, options) {
        return _this7._createComponent(element, component, options);
      },
      focus: function focus() {
        return _this7.focus();
      },
      getResources: function getResources() {
        return _this7.option('resources');
      },
      getEditingConfig: function getEditingConfig() {
        return _this7._editing;
      },
      getTimeZoneCalculator: function getTimeZoneCalculator() {
        return _this7.timeZoneCalculator;
      },
      getDataAccessors: function getDataAccessors() {
        return _this7._dataAccessors;
      },
      getAppointmentFormOpening: function getAppointmentFormOpening() {
        return _this7._actions['onAppointmentFormOpening'];
      },
      processActionResult: function processActionResult(arg, canceled) {
        return _this7._processActionResult(arg, canceled);
      },
      addAppointment: function addAppointment(appointment) {
        return _this7.addAppointment(appointment);
      },
      updateAppointment: function updateAppointment(sourceAppointment, updatedAppointment) {
        return _this7.updateAppointment(sourceAppointment, updatedAppointment);
      },
      updateScrollPosition: function updateScrollPosition(startDate, resourceItem, inAllDayRow) {
        _this7._workSpace.updateScrollPosition(startDate, resourceItem, inAllDayRow);
      }
    };
    return new _popup.AppointmentPopup(scheduler, form);
  };

  _proto._getAppointmentTooltipOptions = function _getAppointmentTooltipOptions() {
    var _this8 = this;

    var that = this;
    return {
      createComponent: that._createComponent.bind(that),
      container: that.$element(),
      getScrollableContainer: that.getWorkSpaceScrollableContainer.bind(that),
      addDefaultTemplates: that._templateManager.addDefaultTemplates.bind(that._templateManager),
      getAppointmentTemplate: that._getAppointmentTemplate.bind(that),
      showAppointmentPopup: that.showAppointmentPopup.bind(that),
      checkAndDeleteAppointment: that.checkAndDeleteAppointment.bind(that),
      isAppointmentInAllDayPanel: that.isAppointmentInAllDayPanel.bind(that),
      createFormattedDateText: function createFormattedDateText(appointment, targetedAppointment, format) {
        return _this8.fire('getTextAndFormatDate', appointment, targetedAppointment, format);
      },
      getAppointmentDisabled: function getAppointmentDisabled(appointment) {
        return (0, _appointmentAdapter.createAppointmentAdapter)(appointment, _this8._dataAccessors, _this8.timeZoneCalculator).disabled;
      }
    };
  };

  _proto.checkAndDeleteAppointment = function checkAndDeleteAppointment(appointment, targetedAppointment) {
    var _this9 = this;

    var targetedAdapter = (0, _appointmentAdapter.createAppointmentAdapter)(targetedAppointment, this._dataAccessors, this.timeZoneCalculator);

    this._checkRecurringAppointment(appointment, targetedAppointment, targetedAdapter.startDate, function () {
      _this9.deleteAppointment(appointment);
    }, true);
  };

  _proto._getExtraAppointmentTooltipOptions = function _getExtraAppointmentTooltipOptions() {
    return {
      rtlEnabled: this.option('rtlEnabled'),
      focusStateEnabled: this.option('focusStateEnabled'),
      editing: this.option('editing'),
      offset: this.option('_appointmentTooltipOffset')
    };
  };

  _proto.isAppointmentInAllDayPanel = function isAppointmentInAllDayPanel(appointmentData) {
    var workSpace = this._workSpace;
    var itTakesAllDay = this.appointmentTakesAllDay(appointmentData);
    return itTakesAllDay && workSpace.supportAllDayRow() && workSpace.option('showAllDayPanel');
  };

  _proto._initMarkupCore = function _initMarkupCore(resources) {
    var _this10 = this;

    this._readyToRenderAppointments = (0, _window.hasWindow)();
    this._workSpace && this._cleanWorkspace();

    this._renderWorkSpace(resources);

    this._appointments.option({
      fixedContainer: this._workSpace.getFixedContainer(),
      allDayContainer: this._workSpace.getAllDayContainer()
    });

    this._waitAsyncTemplate(function () {
      var _this10$_workSpaceRec;

      return (_this10$_workSpaceRec = _this10._workSpaceRecalculation) === null || _this10$_workSpaceRec === void 0 ? void 0 : _this10$_workSpaceRec.resolve();
    });

    this.createAppointmentDataProvider();

    this._filterAppointmentsByDate();
  };

  _proto._isDataSourceLoaded = function _isDataSourceLoaded() {
    // TODO
    return this._dataSource && this._dataSource.isLoaded();
  };

  _proto._render = function _render() {
    var _this$getWorkSpace;

    // NOTE: remove small class applying after adaptivity implementation
    this._toggleSmallClass();

    this._toggleAdaptiveClass();

    (_this$getWorkSpace = this.getWorkSpace()) === null || _this$getWorkSpace === void 0 ? void 0 : _this$getWorkSpace.updateHeaderEmptyCellWidth();

    _Widget.prototype._render.call(this);
  };

  _proto._renderHeader = function _renderHeader() {
    if (this.option('toolbar').length !== 0) {
      var $header = (0, _renderer.default)('<div>').appendTo(this._mainContainer);
      this._header = this._createComponent($header, _header.SchedulerHeader, this._headerConfig());
    }
  };

  _proto._headerConfig = function _headerConfig() {
    var _this11 = this;

    var currentViewOptions = this._getCurrentViewOptions();

    var countConfig = this._getViewCountConfig();

    var result = (0, _extend.extend)({
      firstDayOfWeek: this.getFirstDayOfWeek(),
      currentView: this.currentView,
      isAdaptive: this.option('adaptivityEnabled'),
      tabIndex: this.option('tabIndex'),
      focusStateEnabled: this.option('focusStateEnabled'),
      rtlEnabled: this.option('rtlEnabled'),
      useDropDownViewSwitcher: this.option('useDropDownViewSwitcher'),
      customizeDateNavigatorText: this.option('customizeDateNavigatorText'),
      agendaDuration: this.option('agendaDuration') || DEFAULT_AGENDA_DURATION
    }, currentViewOptions);
    result.intervalCount = countConfig.intervalCount;
    result.views = this.option('views');
    result.min = new Date(this._dateOption('min'));
    result.max = new Date(this._dateOption('max'));
    result.currentDate = _date.default.trimTime(new Date(this._dateOption('currentDate')));

    result.onCurrentViewChange = function (name) {
      return _this11.option('currentView', name);
    };

    result.onCurrentDateChange = function (date) {
      return _this11.option('currentDate', date);
    };

    result.items = this.option('toolbar');

    result.todayDate = function () {
      var result = _this11.timeZoneCalculator.createDate(new Date(), {
        path: 'toGrid'
      });

      return result;
    };

    return result;
  };

  _proto._appointmentsConfig = function _appointmentsConfig() {
    var _this12 = this;

    var config = {
      getResources: function getResources() {
        return _this12.option('resources');
      },
      getResourceDataAccessors: this.getResourceDataAccessors.bind(this),
      getAgendaResourceProcessor: function getAgendaResourceProcessor() {
        return _this12.agendaResourceProcessor;
      },
      getAppointmentColor: this.createGetAppointmentColor(),
      getAppointmentDataProvider: function getAppointmentDataProvider() {
        return _this12.appointmentDataProvider;
      },
      dataAccessors: this._dataAccessors,
      observer: this,
      onItemRendered: this._getAppointmentRenderedAction(),
      onItemClick: this._createActionByOption('onAppointmentClick'),
      onItemContextMenu: this._createActionByOption('onAppointmentContextMenu'),
      onAppointmentDblClick: this._createActionByOption('onAppointmentDblClick'),
      tabIndex: this.option('tabIndex'),
      focusStateEnabled: this.option('focusStateEnabled'),
      allowDrag: this._allowDragging(),
      allowDelete: this._editing.allowUpdating && this._editing.allowDeleting,
      allowResize: this._allowResizing(),
      allowAllDayResize: this._allowAllDayResizing(),
      rtlEnabled: this.option('rtlEnabled'),
      currentView: this.currentView,
      groups: this._getCurrentViewOption('groups'),
      isRenovatedAppointments: this.option('isRenovatedAppointments'),
      timeZoneCalculator: this.timeZoneCalculator,
      getResizableStep: function getResizableStep() {
        return _this12._workSpace ? _this12._workSpace.positionHelper.getResizableStep() : 0;
      },
      getDOMElementsMetaData: function getDOMElementsMetaData() {
        var _this12$_workSpace;

        return (_this12$_workSpace = _this12._workSpace) === null || _this12$_workSpace === void 0 ? void 0 : _this12$_workSpace.getDOMElementsMetaData();
      },
      getViewDataProvider: function getViewDataProvider() {
        var _this12$_workSpace2;

        return (_this12$_workSpace2 = _this12._workSpace) === null || _this12$_workSpace2 === void 0 ? void 0 : _this12$_workSpace2.viewDataProvider;
      },
      isVerticalViewDirection: function isVerticalViewDirection() {
        return _this12.getRenderingStrategyInstance().getDirection() === 'vertical';
      },
      isVerticalGroupedWorkSpace: function isVerticalGroupedWorkSpace() {
        return _this12._workSpace._isVerticalGroupedWorkSpace();
      },
      isDateAndTimeView: function isDateAndTimeView() {
        return (0, _base.isDateAndTimeView)(_this12._workSpace.type);
      },
      onContentReady: function onContentReady() {
        var _this12$_workSpace3;

        (_this12$_workSpace3 = _this12._workSpace) === null || _this12$_workSpace3 === void 0 ? void 0 : _this12$_workSpace3.option('allDayExpanded', _this12._isAllDayExpanded());
      }
    };
    return config;
  };

  _proto.getCollectorOffset = function getCollectorOffset() {
    if (this._workSpace.needApplyCollectorOffset() && !this.option('adaptivityEnabled')) {
      return this.option('_collectorOffset');
    } else {
      return 0;
    }
  };

  _proto.getAppointmentDurationInMinutes = function getAppointmentDurationInMinutes() {
    return this._getCurrentViewOption('cellDuration');
  };

  _proto._validateCellDuration = function _validateCellDuration() {
    var endDayHour = this._getCurrentViewOption('endDayHour');

    var startDayHour = this._getCurrentViewOption('startDayHour');

    var cellDuration = this._getCurrentViewOption('cellDuration');

    if ((endDayHour - startDayHour) * MINUTES_IN_HOUR % cellDuration !== 0) {
      _ui.default.log('W1015');
    }
  };

  _proto._getCurrentViewType = function _getCurrentViewType() {
    // TODO get rid of mapping
    return this.currentViewType;
  };

  _proto._renderWorkSpace = function _renderWorkSpace(groups) {
    var _this$_header6;

    this._readyToRenderAppointments && this._toggleSmallClass();
    var $workSpace = (0, _renderer.default)('<div>').appendTo(this._mainContainer);

    var countConfig = this._getViewCountConfig();

    var workSpaceComponent = VIEWS_CONFIG[this._getCurrentViewType()].workSpace;

    var workSpaceConfig = this._workSpaceConfig(groups, countConfig);

    this._workSpace = this._createComponent($workSpace, workSpaceComponent, workSpaceConfig);
    this._allowDragging() && this._workSpace.initDragBehavior(this, this._all);

    this._workSpace._attachTablesEvents();

    this._workSpace.getWorkArea().append(this._appointments.$element());

    this._recalculateWorkspace();

    countConfig.startDate && ((_this$_header6 = this._header) === null || _this$_header6 === void 0 ? void 0 : _this$_header6.option('currentDate', this._workSpace._getHeaderDate()));

    this._appointments.option('_collectorOffset', this.getCollectorOffset());
  };

  _proto._getViewCountConfig = function _getViewCountConfig() {
    var currentView = this.option('currentView');

    var view = this._getViewByName(currentView);

    var viewCount = view && view.intervalCount || 1;
    var startDate = view && view.startDate || null;
    return {
      intervalCount: viewCount,
      startDate: startDate
    };
  };

  _proto._getViewByName = function _getViewByName(name) {
    var views = this.option('views');

    for (var i = 0; i < views.length; i++) {
      if (views[i].name === name || views[i].type === name || views[i] === name) return views[i];
    }
  };

  _proto._recalculateWorkspace = function _recalculateWorkspace() {
    var _this13 = this;

    this._workSpaceRecalculation = new _deferred.Deferred();

    this._waitAsyncTemplate(function () {
      (0, _visibility_change.triggerResizeEvent)(_this13._workSpace.$element());

      _this13._workSpace._refreshDateTimeIndication();
    });
  };

  _proto._workSpaceConfig = function _workSpaceConfig(groups, countConfig) {
    var _currentViewOptions$s2,
        _this14 = this;

    var currentViewOptions = this._getCurrentViewOptions();

    var scrolling = this.option('scrolling');
    var isVirtualScrolling = scrolling.mode === 'virtual' || ((_currentViewOptions$s2 = currentViewOptions.scrolling) === null || _currentViewOptions$s2 === void 0 ? void 0 : _currentViewOptions$s2.mode) === 'virtual';
    var horizontalVirtualScrollingAllowed = isVirtualScrolling && (!(0, _type.isDefined)(scrolling.orientation) || ['horizontal', 'both'].filter(function (item) {
      var _currentViewOptions$s3;

      return scrolling.orientation === item || ((_currentViewOptions$s3 = currentViewOptions.scrolling) === null || _currentViewOptions$s3 === void 0 ? void 0 : _currentViewOptions$s3.orientation) === item;
    }).length > 0);
    var crossScrollingEnabled = this.option('crossScrollingEnabled') || horizontalVirtualScrollingAllowed;
    var result = (0, _extend.extend)({
      resources: this.option('resources'),
      loadedResources: this.option('loadedResources'),
      getFilteredItems: function getFilteredItems() {
        return _this14.filteredItems;
      },
      getResourceDataAccessors: this.getResourceDataAccessors.bind(this),
      noDataText: this.option('noDataText'),
      firstDayOfWeek: this.option('firstDayOfWeek'),
      startDayHour: this.option('startDayHour'),
      endDayHour: this.option('endDayHour'),
      tabIndex: this.option('tabIndex'),
      accessKey: this.option('accessKey'),
      focusStateEnabled: this.option('focusStateEnabled'),
      cellDuration: this.option('cellDuration'),
      showAllDayPanel: this.option('showAllDayPanel'),
      showCurrentTimeIndicator: this.option('showCurrentTimeIndicator'),
      indicatorTime: this.option('indicatorTime'),
      indicatorUpdateInterval: this.option('indicatorUpdateInterval'),
      shadeUntilCurrentTime: this.option('shadeUntilCurrentTime'),
      allDayExpanded: this._appointments.option('items'),
      crossScrollingEnabled: crossScrollingEnabled,
      dataCellTemplate: this.option('dataCellTemplate'),
      timeCellTemplate: this.option('timeCellTemplate'),
      resourceCellTemplate: this.option('resourceCellTemplate'),
      dateCellTemplate: this.option('dateCellTemplate'),
      allowMultipleCellSelection: this.option('allowMultipleCellSelection'),
      selectedCellData: this.option('selectedCellData'),
      onSelectionChanged: function onSelectionChanged(args) {
        _this14.option('selectedCellData', args.selectedCellData);
      },
      groupByDate: this._getCurrentViewOption('groupByDate'),
      scrolling: scrolling,
      draggingMode: this.option('_draggingMode'),
      timeZoneCalculator: this.timeZoneCalculator,
      schedulerHeight: this.option('height'),
      schedulerWidth: this.option('width'),
      onSelectedCellsClick: this.showAddAppointmentPopup.bind(this),
      onVirtualScrollingUpdated: this._renderAppointments.bind(this),
      getHeaderHeight: function getHeaderHeight() {
        return _utils2.utils.DOM.getHeaderHeight(_this14._header);
      },
      onScrollEnd: function onScrollEnd() {
        return _this14._appointments.updateResizableArea();
      },
      // TODO: SSR does not work correctly with renovated render
      renovateRender: this._isRenovatedRender(isVirtualScrolling),
      isRenovatedAppointments: this.option('isRenovatedAppointments')
    }, currentViewOptions);
    result.observer = this;
    result.intervalCount = countConfig.intervalCount;
    result.startDate = countConfig.startDate;
    result.groups = groups;
    result.onCellClick = this._createActionByOption('onCellClick');
    result.onCellContextMenu = this._createActionByOption('onCellContextMenu');
    result.currentDate = _date.default.trimTime(new Date(this._dateOption('currentDate')));
    result.hoursInterval = result.cellDuration / 60;
    result.allDayExpanded = false;
    result.dataCellTemplate = result.dataCellTemplate ? this._getTemplate(result.dataCellTemplate) : null;
    result.timeCellTemplate = result.timeCellTemplate ? this._getTemplate(result.timeCellTemplate) : null;
    result.resourceCellTemplate = result.resourceCellTemplate ? this._getTemplate(result.resourceCellTemplate) : null;
    result.dateCellTemplate = result.dateCellTemplate ? this._getTemplate(result.dateCellTemplate) : null;

    result.getAppointmentDataProvider = function () {
      return _this14.appointmentDataProvider;
    };

    return result;
  };

  _proto._isRenovatedRender = function _isRenovatedRender(isVirtualScrolling) {
    return this.option('renovateRender') && (0, _window.hasWindow)() || isVirtualScrolling;
  };

  _proto._waitAsyncTemplate = function _waitAsyncTemplate(callback) {
    if (this._options.silent('templatesRenderAsynchronously')) {
      var timer = setTimeout(function () {
        callback();
        clearTimeout(timer);
      });

      this._asyncTemplatesTimers.push(timer);
    } else {
      callback();
    }
  };

  _proto._getCurrentViewOptions = function _getCurrentViewOptions() {
    return this.currentView;
  };

  _proto._getCurrentViewOption = function _getCurrentViewOption(optionName) {
    if (this.currentView && this.currentView[optionName] !== undefined) {
      return this.currentView[optionName];
    }

    return this.option(optionName);
  };

  _proto._getAppointmentTemplate = function _getAppointmentTemplate(optionName) {
    var currentViewOptions = this._getCurrentViewOptions();

    if (currentViewOptions && currentViewOptions[optionName]) {
      return this._getTemplate(currentViewOptions[optionName]);
    }

    return this._getTemplateByOption(optionName);
  };

  _proto._updateOption = function _updateOption(viewName, optionName, value) {
    var currentViewOptions = this._getCurrentViewOptions();

    if (!currentViewOptions || !(0, _type.isDefined)(currentViewOptions[optionName])) {
      this['_' + viewName].option(optionName, value);
    }
  };

  _proto._refreshWorkSpace = function _refreshWorkSpace(groups) {
    var _this15 = this;

    this._cleanWorkspace();

    delete this._workSpace;

    this._renderWorkSpace(groups);

    if (this._readyToRenderAppointments) {
      this._appointments.option({
        fixedContainer: this._workSpace.getFixedContainer(),
        allDayContainer: this._workSpace.getAllDayContainer()
      });

      this._waitAsyncTemplate(function () {
        return _this15._workSpaceRecalculation.resolve();
      });
    }
  };

  _proto._cleanWorkspace = function _cleanWorkspace() {
    this._appointments.$element().detach();

    this._workSpace._dispose();

    this._workSpace.$element().remove();

    this.option('selectedCellData', []);
  };

  _proto.getWorkSpaceScrollable = function getWorkSpaceScrollable() {
    return this._workSpace.getScrollable();
  };

  _proto.getWorkSpaceScrollableContainer = function getWorkSpaceScrollableContainer() {
    return this._workSpace.getScrollableContainer();
  };

  _proto.getWorkSpace = function getWorkSpace() {
    return this._workSpace;
  };

  _proto.getHeader = function getHeader() {
    return this._header;
  };

  _proto._cleanPopup = function _cleanPopup() {
    var _this$_appointmentPop2;

    (_this$_appointmentPop2 = this._appointmentPopup) === null || _this$_appointmentPop2 === void 0 ? void 0 : _this$_appointmentPop2.dispose();
  };

  _proto._checkRecurringAppointment = function _checkRecurringAppointment(targetAppointment, singleAppointment, exceptionDate, callback, isDeleted, isPopupEditing, dragEvent) {
    var _this16 = this;

    var recurrenceRule = _expressionUtils.ExpressionUtils.getField(this._dataAccessors, 'recurrenceRule', targetAppointment);

    if (!(0, _recurrence.getRecurrenceProcessor)().evalRecurrenceRule(recurrenceRule).isValid || !this._editing.allowUpdating) {
      callback();
      return;
    }

    var editMode = this.option('recurrenceEditMode');

    switch (editMode) {
      case 'series':
        callback();
        break;

      case 'occurrence':
        this._excludeAppointmentFromSeries(targetAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent);

        break;

      default:
        if (dragEvent) {
          dragEvent.cancel = new _deferred.Deferred();
        }

        this._showRecurrenceChangeConfirm(isDeleted).done(function (editingMode) {
          editingMode === RECURRENCE_EDITING_MODE.SERIES && callback();
          editingMode === RECURRENCE_EDITING_MODE.OCCURENCE && _this16._excludeAppointmentFromSeries(targetAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent);
        }).fail(function () {
          return _this16._appointments.moveAppointmentBack(dragEvent);
        });

    }
  };

  _proto._excludeAppointmentFromSeries = function _excludeAppointmentFromSeries(rawAppointment, newRawAppointment, exceptionDate, isDeleted, isPopupEditing, dragEvent) {
    var _this17 = this;

    var appointment = (0, _appointmentAdapter.createAppointmentAdapter)(_extends({}, rawAppointment), this._dataAccessors, this.timeZoneCalculator);
    appointment.recurrenceException = this._createRecurrenceException(appointment, exceptionDate);

    var singleRawAppointment = _extends({}, newRawAppointment);

    delete singleRawAppointment[this._dataAccessors.expr.recurrenceExceptionExpr];
    delete singleRawAppointment[this._dataAccessors.expr.recurrenceRuleExpr];
    var keyPropertyName = this.appointmentDataProvider.keyName;
    delete singleRawAppointment[keyPropertyName];
    var canCreateNewAppointment = !isDeleted && !isPopupEditing;

    if (canCreateNewAppointment) {
      this.addAppointment(singleRawAppointment);
    }

    if (isPopupEditing) {
      this._appointmentPopup.show(singleRawAppointment, {
        isToolbarVisible: true,
        action: _popup.ACTION_TO_APPOINTMENT.EXCLUDE_FROM_SERIES,
        excludeInfo: {
          sourceAppointment: rawAppointment,
          updatedAppointment: appointment.source()
        }
      });

      this._editAppointmentData = rawAppointment;
    } else {
      this._updateAppointment(rawAppointment, appointment.source(), function () {
        _this17._appointments.moveAppointmentBack(dragEvent);
      }, dragEvent);
    }
  };

  _proto._createRecurrenceException = function _createRecurrenceException(appointment, exceptionDate) {
    var result = [];

    if (appointment.recurrenceException) {
      result.push(appointment.recurrenceException);
    }

    result.push(this._getSerializedDate(exceptionDate, appointment.startDate, appointment.allDay));
    return result.join();
  };

  _proto._getSerializedDate = function _getSerializedDate(date, startDate, isAllDay) {
    isAllDay && date.setHours(startDate.getHours(), startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds());
    return _date_serialization.default.serializeDate(date, UTC_FULL_DATE_FORMAT);
  };

  _proto._showRecurrenceChangeConfirm = function _showRecurrenceChangeConfirm(isDeleted) {
    var message = _message.default.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteMessage' : 'dxScheduler-confirmRecurrenceEditMessage');

    var seriesText = _message.default.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteSeries' : 'dxScheduler-confirmRecurrenceEditSeries');

    var occurrenceText = _message.default.format(isDeleted ? 'dxScheduler-confirmRecurrenceDeleteOccurrence' : 'dxScheduler-confirmRecurrenceEditOccurrence');

    this._recurrenceDialog = (0, _dialog.custom)({
      messageHtml: message,
      showCloseButton: true,
      showTitle: true,
      buttons: [{
        text: seriesText,
        onClick: function onClick() {
          return RECURRENCE_EDITING_MODE.SERIES;
        }
      }, {
        text: occurrenceText,
        onClick: function onClick() {
          return RECURRENCE_EDITING_MODE.OCCURENCE;
        }
      }],
      popupOptions: {
        onHidden: function onHidden(e) {
          e.component.$element().remove();
        },
        copyRootClassesToWrapper: true,
        _ignoreCopyRootClassesToWrapperDeprecation: true
      }
    });
    return this._recurrenceDialog.show();
  };

  _proto._getUpdatedData = function _getUpdatedData(rawAppointment) {
    var _this18 = this;

    var getConvertedFromGrid = function getConvertedFromGrid(date) {
      return date ? _this18.timeZoneCalculator.createDate(date, {
        path: 'fromGrid'
      }) : undefined;
    };

    var isValidDate = function isValidDate(date) {
      return !isNaN(new Date(date).getTime());
    };

    var targetCell = this.getTargetCellData();
    var appointment = (0, _appointmentAdapter.createAppointmentAdapter)(rawAppointment, this._dataAccessors, this.timeZoneCalculator);
    var cellStartDate = getConvertedFromGrid(targetCell.startDate);
    var cellEndDate = getConvertedFromGrid(targetCell.endDate);
    var appointmentStartDate = new Date(appointment.startDate);
    var appointmentEndDate = new Date(appointment.endDate);
    var resultedStartDate = cellStartDate || appointmentStartDate;

    if (!isValidDate(appointmentStartDate)) {
      appointmentStartDate = resultedStartDate;
    }

    if (!isValidDate(appointmentEndDate)) {
      appointmentEndDate = cellEndDate;
    }

    var duration = appointmentEndDate.getTime() - appointmentStartDate.getTime();
    var isKeepAppointmentHours = this._workSpace.keepOriginalHours() && isValidDate(appointment.startDate) && isValidDate(cellStartDate);

    if (isKeepAppointmentHours) {
      var trimTime = _date.default.trimTime;
      var startDate = this.timeZoneCalculator.createDate(appointment.startDate, {
        path: 'toGrid'
      });
      var timeInMs = startDate.getTime() - trimTime(startDate).getTime();
      resultedStartDate = new Date(trimTime(targetCell.startDate).getTime() + timeInMs);
      resultedStartDate = this.timeZoneCalculator.createDate(resultedStartDate, {
        path: 'fromGrid'
      });
    }

    var result = (0, _appointmentAdapter.createAppointmentAdapter)({}, this._dataAccessors, this.timeZoneCalculator);

    if (targetCell.allDay !== undefined) {
      result.allDay = targetCell.allDay;
    }

    result.startDate = resultedStartDate;
    var resultedEndDate = new Date(resultedStartDate.getTime() + duration);

    if (this.appointmentTakesAllDay(rawAppointment) && !result.allDay && this._workSpace.supportAllDayRow()) {
      resultedEndDate = this._workSpace.calculateEndDate(resultedStartDate);
    }

    if (appointment.allDay && !this._workSpace.supportAllDayRow() && !this._workSpace.keepOriginalHours()) {
      var dateCopy = new Date(resultedStartDate);
      dateCopy.setHours(0);
      resultedEndDate = new Date(dateCopy.getTime() + duration);

      if (resultedEndDate.getHours() !== 0) {
        resultedEndDate.setHours(this._getCurrentViewOption('endDayHour'));
      }
    }

    var timeZoneOffset = _utils.default.getTimezoneOffsetChangeInMs(appointmentStartDate, appointmentEndDate, resultedStartDate, resultedEndDate);

    result.endDate = new Date(resultedEndDate.getTime() - timeZoneOffset);
    var rawResult = result.source();
    (0, _utils3.setResourceToAppointment)(this.option('resources'), this.getResourceDataAccessors(), rawResult, targetCell.groups);
    return rawResult;
  };

  _proto.getTargetedAppointment = function getTargetedAppointment(appointment, element) {
    var settings = _utils2.utils.dataAccessors.getAppointmentSettings(element);

    var info = _utils2.utils.dataAccessors.getAppointmentInfo(element);

    var appointmentIndex = (0, _renderer.default)(element).data(this._appointments._itemIndexKey());
    var adapter = (0, _appointmentAdapter.createAppointmentAdapter)(appointment, this._dataAccessors, this.timeZoneCalculator);
    var targetedAdapter = adapter.clone();

    if (this._isAgenda() && adapter.isRecurrent) {
      var agendaSettings = settings.agendaSettings;
      targetedAdapter.startDate = agendaSettings.startDate;
      targetedAdapter.endDate = agendaSettings.endDate;
    } else if (settings) {
      targetedAdapter.startDate = info ? info.sourceAppointment.startDate : adapter.startDate; // TODO: in agenda we havn't info field

      targetedAdapter.endDate = info ? info.sourceAppointment.endDate : adapter.endDate;
    }

    var rawTargetedAppointment = targetedAdapter.source();

    if (element) {
      this.setTargetedAppointmentResources(rawTargetedAppointment, element, appointmentIndex);
    }

    if (info) {
      rawTargetedAppointment.displayStartDate = new Date(info.appointment.startDate);
      rawTargetedAppointment.displayEndDate = new Date(info.appointment.endDate);
    }

    return rawTargetedAppointment;
  };

  _proto.subscribe = function subscribe(subject, action) {
    this._subscribes[subject] = _subscribes.default[subject] = action;
  };

  _proto.fire = function fire(subject) {
    var callback = this._subscribes[subject];
    var args = Array.prototype.slice.call(arguments);

    if (!(0, _type.isFunction)(callback)) {
      throw _ui.default.Error('E1031', subject);
    }

    return callback.apply(this, args.slice(1));
  };

  _proto.getTargetCellData = function getTargetCellData() {
    return this._workSpace.getDataByDroppableCell();
  };

  _proto._updateAppointment = function _updateAppointment(target, rawAppointment, onUpdatePrevented, dragEvent) {
    var updatingOptions = {
      newData: rawAppointment,
      oldData: (0, _extend.extend)({}, target),
      cancel: false
    };

    var performFailAction = function (err) {
      if (onUpdatePrevented) {
        onUpdatePrevented.call(this);
      }

      if (err && err.name === 'Error') {
        throw err;
      }
    }.bind(this);

    this._actions[StoreEventNames.UPDATING](updatingOptions);

    if (dragEvent && !(0, _type.isDeferred)(dragEvent.cancel)) {
      dragEvent.cancel = new _deferred.Deferred();
    }

    return this._processActionResult(updatingOptions, function (canceled) {
      var _this19 = this;

      var deferred = new _deferred.Deferred();

      if (!canceled) {
        this._expandAllDayPanel(rawAppointment);

        try {
          deferred = this.appointmentDataProvider.update(target, rawAppointment).done(function () {
            dragEvent && dragEvent.cancel.resolve(false);
          }).always(function (storeAppointment) {
            return _this19._onDataPromiseCompleted(StoreEventNames.UPDATED, storeAppointment);
          }).fail(function () {
            return performFailAction();
          });
        } catch (err) {
          performFailAction(err);
          deferred.resolve();
        }
      } else {
        performFailAction();
        deferred.resolve();
      }

      return deferred.promise();
    });
  };

  _proto._processActionResult = function _processActionResult(actionOptions, callback) {
    var _this20 = this;

    var deferred = new _deferred.Deferred();

    var resolveCallback = function resolveCallback(callbackResult) {
      (0, _deferred.when)((0, _deferred.fromPromise)(callbackResult)).always(deferred.resolve);
    };

    if ((0, _type.isPromise)(actionOptions.cancel)) {
      (0, _deferred.when)((0, _deferred.fromPromise)(actionOptions.cancel)).always(function (cancel) {
        if (!(0, _type.isDefined)(cancel)) {
          cancel = actionOptions.cancel.state() === 'rejected';
        }

        resolveCallback(callback.call(_this20, cancel));
      });
    } else {
      resolveCallback(callback.call(this, actionOptions.cancel));
    }

    return deferred.promise();
  };

  _proto._expandAllDayPanel = function _expandAllDayPanel(appointment) {
    if (!this._isAllDayExpanded() && this.appointmentTakesAllDay(appointment)) {
      this._workSpace.option('allDayExpanded', true);
    }
  };

  _proto._onDataPromiseCompleted = function _onDataPromiseCompleted(handlerName, storeAppointment, appointment) {
    var args = {
      appointmentData: appointment || storeAppointment
    };

    if (storeAppointment instanceof Error) {
      args.error = storeAppointment;
    } else {
      this._appointmentPopup.visible && this._appointmentPopup.hide();
    }

    this._actions[handlerName](args);

    this._fireContentReadyAction();
  } ///#DEBUG
  ;

  _proto.getAppointmentDetailsForm = function getAppointmentDetailsForm() {
    // TODO for tests
    return this._appointmentForm.form;
  } ///#ENDDEBUG
  ;

  _proto.getAppointmentsInstance = function getAppointmentsInstance() {
    return this._appointments;
  };

  _proto.getLayoutManager = function getLayoutManager() {
    return this._layoutManager;
  };

  _proto.getRenderingStrategyInstance = function getRenderingStrategyInstance() {
    return this.getLayoutManager().getRenderingStrategyInstance();
  };

  _proto.getActions = function getActions() {
    return this._actions;
  };

  _proto.appointmentTakesAllDay = function appointmentTakesAllDay(rawAppointment) {
    var adapter = (0, _appointmentAdapter.createAppointmentAdapter)(rawAppointment, this._dataAccessors, this.timeZoneCalculator);
    return (0, _utils4.getAppointmentTakesAllDay)(adapter, this._getCurrentViewOption('startDayHour'), this._getCurrentViewOption('endDayHour'));
  };

  _proto.dayHasAppointment = function dayHasAppointment(day, rawAppointment, trimTime) {
    var _this21 = this;

    var getConvertedToTimeZone = function getConvertedToTimeZone(date) {
      return _this21.timeZoneCalculator.createDate(date, {
        path: 'toGrid'
      });
    };

    var appointment = (0, _appointmentAdapter.createAppointmentAdapter)(rawAppointment, this._dataAccessors, this.timeZoneCalculator);
    var startDate = new Date(appointment.startDate);
    var endDate = new Date(appointment.endDate);
    startDate = getConvertedToTimeZone(startDate);
    endDate = getConvertedToTimeZone(endDate);

    if (day.getTime() === endDate.getTime()) {
      return startDate.getTime() === endDate.getTime();
    }

    if (trimTime) {
      day = _date.default.trimTime(day);
      startDate = _date.default.trimTime(startDate);
      endDate = _date.default.trimTime(endDate);
    }

    var dayTimeStamp = day.getTime();
    var startDateTimeStamp = startDate.getTime();
    var endDateTimeStamp = endDate.getTime();
    return (0, _array.inArray)(dayTimeStamp, [startDateTimeStamp, endDateTimeStamp]) > -1 || startDateTimeStamp < dayTimeStamp && endDateTimeStamp > dayTimeStamp;
  };

  _proto.setTargetedAppointmentResources = function setTargetedAppointmentResources(rawAppointment, element, appointmentIndex) {
    var groups = this._getCurrentViewOption('groups');

    if (groups !== null && groups !== void 0 && groups.length) {
      var resourcesSetter = this.getResourceDataAccessors().setter;
      var workSpace = this._workSpace;
      var getGroups;
      var setResourceCallback;

      if (this._isAgenda()) {
        getGroups = function getGroups() {
          var apptSettings = this.getLayoutManager()._positionMap[appointmentIndex];

          return (0, _utils3.getCellGroups)(apptSettings[0].groupIndex, this.getWorkSpace().option('groups'));
        };

        setResourceCallback = function setResourceCallback(_, group) {
          resourcesSetter[group.name](rawAppointment, group.id);
        };
      } else {
        getGroups = function getGroups() {
          // TODO: in the future, necessary refactor the engine of determining groups
          var setting = _utils2.utils.dataAccessors.getAppointmentSettings(element) || {};
          return workSpace.getCellDataByCoordinates({
            left: setting.left,
            top: setting.top
          }).groups;
        };

        setResourceCallback = function setResourceCallback(field, value) {
          resourcesSetter[field](rawAppointment, value);
        };
      }

      (0, _iterator.each)(getGroups.call(this), setResourceCallback);
    }
  };

  _proto.getStartViewDate = function getStartViewDate() {
    return this._workSpace.getStartViewDate();
  };

  _proto.getEndViewDate = function getEndViewDate() {
    return this._workSpace.getEndViewDate();
  };

  _proto.showAddAppointmentPopup = function showAddAppointmentPopup(cellData, cellGroups) {
    var appointmentAdapter = (0, _appointmentAdapter.createAppointmentAdapter)({}, this._dataAccessors, this.timeZoneCalculator);
    appointmentAdapter.allDay = cellData.allDay;
    appointmentAdapter.startDate = this.timeZoneCalculator.createDate(cellData.startDate, {
      path: 'fromGrid'
    });
    appointmentAdapter.endDate = this.timeZoneCalculator.createDate(cellData.endDate, {
      path: 'fromGrid'
    });
    var resultAppointment = (0, _extend.extend)(appointmentAdapter.source(), cellGroups);
    this.showAppointmentPopup(resultAppointment, true);
  };

  _proto.showAppointmentPopup = function showAppointmentPopup(rawAppointment, createNewAppointment, rawTargetedAppointment) {
    var _this22 = this;

    var newRawTargetedAppointment = _extends({}, rawTargetedAppointment);

    if (newRawTargetedAppointment) {
      delete newRawTargetedAppointment.displayStartDate;
      delete newRawTargetedAppointment.displayEndDate;
    }

    var appointment = (0, _appointmentAdapter.createAppointmentAdapter)(newRawTargetedAppointment || rawAppointment, this._dataAccessors, this.timeZoneCalculator);
    var newTargetedAppointment = (0, _extend.extend)({}, rawAppointment, newRawTargetedAppointment);
    var isCreateAppointment = createNewAppointment !== null && createNewAppointment !== void 0 ? createNewAppointment : (0, _type.isEmptyObject)(rawAppointment);

    if ((0, _type.isEmptyObject)(rawAppointment)) {
      rawAppointment = this.createPopupAppointment();
    }

    if (isCreateAppointment) {
      delete this._editAppointmentData; // TODO

      this._editing.allowAdding && this._appointmentPopup.show(rawAppointment, {
        isToolbarVisible: true,
        action: _popup.ACTION_TO_APPOINTMENT.CREATE
      });
    } else {
      this._checkRecurringAppointment(rawAppointment, newTargetedAppointment, appointment.startDate, function () {
        _this22._editAppointmentData = rawAppointment; // TODO

        _this22._appointmentPopup.show(rawAppointment, {
          isToolbarVisible: _this22._editing.allowUpdating,
          action: _popup.ACTION_TO_APPOINTMENT.UPDATE
        });
      }, false, true);
    }
  };

  _proto.createPopupAppointment = function createPopupAppointment() {
    var result = {};
    var toMs = _date.default.dateToMilliseconds;
    var startDate = new Date(this.option('currentDate'));
    var endDate = new Date(startDate.getTime() + this.option('cellDuration') * toMs('minute'));

    _expressionUtils.ExpressionUtils.setField(this._dataAccessors, 'startDate', result, startDate);

    _expressionUtils.ExpressionUtils.setField(this._dataAccessors, 'endDate', result, endDate);

    return result;
  };

  _proto.hideAppointmentPopup = function hideAppointmentPopup(saveChanges) {
    var _this$_appointmentPop3;

    if ((_this$_appointmentPop3 = this._appointmentPopup) !== null && _this$_appointmentPop3 !== void 0 && _this$_appointmentPop3.visible) {
      saveChanges && this._appointmentPopup.saveChangesAsync();

      this._appointmentPopup.hide();
    }
  };

  _proto.showAppointmentTooltip = function showAppointmentTooltip(appointment, element, targetedAppointment) {
    if (appointment) {
      var settings = _utils2.utils.dataAccessors.getAppointmentSettings(element);

      var appointmentConfig = {
        itemData: targetedAppointment || appointment,
        groupIndex: settings === null || settings === void 0 ? void 0 : settings.groupIndex,
        groups: this.option('groups')
      };

      var _getAppointmentColor = this.createGetAppointmentColor();

      var deferredColor = _getAppointmentColor(appointmentConfig);

      var info = new _dataStructures.AppointmentTooltipInfo(appointment, targetedAppointment, deferredColor);
      this.showAppointmentTooltipCore(element, [info]);
    }
  };

  _proto.createGetAppointmentColor = function createGetAppointmentColor() {
    var _this23 = this;

    return function (appointmentConfig) {
      var resourceConfig = {
        resources: _this23.option('resources'),
        dataAccessors: _this23.getResourceDataAccessors(),
        loadedResources: _this23.option('loadedResources'),
        resourceLoaderMap: _this23.option('resourceLoaderMap')
      };
      return (0, _utils3.getAppointmentColor)(resourceConfig, appointmentConfig);
    };
  };

  _proto.showAppointmentTooltipCore = function showAppointmentTooltipCore(target, data, options) {
    if (this._appointmentTooltip.isAlreadyShown(target)) {
      this.hideAppointmentTooltip();
    } else {
      this._appointmentTooltip.show(target, data, (0, _extend.extend)(this._getExtraAppointmentTooltipOptions(), options));
    }
  };

  _proto.hideAppointmentTooltip = function hideAppointmentTooltip() {
    this._appointmentTooltip && this._appointmentTooltip.hide();
  };

  _proto.scrollToTime = function scrollToTime(hours, minutes, date) {
    _ui.default.log('W0002', 'dxScheduler', 'scrollToTime', '21.1', 'Use the "scrollTo" method instead');

    this._workSpace.scrollToTime(hours, minutes, date);
  };

  _proto.scrollTo = function scrollTo(date, groups, allDay) {
    this._workSpace.scrollTo(date, groups, allDay);
  };

  _proto._isHorizontalVirtualScrolling = function _isHorizontalVirtualScrolling() {
    var scrolling = this.option('scrolling');
    var orientation = scrolling.orientation,
        mode = scrolling.mode;
    var isVirtualScrolling = mode === 'virtual';
    return isVirtualScrolling && (orientation === 'horizontal' || orientation === 'both');
  };

  _proto.addAppointment = function addAppointment(rawAppointment) {
    var _this24 = this;

    var appointment = (0, _appointmentAdapter.createAppointmentAdapter)(rawAppointment, this._dataAccessors, this.timeZoneCalculator);
    appointment.text = appointment.text || '';
    var serializedAppointment = appointment.source(true);
    var addingOptions = {
      appointmentData: serializedAppointment,
      cancel: false
    };

    this._actions[StoreEventNames.ADDING](addingOptions);

    return this._processActionResult(addingOptions, function (canceled) {
      if (canceled) {
        return new _deferred.Deferred().resolve();
      }

      _this24._expandAllDayPanel(serializedAppointment);

      return _this24.appointmentDataProvider.add(serializedAppointment).always(function (storeAppointment) {
        return _this24._onDataPromiseCompleted(StoreEventNames.ADDED, storeAppointment);
      });
    });
  };

  _proto.updateAppointment = function updateAppointment(target, appointment) {
    return this._updateAppointment(target, appointment);
  };

  _proto.deleteAppointment = function deleteAppointment(rawAppointment) {
    var deletingOptions = {
      appointmentData: rawAppointment,
      cancel: false
    };

    this._actions[StoreEventNames.DELETING](deletingOptions);

    this._processActionResult(deletingOptions, function (canceled) {
      var _this25 = this;

      if (!canceled) {
        this.appointmentDataProvider.remove(rawAppointment).always(function (storeAppointment) {
          return _this25._onDataPromiseCompleted(StoreEventNames.DELETED, storeAppointment, rawAppointment);
        });
      }
    });
  };

  _proto.focus = function focus() {
    if (this._editAppointmentData) {
      this._appointments.focus();
    } else {
      this._workSpace.focus();
    }
  };

  _proto.getFirstDayOfWeek = function getFirstDayOfWeek() {
    return (0, _type.isDefined)(this.option('firstDayOfWeek')) ? this.option('firstDayOfWeek') : _date2.default.firstDayOfWeekIndex();
  };

  _proto._validateDayHours = function _validateDayHours() {
    var startDayHour = this._getCurrentViewOption('startDayHour');

    var endDayHour = this._getCurrentViewOption('endDayHour');

    (0, _base.validateDayHours)(startDayHour, endDayHour);
  }
  /**
      * @name dxScheduler.registerKeyHandler
      * @publicName registerKeyHandler(key, handler)
      * @hidden
      */
  ;

  _createClass(Scheduler, [{
    key: "filteredItems",
    get: function get() {
      if (!this._filteredItems) {
        this._filteredItems = [];
      }

      return this._filteredItems;
    },
    set: function set(value) {
      this._filteredItems = value;
    }
  }, {
    key: "preparedItems",
    get: function get() {
      if (!this._preparedItems) {
        this._preparedItems = [];
      }

      return this._preparedItems;
    },
    set: function set(value) {
      this._preparedItems = value;
    }
  }, {
    key: "currentView",
    get: function get() {
      return (0, _views.getCurrentView)(this.option('currentView'), this.option('views'));
    }
  }, {
    key: "currentViewType",
    get: function get() {
      return (0, _type.isObject)(this.currentView) ? this.currentView.type : this.currentView;
    }
  }, {
    key: "timeZoneCalculator",
    get: function get() {
      if (!this._timeZoneCalculator) {
        this._timeZoneCalculator = (0, _createTimeZoneCalculator.createTimeZoneCalculator)(this.option('timeZone'));
      }

      return this._timeZoneCalculator;
    }
  }]);

  return Scheduler;
}(_ui2.default);

Scheduler.include(_data_helper.default);
(0, _component_registrator.default)('dxScheduler', Scheduler);
var _default = Scheduler;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
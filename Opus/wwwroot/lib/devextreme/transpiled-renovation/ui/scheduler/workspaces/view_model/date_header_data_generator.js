"use strict";

exports.DateHeaderDataGenerator = void 0;

var _date = _interopRequireDefault(require("../../../../core/utils/date"));

var _utils = require("../../resources/utils");

var _base = require("../../../../renovation/ui/scheduler/view_model/to_test/views/utils/base");

var _excluded = ["startDate", "endDate", "isFirstGroupCell", "isLastGroupCell"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DateHeaderDataGenerator = /*#__PURE__*/function () {
  function DateHeaderDataGenerator(viewDataGenerator) {
    this._viewDataGenerator = viewDataGenerator;
  }

  var _proto = DateHeaderDataGenerator.prototype;

  _proto.getCompleteDateHeaderMap = function getCompleteDateHeaderMap(options, completeViewDataMap) {
    var isGenerateWeekDaysHeaderData = options.isGenerateWeekDaysHeaderData;
    var result = [];

    if (isGenerateWeekDaysHeaderData) {
      var weekDaysRow = this._generateWeekDaysHeaderRowMap(options, completeViewDataMap);

      result.push(weekDaysRow);
    }

    var dateRow = this._generateHeaderDateRow(options, completeViewDataMap);

    result.push(dateRow);
    return result;
  };

  _proto._generateWeekDaysHeaderRowMap = function _generateWeekDaysHeaderRowMap(options, completeViewDataMap) {
    var isGroupedByDate = options.isGroupedByDate,
        groups = options.groups,
        groupOrientation = options.groupOrientation,
        startDayHour = options.startDayHour,
        endDayHour = options.endDayHour,
        hoursInterval = options.hoursInterval,
        isHorizontalGrouping = options.isHorizontalGrouping,
        intervalCount = options.intervalCount;

    var cellCountInDay = this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);

    var horizontalGroupCount = (0, _base.getHorizontalGroupCount)(groups, groupOrientation);
    var index = completeViewDataMap[0][0].allDay ? 1 : 0;
    var colSpan = isGroupedByDate ? horizontalGroupCount * cellCountInDay : cellCountInDay;
    var groupCount = (0, _utils.getGroupCount)(groups);
    var datesRepeatCount = isHorizontalGrouping && !isGroupedByDate ? groupCount : 1;
    var daysInGroup = this._viewDataGenerator.daysInInterval * intervalCount;
    var daysInView = daysInGroup * datesRepeatCount;
    var weekDaysRow = [];

    for (var dayIndex = 0; dayIndex < daysInView; dayIndex += 1) {
      var cell = completeViewDataMap[index][dayIndex * colSpan];
      weekDaysRow.push(_extends({}, cell, {
        colSpan: colSpan,
        text: (0, _base.formatWeekdayAndDay)(cell.startDate),
        isFirstGroupCell: false,
        isLastGroupCell: false
      }));
    }

    return weekDaysRow;
  };

  _proto._generateHeaderDateRow = function _generateHeaderDateRow(options, completeViewDataMap) {
    var today = options.today,
        isGroupedByDate = options.isGroupedByDate,
        groupOrientation = options.groupOrientation,
        groups = options.groups,
        headerCellTextFormat = options.headerCellTextFormat,
        getDateForHeaderText = options.getDateForHeaderText,
        interval = options.interval,
        startViewDate = options.startViewDate,
        startDayHour = options.startDayHour,
        endDayHour = options.endDayHour,
        hoursInterval = options.hoursInterval,
        intervalCount = options.intervalCount,
        currentDate = options.currentDate,
        viewType = options.viewType;
    var horizontalGroupCount = (0, _base.getHorizontalGroupCount)(groups, groupOrientation);
    var index = completeViewDataMap[0][0].allDay ? 1 : 0;
    var colSpan = isGroupedByDate ? horizontalGroupCount : 1;
    var isVerticalGrouping = groupOrientation === 'vertical';

    var cellCountInGroupRow = this._viewDataGenerator.getCellCount({
      intervalCount: intervalCount,
      currentDate: currentDate,
      viewType: viewType,
      hoursInterval: hoursInterval,
      startDayHour: startDayHour,
      endDayHour: endDayHour
    });

    var cellCountInDay = this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);

    var slicedByColumnsData = isGroupedByDate ? completeViewDataMap[index].filter(function (_, columnIndex) {
      return columnIndex % horizontalGroupCount === 0;
    }) : completeViewDataMap[index];
    return slicedByColumnsData.map(function (_ref, index) {
      var startDate = _ref.startDate,
          endDate = _ref.endDate,
          isFirstGroupCell = _ref.isFirstGroupCell,
          isLastGroupCell = _ref.isLastGroupCell,
          restProps = _objectWithoutProperties(_ref, _excluded);

      var text = (0, _base.getHeaderCellText)(index % cellCountInGroupRow, startDate, headerCellTextFormat, getDateForHeaderText, {
        interval: interval,
        startViewDate: startViewDate,
        startDayHour: startDayHour,
        cellCountInDay: cellCountInDay
      });
      return _extends({}, restProps, {
        startDate: startDate,
        text: text,
        today: _date.default.sameDate(startDate, today),
        colSpan: colSpan,
        isFirstGroupCell: isGroupedByDate || isFirstGroupCell && !isVerticalGrouping,
        isLastGroupCell: isGroupedByDate || isLastGroupCell && !isVerticalGrouping
      });
    });
  };

  _proto.generateDateHeaderData = function generateDateHeaderData(completeDateHeaderMap, completeViewDataMap, options) {
    var isGenerateWeekDaysHeaderData = options.isGenerateWeekDaysHeaderData,
        cellWidth = options.cellWidth,
        isProvideVirtualCellsWidth = options.isProvideVirtualCellsWidth,
        startDayHour = options.startDayHour,
        endDayHour = options.endDayHour,
        hoursInterval = options.hoursInterval;
    var dataMap = [];
    var weekDayRowConfig = {};
    var validCellWidth = cellWidth || 0;

    if (isGenerateWeekDaysHeaderData) {
      weekDayRowConfig = this._generateDateHeaderDataRow(options, completeDateHeaderMap, completeViewDataMap, this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval), 0, validCellWidth);
      dataMap.push(weekDayRowConfig.dateRow);
    }

    var datesRowConfig = this._generateDateHeaderDataRow(options, completeDateHeaderMap, completeViewDataMap, 1, isGenerateWeekDaysHeaderData ? 1 : 0, validCellWidth);

    dataMap.push(datesRowConfig.dateRow);
    return {
      dataMap: dataMap,
      leftVirtualCellWidth: isProvideVirtualCellsWidth ? datesRowConfig.leftVirtualCellWidth : undefined,
      rightVirtualCellWidth: isProvideVirtualCellsWidth ? datesRowConfig.rightVirtualCellWidth : undefined,
      leftVirtualCellCount: datesRowConfig.leftVirtualCellCount,
      rightVirtualCellCount: datesRowConfig.rightVirtualCellCount,
      weekDayLeftVirtualCellWidth: weekDayRowConfig.leftVirtualCellWidth,
      weekDayRightVirtualCellWidth: weekDayRowConfig.rightVirtualCellWidth,
      weekDayLeftVirtualCellCount: weekDayRowConfig.leftVirtualCellCount,
      weekDayRightVirtualCellCount: weekDayRowConfig.rightVirtualCellCount
    };
  };

  _proto._generateDateHeaderDataRow = function _generateDateHeaderDataRow(options, completeDateHeaderMap, completeViewDataMap, baseColSpan, rowIndex, cellWidth) {
    var startCellIndex = options.startCellIndex,
        cellCount = options.cellCount,
        isProvideVirtualCellsWidth = options.isProvideVirtualCellsWidth,
        groups = options.groups,
        groupOrientation = options.groupOrientation,
        isGroupedByDate = options.isGroupedByDate;
    var horizontalGroupCount = (0, _base.getHorizontalGroupCount)(groups, groupOrientation);
    var colSpan = isGroupedByDate ? horizontalGroupCount * baseColSpan : baseColSpan;
    var leftVirtualCellCount = Math.floor(startCellIndex / colSpan);
    var displayedCellCount = (0, _base.getDisplayedCellCount)(cellCount, completeViewDataMap);
    var actualCellCount = Math.ceil((startCellIndex + displayedCellCount) / colSpan);
    var totalCellCount = (0, _base.getTotalCellCountByCompleteData)(completeViewDataMap);
    var dateRow = completeDateHeaderMap[rowIndex].slice(leftVirtualCellCount, actualCellCount);
    var finalLeftVirtualCellCount = leftVirtualCellCount * colSpan;
    var finalLeftVirtualCellWidth = finalLeftVirtualCellCount * cellWidth;
    var finalRightVirtualCellCount = totalCellCount - actualCellCount * colSpan;
    var finalRightVirtualCellWidth = finalRightVirtualCellCount * cellWidth;
    return {
      dateRow: dateRow,
      leftVirtualCellCount: finalLeftVirtualCellCount,
      leftVirtualCellWidth: isProvideVirtualCellsWidth ? finalLeftVirtualCellWidth : undefined,
      rightVirtualCellCount: finalRightVirtualCellCount,
      rightVirtualCellWidth: isProvideVirtualCellsWidth ? finalRightVirtualCellWidth : undefined
    };
  };

  return DateHeaderDataGenerator;
}();

exports.DateHeaderDataGenerator = DateHeaderDataGenerator;
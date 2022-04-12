"use strict";

exports.DataGrid = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _data_grid_props = require("./common/data_grid_props");

require("../../../../ui/data_grid/ui.data_grid");

var _widget = require("../../common/widget");

var _datagrid_component = require("../../../component_wrapper/data_grid/datagrid_component");

var _data_grid_views = require("./data_grid_views");

var _get_updated_options = require("../../common/utils/get_updated_options");

var _window = require("../../../../core/utils/window");

var _utils = require("../../../../core/options/utils");

var _excluded = ["onOptionChanged"],
    _excluded2 = ["accessKey", "activeStateEnabled", "adaptColumnWidthByRatio", "allowColumnReordering", "allowColumnResizing", "autoNavigateToFocusedRow", "cacheEnabled", "cellHintEnabled", "className", "columnAutoWidth", "columnChooser", "columnFixing", "columnHidingEnabled", "columnMinWidth", "columnResizingMode", "columnWidth", "columns", "commonColumnSettings", "customizeColumns", "customizeExportData", "dataRowTemplate", "dataSource", "dateSerializationFormat", "defaultFilterValue", "defaultFocusedColumnIndex", "defaultFocusedRowIndex", "defaultFocusedRowKey", "defaultSelectedRowKeys", "defaultSelectionFilter", "disabled", "editing", "errorRowEnabled", "export", "filterBuilder", "filterBuilderPopup", "filterPanel", "filterRow", "filterSyncEnabled", "filterValue", "filterValueChange", "focusStateEnabled", "focusedColumnIndex", "focusedColumnIndexChange", "focusedRowEnabled", "focusedRowIndex", "focusedRowIndexChange", "focusedRowKey", "focusedRowKeyChange", "groupPanel", "grouping", "headerFilter", "height", "highlightChanges", "hint", "hoverStateEnabled", "keyExpr", "keyboardNavigation", "loadPanel", "loadingTimeout", "masterDetail", "noDataText", "onAdaptiveDetailRowPreparing", "onCellClick", "onCellDblClick", "onCellHoverChanged", "onCellPrepared", "onClick", "onContextMenuPreparing", "onDataErrorOccurred", "onEditCanceled", "onEditCanceling", "onEditingStart", "onEditorPrepared", "onEditorPreparing", "onExported", "onExporting", "onFileSaving", "onFocusedCellChanged", "onFocusedCellChanging", "onFocusedRowChanged", "onFocusedRowChanging", "onInitNewRow", "onKeyDown", "onRowClick", "onRowCollapsed", "onRowCollapsing", "onRowDblClick", "onRowExpanded", "onRowExpanding", "onRowInserted", "onRowInserting", "onRowPrepared", "onRowRemoved", "onRowRemoving", "onRowUpdated", "onRowUpdating", "onRowValidating", "onSaved", "onSaving", "onSelectionChanged", "onToolbarPreparing", "pager", "paging", "regenerateColumnsByVisibleItems", "remoteOperations", "renderAsync", "repaintChangesOnly", "rowAlternationEnabled", "rowDragging", "rowTemplate", "rtlEnabled", "scrolling", "searchPanel", "selectedRowKeys", "selectedRowKeysChange", "selection", "selectionFilter", "selectionFilterChange", "showBorders", "showColumnHeaders", "showColumnLines", "showRowLines", "sortByGroupSummaryInfo", "sorting", "stateStoring", "summary", "tabIndex", "toolbar", "twoWayBindingEnabled", "useKeyboard", "useLegacyColumnButtonTemplate", "useLegacyKeyboardNavigation", "visible", "width", "wordWrapEnabled"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var aria = {
  role: "presentation"
};
var rowSelector = ".dx-row";

function normalizeProps(props) {
  var result = {};
  Object.keys(props).forEach(function (key) {
    if (props[key] !== undefined) {
      result[key] = props[key];
    }
  });
  return result;
}

var viewFunction = function viewFunction(_ref) {
  var initializedInstance = _ref.initializedInstance,
      onDimensionChanged = _ref.onDimensionChanged,
      onHoverEnd = _ref.onHoverEnd,
      onHoverStart = _ref.onHoverStart,
      onVisibilityChange = _ref.onVisibilityChange,
      _ref$props = _ref.props,
      accessKey = _ref$props.accessKey,
      activeStateEnabled = _ref$props.activeStateEnabled,
      className = _ref$props.className,
      disabled = _ref$props.disabled,
      focusStateEnabled = _ref$props.focusStateEnabled,
      height = _ref$props.height,
      hint = _ref$props.hint,
      hoverStateEnabled = _ref$props.hoverStateEnabled,
      rtlEnabled = _ref$props.rtlEnabled,
      showBorders = _ref$props.showBorders,
      tabIndex = _ref$props.tabIndex,
      visible = _ref$props.visible,
      width = _ref$props.width,
      restAttributes = _ref.restAttributes,
      widgetElementRef = _ref.widgetElementRef;
  return normalizeProps((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "rootElementRef": widgetElementRef,
    "accessKey": accessKey,
    "activeStateEnabled": activeStateEnabled,
    "activeStateUnit": rowSelector,
    "aria": aria,
    "className": className,
    "disabled": disabled,
    "focusStateEnabled": focusStateEnabled,
    "height": height,
    "hint": hint,
    "hoverStateEnabled": hoverStateEnabled,
    "rtlEnabled": rtlEnabled,
    "tabIndex": tabIndex,
    "visible": visible,
    "width": width,
    "onHoverStart": onHoverStart,
    "onHoverEnd": onHoverEnd,
    "onDimensionChanged": onDimensionChanged,
    "onVisibilityChange": onVisibilityChange
  }, restAttributes, {
    children: (0, _inferno.createComponentVNode)(2, _data_grid_views.DataGridViews, {
      "instance": initializedInstance,
      "showBorders": showBorders
    })
  })));
};

exports.viewFunction = viewFunction;

var getTemplate = function getTemplate(TemplateProp) {
  return TemplateProp && (TemplateProp.defaultProps ? function (props) {
    return normalizeProps((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)));
  } : TemplateProp);
};

var DataGrid = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(DataGrid, _InfernoWrapperCompon);

  function DataGrid(props) {
    var _this;

    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.widgetElementRef = (0, _inferno.createRef)();
    _this.isTwoWayPropUpdating = false;
    _this.state = {
      initialized: false,
      filterValue: _this.props.filterValue !== undefined ? _this.props.filterValue : _this.props.defaultFilterValue,
      focusedColumnIndex: _this.props.focusedColumnIndex !== undefined ? _this.props.focusedColumnIndex : _this.props.defaultFocusedColumnIndex,
      focusedRowIndex: _this.props.focusedRowIndex !== undefined ? _this.props.focusedRowIndex : _this.props.defaultFocusedRowIndex,
      focusedRowKey: _this.props.focusedRowKey !== undefined ? _this.props.focusedRowKey : _this.props.defaultFocusedRowKey,
      selectedRowKeys: _this.props.selectedRowKeys !== undefined ? _this.props.selectedRowKeys : _this.props.defaultSelectedRowKeys,
      selectionFilter: _this.props.selectionFilter !== undefined ? _this.props.selectionFilter : _this.props.defaultSelectionFilter
    };
    _this.getComponentInstance = _this.getComponentInstance.bind(_assertThisInitialized(_this));
    _this.beginCustomLoading = _this.beginCustomLoading.bind(_assertThisInitialized(_this));
    _this.byKey = _this.byKey.bind(_assertThisInitialized(_this));
    _this.cancelEditData = _this.cancelEditData.bind(_assertThisInitialized(_this));
    _this.cellValue = _this.cellValue.bind(_assertThisInitialized(_this));
    _this.clearFilter = _this.clearFilter.bind(_assertThisInitialized(_this));
    _this.clearSelection = _this.clearSelection.bind(_assertThisInitialized(_this));
    _this.clearSorting = _this.clearSorting.bind(_assertThisInitialized(_this));
    _this.closeEditCell = _this.closeEditCell.bind(_assertThisInitialized(_this));
    _this.collapseAdaptiveDetailRow = _this.collapseAdaptiveDetailRow.bind(_assertThisInitialized(_this));
    _this.columnCount = _this.columnCount.bind(_assertThisInitialized(_this));
    _this.columnOption = _this.columnOption.bind(_assertThisInitialized(_this));
    _this.deleteColumn = _this.deleteColumn.bind(_assertThisInitialized(_this));
    _this.deleteRow = _this.deleteRow.bind(_assertThisInitialized(_this));
    _this.deselectAll = _this.deselectAll.bind(_assertThisInitialized(_this));
    _this.deselectRows = _this.deselectRows.bind(_assertThisInitialized(_this));
    _this.editCell = _this.editCell.bind(_assertThisInitialized(_this));
    _this.editRow = _this.editRow.bind(_assertThisInitialized(_this));
    _this.endCustomLoading = _this.endCustomLoading.bind(_assertThisInitialized(_this));
    _this.expandAdaptiveDetailRow = _this.expandAdaptiveDetailRow.bind(_assertThisInitialized(_this));
    _this.filter = _this.filter.bind(_assertThisInitialized(_this));
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    _this.getCellElement = _this.getCellElement.bind(_assertThisInitialized(_this));
    _this.getCombinedFilter = _this.getCombinedFilter.bind(_assertThisInitialized(_this));
    _this.getDataSource = _this.getDataSource.bind(_assertThisInitialized(_this));
    _this.getKeyByRowIndex = _this.getKeyByRowIndex.bind(_assertThisInitialized(_this));
    _this.getRowElement = _this.getRowElement.bind(_assertThisInitialized(_this));
    _this.getRowIndexByKey = _this.getRowIndexByKey.bind(_assertThisInitialized(_this));
    _this.getScrollable = _this.getScrollable.bind(_assertThisInitialized(_this));
    _this.getVisibleColumnIndex = _this.getVisibleColumnIndex.bind(_assertThisInitialized(_this));
    _this.hasEditData = _this.hasEditData.bind(_assertThisInitialized(_this));
    _this.hideColumnChooser = _this.hideColumnChooser.bind(_assertThisInitialized(_this));
    _this.isAdaptiveDetailRowExpanded = _this.isAdaptiveDetailRowExpanded.bind(_assertThisInitialized(_this));
    _this.isRowFocused = _this.isRowFocused.bind(_assertThisInitialized(_this));
    _this.isRowSelected = _this.isRowSelected.bind(_assertThisInitialized(_this));
    _this.keyOf = _this.keyOf.bind(_assertThisInitialized(_this));
    _this.navigateToRow = _this.navigateToRow.bind(_assertThisInitialized(_this));
    _this.pageCount = _this.pageCount.bind(_assertThisInitialized(_this));
    _this.pageIndex = _this.pageIndex.bind(_assertThisInitialized(_this));
    _this.pageSize = _this.pageSize.bind(_assertThisInitialized(_this));
    _this.refresh = _this.refresh.bind(_assertThisInitialized(_this));
    _this.repaintRows = _this.repaintRows.bind(_assertThisInitialized(_this));
    _this.saveEditData = _this.saveEditData.bind(_assertThisInitialized(_this));
    _this.searchByText = _this.searchByText.bind(_assertThisInitialized(_this));
    _this.selectAll = _this.selectAll.bind(_assertThisInitialized(_this));
    _this.selectRows = _this.selectRows.bind(_assertThisInitialized(_this));
    _this.selectRowsByIndexes = _this.selectRowsByIndexes.bind(_assertThisInitialized(_this));
    _this.showColumnChooser = _this.showColumnChooser.bind(_assertThisInitialized(_this));
    _this.undeleteRow = _this.undeleteRow.bind(_assertThisInitialized(_this));
    _this.updateDimensions = _this.updateDimensions.bind(_assertThisInitialized(_this));
    _this.resize = _this.resize.bind(_assertThisInitialized(_this));
    _this.addColumn = _this.addColumn.bind(_assertThisInitialized(_this));
    _this.addRow = _this.addRow.bind(_assertThisInitialized(_this));
    _this.clearGrouping = _this.clearGrouping.bind(_assertThisInitialized(_this));
    _this.collapseAll = _this.collapseAll.bind(_assertThisInitialized(_this));
    _this.collapseRow = _this.collapseRow.bind(_assertThisInitialized(_this));
    _this.expandAll = _this.expandAll.bind(_assertThisInitialized(_this));
    _this.expandRow = _this.expandRow.bind(_assertThisInitialized(_this));
    _this.exportToExcel = _this.exportToExcel.bind(_assertThisInitialized(_this));
    _this.getSelectedRowKeys = _this.getSelectedRowKeys.bind(_assertThisInitialized(_this));
    _this.getSelectedRowsData = _this.getSelectedRowsData.bind(_assertThisInitialized(_this));
    _this.getTotalSummaryValue = _this.getTotalSummaryValue.bind(_assertThisInitialized(_this));
    _this.getVisibleColumns = _this.getVisibleColumns.bind(_assertThisInitialized(_this));
    _this.getVisibleRows = _this.getVisibleRows.bind(_assertThisInitialized(_this));
    _this.isRowExpanded = _this.isRowExpanded.bind(_assertThisInitialized(_this));
    _this.totalCount = _this.totalCount.bind(_assertThisInitialized(_this));
    _this.isScrollbarVisible = _this.isScrollbarVisible.bind(_assertThisInitialized(_this));
    _this.getTopVisibleRowData = _this.getTopVisibleRowData.bind(_assertThisInitialized(_this));
    _this.getScrollbarWidth = _this.getScrollbarWidth.bind(_assertThisInitialized(_this));
    _this.getDataProvider = _this.getDataProvider.bind(_assertThisInitialized(_this));
    _this.updateOptions = _this.updateOptions.bind(_assertThisInitialized(_this));
    _this.dispose = _this.dispose.bind(_assertThisInitialized(_this));
    _this.setupInstance = _this.setupInstance.bind(_assertThisInitialized(_this));
    _this.instanceOptionChangedHandler = _this.instanceOptionChangedHandler.bind(_assertThisInitialized(_this));
    _this.updateTwoWayValue = _this.updateTwoWayValue.bind(_assertThisInitialized(_this));
    _this.onHoverStart = _this.onHoverStart.bind(_assertThisInitialized(_this));
    _this.onHoverEnd = _this.onHoverEnd.bind(_assertThisInitialized(_this));
    _this.onDimensionChanged = _this.onDimensionChanged.bind(_assertThisInitialized(_this));
    _this.onVisibilityChange = _this.onVisibilityChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = DataGrid.prototype;

  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.updateOptions, [this.props]), new _inferno2.InfernoEffect(this.dispose, []), new _inferno2.InfernoEffect(this.setupInstance, []), (0, _inferno2.createReRenderEffect)()];
  };

  _proto.updateEffects = function updateEffects() {
    var _this$_effects$;

    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props]);
  };

  _proto.updateOptions = function updateOptions() {
    var _this2 = this;

    if (this.instance && this.prevProps && !this.isTwoWayPropUpdating) {
      var updatedOptions = (0, _get_updated_options.getUpdatedOptions)(this.prevProps, _extends({}, this.props, {
        filterValue: this.props.filterValue !== undefined ? this.props.filterValue : this.state.filterValue,
        focusedColumnIndex: this.props.focusedColumnIndex !== undefined ? this.props.focusedColumnIndex : this.state.focusedColumnIndex,
        focusedRowIndex: this.props.focusedRowIndex !== undefined ? this.props.focusedRowIndex : this.state.focusedRowIndex,
        focusedRowKey: this.props.focusedRowKey !== undefined ? this.props.focusedRowKey : this.state.focusedRowKey,
        selectedRowKeys: this.props.selectedRowKeys !== undefined ? this.props.selectedRowKeys : this.state.selectedRowKeys,
        selectionFilter: this.props.selectionFilter !== undefined ? this.props.selectionFilter : this.state.selectionFilter
      }));
      this.instance.beginUpdate();
      updatedOptions.forEach(function (_ref2) {
        var path = _ref2.path,
            previousValue = _ref2.previousValue,
            value = _ref2.value;

        _this2.instance._options.silent(path, previousValue);

        _this2.instance.option(path, value);
      });
      this.prevProps = _extends({}, this.props, {
        filterValue: this.props.filterValue !== undefined ? this.props.filterValue : this.state.filterValue,
        focusedColumnIndex: this.props.focusedColumnIndex !== undefined ? this.props.focusedColumnIndex : this.state.focusedColumnIndex,
        focusedRowIndex: this.props.focusedRowIndex !== undefined ? this.props.focusedRowIndex : this.state.focusedRowIndex,
        focusedRowKey: this.props.focusedRowKey !== undefined ? this.props.focusedRowKey : this.state.focusedRowKey,
        selectedRowKeys: this.props.selectedRowKeys !== undefined ? this.props.selectedRowKeys : this.state.selectedRowKeys,
        selectionFilter: this.props.selectionFilter !== undefined ? this.props.selectionFilter : this.state.selectionFilter
      });
      this.instance.endUpdate();
    } else {
      this.prevProps = _extends({}, this.props, {
        filterValue: this.props.filterValue !== undefined ? this.props.filterValue : this.state.filterValue,
        focusedColumnIndex: this.props.focusedColumnIndex !== undefined ? this.props.focusedColumnIndex : this.state.focusedColumnIndex,
        focusedRowIndex: this.props.focusedRowIndex !== undefined ? this.props.focusedRowIndex : this.state.focusedRowIndex,
        focusedRowKey: this.props.focusedRowKey !== undefined ? this.props.focusedRowKey : this.state.focusedRowKey,
        selectedRowKeys: this.props.selectedRowKeys !== undefined ? this.props.selectedRowKeys : this.state.selectedRowKeys,
        selectionFilter: this.props.selectionFilter !== undefined ? this.props.selectionFilter : this.state.selectionFilter
      });
    }
  };

  _proto.dispose = function dispose() {
    var _this3 = this;

    return function () {
      _this3.instance.dispose();
    };
  };

  _proto.setupInstance = function setupInstance() {
    var _this$widgetElementRe,
        _this4 = this;

    var element = (_this$widgetElementRe = this.widgetElementRef) === null || _this$widgetElementRe === void 0 ? void 0 : _this$widgetElementRe.current;
    var restAttributes = this.restAttributes;
    var onContentReady = restAttributes.onContentReady,
        _onInitialized = restAttributes.onInitialized;

    var _this$props$filterVal = _extends({}, _extends({}, this.props, {
      filterValue: this.props.filterValue !== undefined ? this.props.filterValue : this.state.filterValue,
      focusedColumnIndex: this.props.focusedColumnIndex !== undefined ? this.props.focusedColumnIndex : this.state.focusedColumnIndex,
      focusedRowIndex: this.props.focusedRowIndex !== undefined ? this.props.focusedRowIndex : this.state.focusedRowIndex,
      focusedRowKey: this.props.focusedRowKey !== undefined ? this.props.focusedRowKey : this.state.focusedRowKey,
      selectedRowKeys: this.props.selectedRowKeys !== undefined ? this.props.selectedRowKeys : this.state.selectedRowKeys,
      selectionFilter: this.props.selectionFilter !== undefined ? this.props.selectionFilter : this.state.selectionFilter
    }), {
      onInitialized: function onInitialized(e) {
        _this4.instance = e.component;
        _onInitialized === null || _onInitialized === void 0 ? void 0 : _onInitialized(e);
      },
      onContentReady: onContentReady
    }),
        onOptionChanged = _this$props$filterVal.onOptionChanged,
        restProps = _objectWithoutProperties(_this$props$filterVal, _excluded);

    new _datagrid_component.DataGridComponent(element, normalizeProps(restProps));

    if ((0, _window.hasWindow)()) {
      this.instance.getController("resizing").updateSize(element);
    }

    this.instance.on("optionChanged", this.instanceOptionChangedHandler.bind(this));
    this.setState(function (__state_argument) {
      return {
        initialized: true
      };
    });
  };

  _proto.instanceOptionChangedHandler = function instanceOptionChangedHandler(e) {
    try {
      this.isTwoWayPropUpdating = true;
      this.updateTwoWayValue(e);
    } finally {
      this.isTwoWayPropUpdating = false;
    }
  };

  _proto.updateTwoWayValue = function updateTwoWayValue(e) {
    var optionValue = e.component.option(e.fullName);
    var isValueCorrect = e.value === optionValue;

    if (e.value !== e.previousValue && isValueCorrect) {
      if (e.name === "editing" && this.props.editing) {
        if (e.fullName === "editing.changes") {
          this.props.editing.changes = e.value;
        }

        if (e.fullName === "editing.editRowKey") {
          this.props.editing.editRowKey = e.value;
        }

        if (e.fullName === "editing.editColumnName") {
          this.props.editing.editColumnName = e.value;
        }
      }

      if (e.fullName === "searchPanel.text" && this.props.searchPanel) {
        this.props.searchPanel.text = e.value;
      }

      if (e.fullName === "focusedRowKey") {
        {
          var __newValue;

          this.setState(function (__state_argument) {
            __newValue = e.value;
            return {
              focusedRowKey: __newValue
            };
          });
          this.props.focusedRowKeyChange(__newValue);
        }
      }

      if (e.fullName === "focusedRowIndex") {
        {
          var _newValue;

          this.setState(function (__state_argument) {
            _newValue = e.value;
            return {
              focusedRowIndex: _newValue
            };
          });
          this.props.focusedRowIndexChange(_newValue);
        }
      }

      if (e.fullName === "focusedColumnIndex") {
        {
          var _newValue2;

          this.setState(function (__state_argument) {
            _newValue2 = e.value;
            return {
              focusedColumnIndex: _newValue2
            };
          });
          this.props.focusedColumnIndexChange(_newValue2);
        }
      }

      if (e.fullName === "filterValue" && (this.props.filterValue !== undefined ? this.props.filterValue : this.state.filterValue) !== e.value) {
        {
          var _newValue3;

          this.setState(function (__state_argument) {
            _newValue3 = e.value;
            return {
              filterValue: _newValue3
            };
          });
          this.props.filterValueChange(_newValue3);
        }
      }

      if (e.fullName === "selectedRowKeys") {
        {
          var _newValue4;

          this.setState(function (__state_argument) {
            _newValue4 = e.value;
            return {
              selectedRowKeys: _newValue4
            };
          });
          this.props.selectedRowKeysChange(_newValue4);
        }
      }

      if (e.fullName === "selectionFilter") {
        {
          var _newValue5;

          this.setState(function (__state_argument) {
            _newValue5 = e.value;
            return {
              selectionFilter: _newValue5
            };
          });
          this.props.selectionFilterChange(_newValue5);
        }
      }
    }
  };

  _proto.onHoverStart = function onHoverStart(event) {
    event.currentTarget.classList.add("dx-state-hover");
  };

  _proto.onHoverEnd = function onHoverEnd(event) {
    event.currentTarget.classList.remove("dx-state-hover");
  };

  _proto.onDimensionChanged = function onDimensionChanged() {
    var _this$instance;

    (_this$instance = this.instance) === null || _this$instance === void 0 ? void 0 : _this$instance.updateDimensions(true);
  };

  _proto.onVisibilityChange = function onVisibilityChange(visible) {
    if (visible) {
      var _this$instance2;

      (_this$instance2 = this.instance) === null || _this$instance2 === void 0 ? void 0 : _this$instance2.updateDimensions();
    }
  };

  _proto.getComponentInstance = function getComponentInstance() {
    return this.instance;
  };

  _proto.beginCustomLoading = function beginCustomLoading(messageText) {
    var _this$instance3;

    return (_this$instance3 = this.instance) === null || _this$instance3 === void 0 ? void 0 : _this$instance3.beginCustomLoading(messageText);
  };

  _proto.byKey = function byKey(key) {
    var _this$instance4;

    return (_this$instance4 = this.instance) === null || _this$instance4 === void 0 ? void 0 : _this$instance4.byKey(key);
  };

  _proto.cancelEditData = function cancelEditData() {
    var _this$instance5;

    return (_this$instance5 = this.instance) === null || _this$instance5 === void 0 ? void 0 : _this$instance5.cancelEditData();
  };

  _proto.cellValue = function cellValue(rowIndex, dataField, value) {
    var _this$instance6;

    return (_this$instance6 = this.instance) === null || _this$instance6 === void 0 ? void 0 : _this$instance6.cellValue(rowIndex, dataField, value);
  };

  _proto.clearFilter = function clearFilter(filterName) {
    var _this$instance7;

    return (_this$instance7 = this.instance) === null || _this$instance7 === void 0 ? void 0 : _this$instance7.clearFilter(filterName);
  };

  _proto.clearSelection = function clearSelection() {
    var _this$instance8;

    return (_this$instance8 = this.instance) === null || _this$instance8 === void 0 ? void 0 : _this$instance8.clearSelection();
  };

  _proto.clearSorting = function clearSorting() {
    var _this$instance9;

    return (_this$instance9 = this.instance) === null || _this$instance9 === void 0 ? void 0 : _this$instance9.clearSorting();
  };

  _proto.closeEditCell = function closeEditCell() {
    var _this$instance10;

    return (_this$instance10 = this.instance) === null || _this$instance10 === void 0 ? void 0 : _this$instance10.closeEditCell();
  };

  _proto.collapseAdaptiveDetailRow = function collapseAdaptiveDetailRow() {
    var _this$instance11;

    return (_this$instance11 = this.instance) === null || _this$instance11 === void 0 ? void 0 : _this$instance11.collapseAdaptiveDetailRow();
  };

  _proto.columnCount = function columnCount() {
    var _this$instance12;

    return (_this$instance12 = this.instance) === null || _this$instance12 === void 0 ? void 0 : _this$instance12.columnCount();
  };

  _proto.columnOption = function columnOption(id, optionName, optionValue) {
    if (this.instance) {
      if (arguments.length === 1 || optionName === undefined) {
        return this.instance.columnOption(id);
      }

      if (arguments.length === 2) {
        return this.instance.columnOption(id, optionName);
      }

      return this.instance.columnOption(id, optionName, optionValue);
    }

    return null;
  };

  _proto.deleteColumn = function deleteColumn(id) {
    var _this$instance13;

    return (_this$instance13 = this.instance) === null || _this$instance13 === void 0 ? void 0 : _this$instance13.deleteColumn(id);
  };

  _proto.deleteRow = function deleteRow(rowIndex) {
    var _this$instance14;

    return (_this$instance14 = this.instance) === null || _this$instance14 === void 0 ? void 0 : _this$instance14.deleteRow(rowIndex);
  };

  _proto.deselectAll = function deselectAll() {
    var _this$instance15;

    return (_this$instance15 = this.instance) === null || _this$instance15 === void 0 ? void 0 : _this$instance15.deselectAll();
  };

  _proto.deselectRows = function deselectRows(keys) {
    var _this$instance16;

    return (_this$instance16 = this.instance) === null || _this$instance16 === void 0 ? void 0 : _this$instance16.deselectRows(keys);
  };

  _proto.editCell = function editCell(rowIndex, dataFieldColumnIndex) {
    var _this$instance17;

    return (_this$instance17 = this.instance) === null || _this$instance17 === void 0 ? void 0 : _this$instance17.editCell(rowIndex, dataFieldColumnIndex);
  };

  _proto.editRow = function editRow(rowIndex) {
    var _this$instance18;

    return (_this$instance18 = this.instance) === null || _this$instance18 === void 0 ? void 0 : _this$instance18.editRow(rowIndex);
  };

  _proto.endCustomLoading = function endCustomLoading() {
    var _this$instance19;

    return (_this$instance19 = this.instance) === null || _this$instance19 === void 0 ? void 0 : _this$instance19.endCustomLoading();
  };

  _proto.expandAdaptiveDetailRow = function expandAdaptiveDetailRow(key) {
    var _this$instance20;

    return (_this$instance20 = this.instance) === null || _this$instance20 === void 0 ? void 0 : _this$instance20.expandAdaptiveDetailRow(key);
  };

  _proto.filter = function filter(filterExpr) {
    var _this$instance21;

    return (_this$instance21 = this.instance) === null || _this$instance21 === void 0 ? void 0 : _this$instance21.filter(filterExpr);
  };

  _proto.focus = function focus(element) {
    var _this$instance22;

    return (_this$instance22 = this.instance) === null || _this$instance22 === void 0 ? void 0 : _this$instance22.focus(element);
  };

  _proto.getCellElement = function getCellElement(rowIndex, dataField) {
    var _this$instance23;

    return (_this$instance23 = this.instance) === null || _this$instance23 === void 0 ? void 0 : _this$instance23.getCellElement(rowIndex, dataField);
  };

  _proto.getCombinedFilter = function getCombinedFilter(returnDataField) {
    var _this$instance24;

    return (_this$instance24 = this.instance) === null || _this$instance24 === void 0 ? void 0 : _this$instance24.getCombinedFilter(returnDataField);
  };

  _proto.getDataSource = function getDataSource() {
    var _this$instance25;

    return (_this$instance25 = this.instance) === null || _this$instance25 === void 0 ? void 0 : _this$instance25.getDataSource();
  };

  _proto.getKeyByRowIndex = function getKeyByRowIndex(rowIndex) {
    var _this$instance26;

    return (_this$instance26 = this.instance) === null || _this$instance26 === void 0 ? void 0 : _this$instance26.getKeyByRowIndex(rowIndex);
  };

  _proto.getRowElement = function getRowElement(rowIndex) {
    var _this$instance27;

    return (_this$instance27 = this.instance) === null || _this$instance27 === void 0 ? void 0 : _this$instance27.getRowElement(rowIndex);
  };

  _proto.getRowIndexByKey = function getRowIndexByKey(key) {
    var _this$instance28;

    return (_this$instance28 = this.instance) === null || _this$instance28 === void 0 ? void 0 : _this$instance28.getRowIndexByKey(key);
  };

  _proto.getScrollable = function getScrollable() {
    var _this$instance29;

    return (_this$instance29 = this.instance) === null || _this$instance29 === void 0 ? void 0 : _this$instance29.getScrollable();
  };

  _proto.getVisibleColumnIndex = function getVisibleColumnIndex(id) {
    var _this$instance30;

    return (_this$instance30 = this.instance) === null || _this$instance30 === void 0 ? void 0 : _this$instance30.getVisibleColumnIndex(id);
  };

  _proto.hasEditData = function hasEditData() {
    var _this$instance31;

    return (_this$instance31 = this.instance) === null || _this$instance31 === void 0 ? void 0 : _this$instance31.hasEditData();
  };

  _proto.hideColumnChooser = function hideColumnChooser() {
    var _this$instance32;

    return (_this$instance32 = this.instance) === null || _this$instance32 === void 0 ? void 0 : _this$instance32.hideColumnChooser();
  };

  _proto.isAdaptiveDetailRowExpanded = function isAdaptiveDetailRowExpanded(key) {
    var _this$instance33;

    return (_this$instance33 = this.instance) === null || _this$instance33 === void 0 ? void 0 : _this$instance33.isAdaptiveDetailRowExpanded(key);
  };

  _proto.isRowFocused = function isRowFocused(key) {
    var _this$instance34;

    return (_this$instance34 = this.instance) === null || _this$instance34 === void 0 ? void 0 : _this$instance34.isRowFocused(key);
  };

  _proto.isRowSelected = function isRowSelected(key) {
    var _this$instance35;

    return (_this$instance35 = this.instance) === null || _this$instance35 === void 0 ? void 0 : _this$instance35.isRowSelected(key);
  };

  _proto.keyOf = function keyOf(obj) {
    var _this$instance36;

    return (_this$instance36 = this.instance) === null || _this$instance36 === void 0 ? void 0 : _this$instance36.keyOf(obj);
  };

  _proto.navigateToRow = function navigateToRow(key) {
    var _this$instance37;

    return (_this$instance37 = this.instance) === null || _this$instance37 === void 0 ? void 0 : _this$instance37.navigateToRow(key);
  };

  _proto.pageCount = function pageCount() {
    var _this$instance38;

    return (_this$instance38 = this.instance) === null || _this$instance38 === void 0 ? void 0 : _this$instance38.pageCount();
  };

  _proto.pageIndex = function pageIndex(newIndex) {
    var _this$instance39;

    return (_this$instance39 = this.instance) === null || _this$instance39 === void 0 ? void 0 : _this$instance39.pageIndex(newIndex);
  };

  _proto.pageSize = function pageSize(value) {
    var _this$instance40;

    return (_this$instance40 = this.instance) === null || _this$instance40 === void 0 ? void 0 : _this$instance40.pageSize(value);
  };

  _proto.refresh = function refresh(changesOnly) {
    var _this$instance41;

    return (_this$instance41 = this.instance) === null || _this$instance41 === void 0 ? void 0 : _this$instance41.refresh(changesOnly);
  };

  _proto.repaintRows = function repaintRows(rowIndexes) {
    var _this$instance42;

    return (_this$instance42 = this.instance) === null || _this$instance42 === void 0 ? void 0 : _this$instance42.repaintRows(rowIndexes);
  };

  _proto.saveEditData = function saveEditData() {
    var _this$instance43;

    return (_this$instance43 = this.instance) === null || _this$instance43 === void 0 ? void 0 : _this$instance43.saveEditData();
  };

  _proto.searchByText = function searchByText(text) {
    var _this$instance44;

    return (_this$instance44 = this.instance) === null || _this$instance44 === void 0 ? void 0 : _this$instance44.searchByText(text);
  };

  _proto.selectAll = function selectAll() {
    var _this$instance45;

    return (_this$instance45 = this.instance) === null || _this$instance45 === void 0 ? void 0 : _this$instance45.selectAll();
  };

  _proto.selectRows = function selectRows(keys, preserve) {
    var _this$instance46;

    return (_this$instance46 = this.instance) === null || _this$instance46 === void 0 ? void 0 : _this$instance46.selectRows(keys, preserve);
  };

  _proto.selectRowsByIndexes = function selectRowsByIndexes(indexes) {
    var _this$instance47;

    return (_this$instance47 = this.instance) === null || _this$instance47 === void 0 ? void 0 : _this$instance47.selectRowsByIndexes(indexes);
  };

  _proto.showColumnChooser = function showColumnChooser() {
    var _this$instance48;

    return (_this$instance48 = this.instance) === null || _this$instance48 === void 0 ? void 0 : _this$instance48.showColumnChooser();
  };

  _proto.undeleteRow = function undeleteRow(rowIndex) {
    var _this$instance49;

    return (_this$instance49 = this.instance) === null || _this$instance49 === void 0 ? void 0 : _this$instance49.undeleteRow(rowIndex);
  };

  _proto.updateDimensions = function updateDimensions() {
    var _this$instance50;

    return (_this$instance50 = this.instance) === null || _this$instance50 === void 0 ? void 0 : _this$instance50.updateDimensions();
  };

  _proto.resize = function resize() {
    var _this$instance51;

    return (_this$instance51 = this.instance) === null || _this$instance51 === void 0 ? void 0 : _this$instance51.resize();
  };

  _proto.addColumn = function addColumn(columnOptions) {
    var _this$instance52;

    return (_this$instance52 = this.instance) === null || _this$instance52 === void 0 ? void 0 : _this$instance52.addColumn(columnOptions);
  };

  _proto.addRow = function addRow() {
    var _this$instance53;

    return (_this$instance53 = this.instance) === null || _this$instance53 === void 0 ? void 0 : _this$instance53.addRow();
  };

  _proto.clearGrouping = function clearGrouping() {
    var _this$instance54;

    return (_this$instance54 = this.instance) === null || _this$instance54 === void 0 ? void 0 : _this$instance54.clearGrouping();
  };

  _proto.collapseAll = function collapseAll(groupIndex) {
    var _this$instance55;

    return (_this$instance55 = this.instance) === null || _this$instance55 === void 0 ? void 0 : _this$instance55.collapseAll(groupIndex);
  };

  _proto.collapseRow = function collapseRow(key) {
    var _this$instance56;

    return (_this$instance56 = this.instance) === null || _this$instance56 === void 0 ? void 0 : _this$instance56.collapseRow(key);
  };

  _proto.expandAll = function expandAll(groupIndex) {
    var _this$instance57;

    return (_this$instance57 = this.instance) === null || _this$instance57 === void 0 ? void 0 : _this$instance57.expandAll(groupIndex);
  };

  _proto.expandRow = function expandRow(key) {
    var _this$instance58;

    return (_this$instance58 = this.instance) === null || _this$instance58 === void 0 ? void 0 : _this$instance58.expandRow(key);
  };

  _proto.exportToExcel = function exportToExcel(selectionOnly) {
    var _this$instance59;

    return (_this$instance59 = this.instance) === null || _this$instance59 === void 0 ? void 0 : _this$instance59.exportToExcel(selectionOnly);
  };

  _proto.getSelectedRowKeys = function getSelectedRowKeys() {
    var _this$instance60;

    return (_this$instance60 = this.instance) === null || _this$instance60 === void 0 ? void 0 : _this$instance60.getSelectedRowKeys();
  };

  _proto.getSelectedRowsData = function getSelectedRowsData() {
    var _this$instance61;

    return (_this$instance61 = this.instance) === null || _this$instance61 === void 0 ? void 0 : _this$instance61.getSelectedRowsData();
  };

  _proto.getTotalSummaryValue = function getTotalSummaryValue(summaryItemName) {
    var _this$instance62;

    return (_this$instance62 = this.instance) === null || _this$instance62 === void 0 ? void 0 : _this$instance62.getTotalSummaryValue(summaryItemName);
  };

  _proto.getVisibleColumns = function getVisibleColumns(headerLevel) {
    var _this$instance63;

    return (_this$instance63 = this.instance) === null || _this$instance63 === void 0 ? void 0 : _this$instance63.getVisibleColumns(headerLevel);
  };

  _proto.getVisibleRows = function getVisibleRows() {
    var _this$instance64;

    return (_this$instance64 = this.instance) === null || _this$instance64 === void 0 ? void 0 : _this$instance64.getVisibleRows();
  };

  _proto.isRowExpanded = function isRowExpanded(key) {
    var _this$instance65;

    return (_this$instance65 = this.instance) === null || _this$instance65 === void 0 ? void 0 : _this$instance65.isRowExpanded(key);
  };

  _proto.totalCount = function totalCount() {
    var _this$instance66;

    return (_this$instance66 = this.instance) === null || _this$instance66 === void 0 ? void 0 : _this$instance66.totalCount();
  };

  _proto.isScrollbarVisible = function isScrollbarVisible() {
    var _this$instance67;

    return (_this$instance67 = this.instance) === null || _this$instance67 === void 0 ? void 0 : _this$instance67.isScrollbarVisible();
  };

  _proto.getTopVisibleRowData = function getTopVisibleRowData() {
    var _this$instance68;

    return (_this$instance68 = this.instance) === null || _this$instance68 === void 0 ? void 0 : _this$instance68.getTopVisibleRowData();
  };

  _proto.getScrollbarWidth = function getScrollbarWidth(isHorizontal) {
    var _this$instance69;

    return (_this$instance69 = this.instance) === null || _this$instance69 === void 0 ? void 0 : _this$instance69.getScrollbarWidth(isHorizontal);
  };

  _proto.getDataProvider = function getDataProvider(selectedRowsOnly) {
    var _this$instance70;

    return (_this$instance70 = this.instance) === null || _this$instance70 === void 0 ? void 0 : _this$instance70.getDataProvider(selectedRowsOnly);
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        filterValue: this.props.filterValue !== undefined ? this.props.filterValue : this.state.filterValue,
        focusedColumnIndex: this.props.focusedColumnIndex !== undefined ? this.props.focusedColumnIndex : this.state.focusedColumnIndex,
        focusedRowIndex: this.props.focusedRowIndex !== undefined ? this.props.focusedRowIndex : this.state.focusedRowIndex,
        focusedRowKey: this.props.focusedRowKey !== undefined ? this.props.focusedRowKey : this.state.focusedRowKey,
        selectedRowKeys: this.props.selectedRowKeys !== undefined ? this.props.selectedRowKeys : this.state.selectedRowKeys,
        selectionFilter: this.props.selectionFilter !== undefined ? this.props.selectionFilter : this.state.selectionFilter,
        rowTemplate: getTemplate(props.rowTemplate),
        dataRowTemplate: getTemplate(props.dataRowTemplate)
      }),
      initialized: this.state.initialized,
      widgetElementRef: this.widgetElementRef,
      initializedInstance: this.initializedInstance,
      instanceOptionChangedHandler: this.instanceOptionChangedHandler,
      updateTwoWayValue: this.updateTwoWayValue,
      onHoverStart: this.onHoverStart,
      onHoverEnd: this.onHoverEnd,
      onDimensionChanged: this.onDimensionChanged,
      onVisibilityChange: this.onVisibilityChange,
      restAttributes: this.restAttributes
    });
  };

  _createClass(DataGrid, [{
    key: "initializedInstance",
    get: function get() {
      return this.state.initialized ? this.instance : undefined;
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props$filterVal2 = _extends({}, this.props, {
        filterValue: this.props.filterValue !== undefined ? this.props.filterValue : this.state.filterValue,
        focusedColumnIndex: this.props.focusedColumnIndex !== undefined ? this.props.focusedColumnIndex : this.state.focusedColumnIndex,
        focusedRowIndex: this.props.focusedRowIndex !== undefined ? this.props.focusedRowIndex : this.state.focusedRowIndex,
        focusedRowKey: this.props.focusedRowKey !== undefined ? this.props.focusedRowKey : this.state.focusedRowKey,
        selectedRowKeys: this.props.selectedRowKeys !== undefined ? this.props.selectedRowKeys : this.state.selectedRowKeys,
        selectionFilter: this.props.selectionFilter !== undefined ? this.props.selectionFilter : this.state.selectionFilter
      }),
          accessKey = _this$props$filterVal2.accessKey,
          activeStateEnabled = _this$props$filterVal2.activeStateEnabled,
          adaptColumnWidthByRatio = _this$props$filterVal2.adaptColumnWidthByRatio,
          allowColumnReordering = _this$props$filterVal2.allowColumnReordering,
          allowColumnResizing = _this$props$filterVal2.allowColumnResizing,
          autoNavigateToFocusedRow = _this$props$filterVal2.autoNavigateToFocusedRow,
          cacheEnabled = _this$props$filterVal2.cacheEnabled,
          cellHintEnabled = _this$props$filterVal2.cellHintEnabled,
          className = _this$props$filterVal2.className,
          columnAutoWidth = _this$props$filterVal2.columnAutoWidth,
          columnChooser = _this$props$filterVal2.columnChooser,
          columnFixing = _this$props$filterVal2.columnFixing,
          columnHidingEnabled = _this$props$filterVal2.columnHidingEnabled,
          columnMinWidth = _this$props$filterVal2.columnMinWidth,
          columnResizingMode = _this$props$filterVal2.columnResizingMode,
          columnWidth = _this$props$filterVal2.columnWidth,
          columns = _this$props$filterVal2.columns,
          commonColumnSettings = _this$props$filterVal2.commonColumnSettings,
          customizeColumns = _this$props$filterVal2.customizeColumns,
          customizeExportData = _this$props$filterVal2.customizeExportData,
          dataRowTemplate = _this$props$filterVal2.dataRowTemplate,
          dataSource = _this$props$filterVal2.dataSource,
          dateSerializationFormat = _this$props$filterVal2.dateSerializationFormat,
          defaultFilterValue = _this$props$filterVal2.defaultFilterValue,
          defaultFocusedColumnIndex = _this$props$filterVal2.defaultFocusedColumnIndex,
          defaultFocusedRowIndex = _this$props$filterVal2.defaultFocusedRowIndex,
          defaultFocusedRowKey = _this$props$filterVal2.defaultFocusedRowKey,
          defaultSelectedRowKeys = _this$props$filterVal2.defaultSelectedRowKeys,
          defaultSelectionFilter = _this$props$filterVal2.defaultSelectionFilter,
          disabled = _this$props$filterVal2.disabled,
          editing = _this$props$filterVal2.editing,
          errorRowEnabled = _this$props$filterVal2.errorRowEnabled,
          exportProp = _this$props$filterVal2.export,
          filterBuilder = _this$props$filterVal2.filterBuilder,
          filterBuilderPopup = _this$props$filterVal2.filterBuilderPopup,
          filterPanel = _this$props$filterVal2.filterPanel,
          filterRow = _this$props$filterVal2.filterRow,
          filterSyncEnabled = _this$props$filterVal2.filterSyncEnabled,
          filterValue = _this$props$filterVal2.filterValue,
          filterValueChange = _this$props$filterVal2.filterValueChange,
          focusStateEnabled = _this$props$filterVal2.focusStateEnabled,
          focusedColumnIndex = _this$props$filterVal2.focusedColumnIndex,
          focusedColumnIndexChange = _this$props$filterVal2.focusedColumnIndexChange,
          focusedRowEnabled = _this$props$filterVal2.focusedRowEnabled,
          focusedRowIndex = _this$props$filterVal2.focusedRowIndex,
          focusedRowIndexChange = _this$props$filterVal2.focusedRowIndexChange,
          focusedRowKey = _this$props$filterVal2.focusedRowKey,
          focusedRowKeyChange = _this$props$filterVal2.focusedRowKeyChange,
          groupPanel = _this$props$filterVal2.groupPanel,
          grouping = _this$props$filterVal2.grouping,
          headerFilter = _this$props$filterVal2.headerFilter,
          height = _this$props$filterVal2.height,
          highlightChanges = _this$props$filterVal2.highlightChanges,
          hint = _this$props$filterVal2.hint,
          hoverStateEnabled = _this$props$filterVal2.hoverStateEnabled,
          keyExpr = _this$props$filterVal2.keyExpr,
          keyboardNavigation = _this$props$filterVal2.keyboardNavigation,
          loadPanel = _this$props$filterVal2.loadPanel,
          loadingTimeout = _this$props$filterVal2.loadingTimeout,
          masterDetail = _this$props$filterVal2.masterDetail,
          noDataText = _this$props$filterVal2.noDataText,
          onAdaptiveDetailRowPreparing = _this$props$filterVal2.onAdaptiveDetailRowPreparing,
          onCellClick = _this$props$filterVal2.onCellClick,
          onCellDblClick = _this$props$filterVal2.onCellDblClick,
          onCellHoverChanged = _this$props$filterVal2.onCellHoverChanged,
          onCellPrepared = _this$props$filterVal2.onCellPrepared,
          onClick = _this$props$filterVal2.onClick,
          onContextMenuPreparing = _this$props$filterVal2.onContextMenuPreparing,
          onDataErrorOccurred = _this$props$filterVal2.onDataErrorOccurred,
          onEditCanceled = _this$props$filterVal2.onEditCanceled,
          onEditCanceling = _this$props$filterVal2.onEditCanceling,
          onEditingStart = _this$props$filterVal2.onEditingStart,
          onEditorPrepared = _this$props$filterVal2.onEditorPrepared,
          onEditorPreparing = _this$props$filterVal2.onEditorPreparing,
          onExported = _this$props$filterVal2.onExported,
          onExporting = _this$props$filterVal2.onExporting,
          onFileSaving = _this$props$filterVal2.onFileSaving,
          onFocusedCellChanged = _this$props$filterVal2.onFocusedCellChanged,
          onFocusedCellChanging = _this$props$filterVal2.onFocusedCellChanging,
          onFocusedRowChanged = _this$props$filterVal2.onFocusedRowChanged,
          onFocusedRowChanging = _this$props$filterVal2.onFocusedRowChanging,
          onInitNewRow = _this$props$filterVal2.onInitNewRow,
          onKeyDown = _this$props$filterVal2.onKeyDown,
          onRowClick = _this$props$filterVal2.onRowClick,
          onRowCollapsed = _this$props$filterVal2.onRowCollapsed,
          onRowCollapsing = _this$props$filterVal2.onRowCollapsing,
          onRowDblClick = _this$props$filterVal2.onRowDblClick,
          onRowExpanded = _this$props$filterVal2.onRowExpanded,
          onRowExpanding = _this$props$filterVal2.onRowExpanding,
          onRowInserted = _this$props$filterVal2.onRowInserted,
          onRowInserting = _this$props$filterVal2.onRowInserting,
          onRowPrepared = _this$props$filterVal2.onRowPrepared,
          onRowRemoved = _this$props$filterVal2.onRowRemoved,
          onRowRemoving = _this$props$filterVal2.onRowRemoving,
          onRowUpdated = _this$props$filterVal2.onRowUpdated,
          onRowUpdating = _this$props$filterVal2.onRowUpdating,
          onRowValidating = _this$props$filterVal2.onRowValidating,
          onSaved = _this$props$filterVal2.onSaved,
          onSaving = _this$props$filterVal2.onSaving,
          onSelectionChanged = _this$props$filterVal2.onSelectionChanged,
          onToolbarPreparing = _this$props$filterVal2.onToolbarPreparing,
          pager = _this$props$filterVal2.pager,
          paging = _this$props$filterVal2.paging,
          regenerateColumnsByVisibleItems = _this$props$filterVal2.regenerateColumnsByVisibleItems,
          remoteOperations = _this$props$filterVal2.remoteOperations,
          renderAsync = _this$props$filterVal2.renderAsync,
          repaintChangesOnly = _this$props$filterVal2.repaintChangesOnly,
          rowAlternationEnabled = _this$props$filterVal2.rowAlternationEnabled,
          rowDragging = _this$props$filterVal2.rowDragging,
          rowTemplate = _this$props$filterVal2.rowTemplate,
          rtlEnabled = _this$props$filterVal2.rtlEnabled,
          scrolling = _this$props$filterVal2.scrolling,
          searchPanel = _this$props$filterVal2.searchPanel,
          selectedRowKeys = _this$props$filterVal2.selectedRowKeys,
          selectedRowKeysChange = _this$props$filterVal2.selectedRowKeysChange,
          selection = _this$props$filterVal2.selection,
          selectionFilter = _this$props$filterVal2.selectionFilter,
          selectionFilterChange = _this$props$filterVal2.selectionFilterChange,
          showBorders = _this$props$filterVal2.showBorders,
          showColumnHeaders = _this$props$filterVal2.showColumnHeaders,
          showColumnLines = _this$props$filterVal2.showColumnLines,
          showRowLines = _this$props$filterVal2.showRowLines,
          sortByGroupSummaryInfo = _this$props$filterVal2.sortByGroupSummaryInfo,
          sorting = _this$props$filterVal2.sorting,
          stateStoring = _this$props$filterVal2.stateStoring,
          summary = _this$props$filterVal2.summary,
          tabIndex = _this$props$filterVal2.tabIndex,
          toolbar = _this$props$filterVal2.toolbar,
          twoWayBindingEnabled = _this$props$filterVal2.twoWayBindingEnabled,
          useKeyboard = _this$props$filterVal2.useKeyboard,
          useLegacyColumnButtonTemplate = _this$props$filterVal2.useLegacyColumnButtonTemplate,
          useLegacyKeyboardNavigation = _this$props$filterVal2.useLegacyKeyboardNavigation,
          visible = _this$props$filterVal2.visible,
          width = _this$props$filterVal2.width,
          wordWrapEnabled = _this$props$filterVal2.wordWrapEnabled,
          restProps = _objectWithoutProperties(_this$props$filterVal2, _excluded2);

      return restProps;
    }
  }]);

  return DataGrid;
}(_inferno2.InfernoWrapperComponent);

exports.DataGrid = DataGrid;

function __processTwoWayProps(defaultProps) {
  var twoWayProps = ["filterValue", "focusedColumnIndex", "focusedRowIndex", "focusedRowKey", "selectedRowKeys", "selectionFilter"];
  return Object.keys(defaultProps).reduce(function (props, propName) {
    var propValue = defaultProps[propName];
    var defaultPropName = twoWayProps.some(function (p) {
      return p === propName;
    }) ? "default" + propName.charAt(0).toUpperCase() + propName.slice(1) : propName;
    props[defaultPropName] = propValue;
    return props;
  }, {});
}

DataGrid.defaultProps = _data_grid_props.DataGridProps;
var __defaultOptionRules = [];

function defaultOptions(rule) {
  __defaultOptionRules.push(rule);

  DataGrid.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(DataGrid.defaultProps), Object.getOwnPropertyDescriptors(__processTwoWayProps((0, _utils.convertRulesToOptions)(__defaultOptionRules)))));
}
import { getOuterHeight, getHeight, getWidth, getOuterWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import core from './ui.grid_core.modules';
import gridCoreUtils from './ui.grid_core.utils';
import { isDefined, isEmptyObject } from '../../core/utils/type';
import { inArray } from '../../core/utils/array';
import { focused } from '../widget/selectors';
import { addNamespace, createEvent, isCommandKeyPressed } from '../../events/utils/index';
import pointerEvents from '../../events/pointer';
import { name as clickEventName } from '../../events/click';
import { noop } from '../../core/utils/common';
import * as accessibility from '../shared/accessibility';
import browser from '../../core/utils/browser';
import { keyboard } from '../../events/short';
import devices from '../../core/devices';
var ROWS_VIEW_CLASS = 'rowsview';
var EDIT_FORM_CLASS = 'edit-form';
var GROUP_FOOTER_CLASS = 'group-footer';
var ROW_CLASS = 'dx-row';
var DATA_ROW_CLASS = 'dx-data-row';
var GROUP_ROW_CLASS = 'dx-group-row';
var HEADER_ROW_CLASS = 'dx-header-row';
var EDIT_FORM_ITEM_CLASS = 'edit-form-item';
var MASTER_DETAIL_ROW_CLASS = 'dx-master-detail-row';
var FREESPACE_ROW_CLASS = 'dx-freespace-row';
var VIRTUAL_ROW_CLASS = 'dx-virtual-row';
var MASTER_DETAIL_CELL_CLASS = 'dx-master-detail-cell';
var EDITOR_CELL_CLASS = 'dx-editor-cell';
var DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
var COMMAND_EXPAND_CLASS = 'dx-command-expand';
var COMMAND_SELECT_CLASS = 'dx-command-select';
var COMMAND_EDIT_CLASS = 'dx-command-edit';
var COMMAND_CELL_SELECTOR = '[class^=dx-command]';
var CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
var DATEBOX_WIDGET_NAME = 'dxDateBox';
var FOCUS_STATE_CLASS = 'dx-state-focused';
var WIDGET_CLASS = 'dx-widget';
var REVERT_BUTTON_CLASS = 'dx-revert-button';
var FAST_EDITING_DELETE_KEY = 'delete';
var INTERACTIVE_ELEMENTS_SELECTOR = 'input:not([type=\'hidden\']), textarea, a, select, button, [tabindex], .dx-checkbox';
var NON_FOCUSABLE_ELEMENTS_SELECTOR = "".concat(INTERACTIVE_ELEMENTS_SELECTOR, ", .dx-dropdowneditor-icon");
var EDIT_MODE_ROW = 'row';
var EDIT_MODE_FORM = 'form';
var EDIT_MODE_BATCH = 'batch';
var EDIT_MODE_CELL = 'cell';
var FOCUS_TYPE_ROW = 'row';
var FOCUS_TYPE_CELL = 'cell';
var COLUMN_HEADERS_VIEW = 'columnHeadersView';

function isGroupRow($row) {
  return $row && $row.hasClass(GROUP_ROW_CLASS);
}

function isDetailRow($row) {
  return $row && $row.hasClass(MASTER_DETAIL_ROW_CLASS);
}

function isDataRow($row) {
  return $row && !isGroupRow($row) && !isDetailRow($row);
}

function isNotFocusedRow($row) {
  return !$row || $row.hasClass(FREESPACE_ROW_CLASS) || $row.hasClass(VIRTUAL_ROW_CLASS);
}

function isCellElement($element) {
  return $element.length && $element[0].tagName === 'TD';
}

function isEditorCell(that, $cell) {
  return !that._isRowEditMode() && $cell && !$cell.hasClass(COMMAND_SELECT_CLASS) && $cell.hasClass(EDITOR_CELL_CLASS);
}

function isElementDefined($element) {
  return isDefined($element) && $element.length > 0;
}

function isMobile() {
  return devices.current().deviceType !== 'desktop';
}

function isCellInHeaderRow($cell) {
  return !!$cell.parent(".".concat(HEADER_ROW_CLASS)).length;
}

function isFixedColumnIndexOffsetRequired(that, column) {
  var rtlEnabled = that.option('rtlEnabled');
  var result = false;

  if (rtlEnabled) {
    result = !(column.fixedPosition === 'right' || isDefined(column.command) && !isDefined(column.fixedPosition));
  } else {
    result = !(!isDefined(column.fixedPosition) || column.fixedPosition === 'left');
  }

  return result;
}

function shouldPreventScroll(that) {
  var keyboardController = that.getController('keyboardNavigation');
  return keyboardController._isVirtualScrolling() ? that.option('focusedRowIndex') === keyboardController.getRowIndex() : false;
}

var KeyboardNavigationController = core.ViewController.inherit({
  // #region Initialization
  init: function init() {
    this._dataController = this.getController('data');
    this._selectionController = this.getController('selection');
    this._editingController = this.getController('editing');
    this._headerPanel = this.getView('headerPanel');
    this._columnsController = this.getController('columns');
    this._editorFactory = this.getController('editorFactory');

    if (this.isKeyboardEnabled()) {
      accessibility.subscribeVisibilityChange();
      this._updateFocusTimeout = null;
      this._fastEditingStarted = false;
      this._focusedCellPosition = {};
      this._canceledCellPosition = null;

      var elementFocused = $element => {
        this.setupFocusedView();

        if (this._isNeedScroll) {
          if ($element.is(':visible') && this._focusedView && this._focusedView.getScrollable) {
            this._focusedView._scrollToElement($element);

            this._isNeedScroll = false;
          }
        }
      };

      this._editorFactory.focused.add(elementFocused);

      this._initViewHandlers();

      this._initDocumentHandlers();

      this.createAction('onKeyDown');
    }
  },
  _initViewHandlers: function _initViewHandlers() {
    var rowsView = this.getView('rowsView');

    var rowsViewFocusHandler = event => {
      var $element = $(event.target);
      var isRelatedTargetInRowsView = $(event.relatedTarget).closest(rowsView.element()).length;
      var isCommandButton = $element.hasClass('dx-link');

      if (isCommandButton && !isRelatedTargetInRowsView && this._isEventInCurrentGrid(event)) {
        var $focusedCell = this._getFocusedCell();

        $focusedCell = !isElementDefined($focusedCell) ? rowsView.getCellElements(0).filter('[tabindex]').eq(0) : $focusedCell;

        if (!$element.closest($focusedCell).length) {
          event.preventDefault();
          eventsEngine.trigger($focusedCell, 'focus');
        }
      }
    };

    rowsView.renderCompleted.add(e => {
      var $rowsView = rowsView.element();
      var isFullUpdate = !e || e.changeType === 'refresh';
      var isFocusedViewCorrect = this._focusedView && this._focusedView.name === rowsView.name;
      var needUpdateFocus = false;
      var isAppend = e && (e.changeType === 'append' || e.changeType === 'prepend');
      var $focusedElement = $(':focus');
      var isFocusedElementCorrect = !$focusedElement.length || $focusedElement.closest($rowsView).length;
      eventsEngine.off($rowsView, 'focusin', rowsViewFocusHandler);
      eventsEngine.on($rowsView, 'focusin', rowsViewFocusHandler);

      this._initPointerEventHandler();

      this._initKeyDownHandler();

      this._setRowsViewAttributes();

      if (isFocusedViewCorrect && isFocusedElementCorrect) {
        needUpdateFocus = this._isNeedFocus ? !isAppend : this._isHiddenFocus && isFullUpdate;
        needUpdateFocus && this._updateFocus(true);
      }
    });
  },
  _initDocumentHandlers: function _initDocumentHandlers() {
    var document = domAdapter.getDocument();
    this._documentClickHandler = this.createAction(e => {
      var $target = $(e.event.target);
      var isCurrentRowsViewClick = this._isEventInCurrentGrid(e.event) && $target.closest(".".concat(this.addWidgetPrefix(ROWS_VIEW_CLASS))).length;
      var isEditorOverlay = $target.closest(".".concat(DROPDOWN_EDITOR_OVERLAY_CLASS)).length;
      var columnsResizerController = this.getController('columnsResizer');
      var isColumnResizing = !!columnsResizerController && columnsResizerController.isResizing();

      if (!isCurrentRowsViewClick && !isEditorOverlay && !isColumnResizing) {
        var targetInsideFocusedView = this._focusedView ? $target.parents().filter(this._focusedView.element()).length > 0 : false;
        !targetInsideFocusedView && this._resetFocusedCell(true);

        this._resetFocusedView();
      }
    });
    eventsEngine.on(document, addNamespace(pointerEvents.down, 'dxDataGridKeyboardNavigation'), this._documentClickHandler);
  },
  _setRowsViewAttributes: function _setRowsViewAttributes() {
    var $rowsView = this._getRowsViewElement();

    var isGridEmpty = !this._dataController.getVisibleRows().length;

    if (isGridEmpty) {
      this._applyTabIndexToElement($rowsView);
    }
  },
  _initPointerEventHandler: function _initPointerEventHandler() {
    var pointerEventName = !isMobile() ? pointerEvents.down : clickEventName;
    var clickSelector = ".".concat(ROW_CLASS, " > td, .").concat(ROW_CLASS);

    var $rowsView = this._getRowsViewElement();

    if (!isDefined(this._pointerEventAction)) {
      this._pointerEventAction = this.createAction(this._pointerEventHandler);
    }

    eventsEngine.off($rowsView, addNamespace(pointerEventName, 'dxDataGridKeyboardNavigation'), this._pointerEventAction);
    eventsEngine.on($rowsView, addNamespace(pointerEventName, 'dxDataGridKeyboardNavigation'), clickSelector, this._pointerEventAction);
  },
  _initKeyDownHandler: function _initKeyDownHandler() {
    var $rowsView = this._getRowsViewElement();

    keyboard.off(this._keyDownListener);
    this._keyDownListener = keyboard.on($rowsView, null, e => this._keyDownHandler(e));
  },
  dispose: function dispose() {
    this.callBase();

    this._resetFocusedView();

    keyboard.off(this._keyDownListener);
    eventsEngine.off(domAdapter.getDocument(), addNamespace(pointerEvents.down, 'dxDataGridKeyboardNavigation'), this._documentClickHandler);
    clearTimeout(this._updateFocusTimeout);
    accessibility.unsubscribeVisibilityChange();
  },
  // #endregion Initialization
  // #region Options
  optionChanged: function optionChanged(args) {
    var that = this;

    switch (args.name) {
      case 'keyboardNavigation':
      case 'useLegacyKeyboardNavigation':
        args.handled = true;
        break;

      default:
        that.callBase(args);
    }
  },
  isRowFocusType: function isRowFocusType() {
    return this.focusType === FOCUS_TYPE_ROW;
  },
  isCellFocusType: function isCellFocusType() {
    return this.focusType === FOCUS_TYPE_CELL;
  },
  setRowFocusType: function setRowFocusType() {
    if (this.option('focusedRowEnabled')) {
      this.focusType = FOCUS_TYPE_ROW;
    }
  },
  setCellFocusType: function setCellFocusType() {
    this.focusType = FOCUS_TYPE_CELL;
  },
  // #endregion Options
  // #region Key_Handlers
  _keyDownHandler: function _keyDownHandler(e) {
    var needStopPropagation = true;

    var isHandled = this._processOnKeyDown(e);

    var isEditing = this._editingController.isEditing();

    var originalEvent = e.originalEvent;

    if (originalEvent.isDefaultPrevented()) {
      return;
    }

    this._isNeedFocus = true;
    this._isNeedScroll = true;

    this._updateFocusedCellPositionByTarget(originalEvent.target);

    if (!isHandled) {
      switch (e.keyName) {
        case 'leftArrow':
        case 'rightArrow':
          this._leftRightKeysHandler(e, isEditing);

          isHandled = true;
          break;

        case 'upArrow':
        case 'downArrow':
          if (e.ctrl) {
            accessibility.selectView('rowsView', this, originalEvent);
          } else {
            this._upDownKeysHandler(e, isEditing);
          }

          isHandled = true;
          break;

        case 'pageUp':
        case 'pageDown':
          this._pageUpDownKeyHandler(e);

          isHandled = true;
          break;

        case 'space':
          this._spaceKeyHandler(e, isEditing);

          isHandled = true;
          break;

        case 'A':
          if (isCommandKeyPressed(e.originalEvent)) {
            this._ctrlAKeyHandler(e, isEditing);

            isHandled = true;
          } else {
            isHandled = this._beginFastEditing(e.originalEvent);
          }

          break;

        case 'tab':
          this._tabKeyHandler(e, isEditing);

          isHandled = true;
          break;

        case 'enter':
          this._enterKeyHandler(e, isEditing);

          isHandled = true;
          break;

        case 'escape':
          this._escapeKeyHandler(e, isEditing);

          isHandled = true;
          break;

        case 'F':
          if (isCommandKeyPressed(e.originalEvent)) {
            this._ctrlFKeyHandler(e);

            isHandled = true;
          } else {
            isHandled = this._beginFastEditing(e.originalEvent);
          }

          break;

        case 'F2':
          this._f2KeyHandler();

          isHandled = true;
          break;

        case 'del':
        case 'backspace':
          if (this._isFastEditingAllowed() && !this._isFastEditingStarted()) {
            isHandled = this._beginFastEditing(originalEvent, true);
          }

          break;
      }

      if (!isHandled && !this._beginFastEditing(originalEvent)) {
        this._isNeedFocus = false;
        this._isNeedScroll = false;
        needStopPropagation = false;
      }

      if (needStopPropagation) {
        originalEvent.stopPropagation();
      }
    }
  },
  _processOnKeyDown: function _processOnKeyDown(eventArgs) {
    var originalEvent = eventArgs.originalEvent;
    var args = {
      handled: false,
      event: originalEvent
    };
    this.executeAction('onKeyDown', args);
    eventArgs.ctrl = originalEvent.ctrlKey;
    eventArgs.alt = originalEvent.altKey;
    eventArgs.shift = originalEvent.shiftKey;
    return !!args.handled;
  },
  _closeEditCell: function _closeEditCell() {
    setTimeout(() => {
      this._editingController.closeEditCell();
    });
  },
  _leftRightKeysHandler: function _leftRightKeysHandler(eventArgs, isEditing) {
    var rowIndex = this.getVisibleRowIndex();
    var $event = eventArgs.originalEvent;

    var $row = this._focusedView && this._focusedView.getRow(rowIndex);

    var directionCode = this._getDirectionCodeByKey(eventArgs.keyName);

    var isEditingNavigationMode = this._isFastEditingStarted();

    var allowNavigate = (!isEditing || isEditingNavigationMode) && isDataRow($row);

    if (allowNavigate) {
      this.setCellFocusType();
      isEditingNavigationMode && this._closeEditCell();

      if (this._isVirtualColumnRender()) {
        this._processVirtualHorizontalPosition(directionCode);
      }

      var $cell = this._getNextCell(directionCode);

      if (isElementDefined($cell)) {
        this._arrowKeysHandlerFocusCell($event, $cell, directionCode);
      }

      $event && $event.preventDefault();
    }
  },
  _upDownKeysHandler: function _upDownKeysHandler(eventArgs, isEditing) {
    var rowIndex = this._focusedCellPosition.rowIndex;
    var visibleRowIndex = this.getVisibleRowIndex();

    var $row = this._focusedView && this._focusedView.getRow(visibleRowIndex);

    var $event = eventArgs.originalEvent;
    var isUpArrow = eventArgs.keyName === 'upArrow';

    var dataSource = this._dataController.dataSource();

    var isEditingNavigationMode = this._isFastEditingStarted();

    var allowNavigate = (!isEditing || isEditingNavigationMode) && $row && !isDetailRow($row);

    if (allowNavigate) {
      isEditingNavigationMode && this._closeEditCell();

      if (!this._navigateNextCell($event, eventArgs.keyName)) {
        if (this._isVirtualRowRender() && isUpArrow && dataSource && !dataSource.isLoading()) {
          var rowHeight = getOuterHeight($row);
          rowIndex = this._focusedCellPosition.rowIndex - 1;

          this._scrollBy(0, -rowHeight, rowIndex, $event);
        }
      }

      $event && $event.preventDefault();
    }
  },
  _pageUpDownKeyHandler: function _pageUpDownKeyHandler(eventArgs) {
    var pageIndex = this._dataController.pageIndex();

    var pageCount = this._dataController.pageCount();

    var pagingEnabled = this.option('paging.enabled');
    var isPageUp = eventArgs.keyName === 'pageUp';
    var pageStep = isPageUp ? -1 : 1;
    var scrollable = this.getView('rowsView').getScrollable();

    if (pagingEnabled && !this._isVirtualScrolling()) {
      if ((isPageUp ? pageIndex > 0 : pageIndex < pageCount - 1) && !this._isVirtualScrolling()) {
        this._dataController.pageIndex(pageIndex + pageStep);

        eventArgs.originalEvent.preventDefault();
      }
    } else if (scrollable && getHeight(scrollable.container()) < getHeight(scrollable.$content())) {
      this._scrollBy(0, getHeight(scrollable.container()) * pageStep);

      eventArgs.originalEvent.preventDefault();
    }
  },
  _spaceKeyHandler: function _spaceKeyHandler(eventArgs, isEditing) {
    var rowIndex = this.getVisibleRowIndex();
    var $target = $(eventArgs.originalEvent && eventArgs.originalEvent.target);

    if (this.option('selection') && this.option('selection').mode !== 'none' && !isEditing) {
      var isFocusedRowElement = this._getElementType($target) === 'row' && this.isRowFocusType() && isDataRow($target);
      var isFocusedSelectionCell = $target.hasClass(COMMAND_SELECT_CLASS);

      if (isFocusedSelectionCell && this.option('selection.showCheckBoxesMode') === 'onClick') {
        this._selectionController.startSelectionWithCheckboxes();
      }

      if (isFocusedRowElement || $target.parent().hasClass(DATA_ROW_CLASS) || $target.hasClass(this.addWidgetPrefix(ROWS_VIEW_CLASS))) {
        this._selectionController.changeItemSelection(rowIndex, {
          shift: eventArgs.shift,
          control: eventArgs.ctrl
        });

        eventArgs.originalEvent.preventDefault();
      }
    } else {
      this._beginFastEditing(eventArgs.originalEvent);
    }
  },
  _ctrlAKeyHandler: function _ctrlAKeyHandler(eventArgs, isEditing) {
    if (!isEditing && !eventArgs.alt && this.option('selection.mode') === 'multiple' && this.option('selection.allowSelectAll')) {
      this._selectionController.selectAll();

      eventArgs.originalEvent.preventDefault();
    }
  },
  _tabKeyHandler: function _tabKeyHandler(eventArgs, isEditing) {
    var editingOptions = this.option('editing');
    var direction = eventArgs.shift ? 'previous' : 'next';
    var isCellPositionDefined = isDefined(this._focusedCellPosition) && !isEmptyObject(this._focusedCellPosition);

    var isOriginalHandlerRequired = !isCellPositionDefined || !eventArgs.shift && this._isLastValidCell(this._focusedCellPosition) || eventArgs.shift && this._isFirstValidCell(this._focusedCellPosition);

    var eventTarget = eventArgs.originalEvent.target;

    var focusedViewElement = this._focusedView && this._focusedView.element();

    if (this._handleTabKeyOnMasterDetailCell(eventTarget, direction)) {
      return;
    }

    $(focusedViewElement).addClass(FOCUS_STATE_CLASS);

    if (editingOptions && eventTarget && !isOriginalHandlerRequired) {
      if ($(eventTarget).hasClass(this.addWidgetPrefix(ROWS_VIEW_CLASS))) {
        this._resetFocusedCell();
      }

      if (this._isVirtualColumnRender()) {
        this._processVirtualHorizontalPosition(direction);
      }

      if (isEditing) {
        if (!this._editingCellTabHandler(eventArgs, direction)) {
          return;
        }
      } else {
        if (this._targetCellTabHandler(eventArgs, direction)) {
          isOriginalHandlerRequired = true;
        }
      }
    }

    if (isOriginalHandlerRequired) {
      this._editorFactory.loseFocus();

      if (this._editingController.isEditing() && !this._isRowEditMode()) {
        this._resetFocusedCell(true);

        this._resetFocusedView();

        this._closeEditCell();
      }
    } else {
      eventArgs.originalEvent.preventDefault();
    }
  },
  _getMaxHorizontalOffset: function _getMaxHorizontalOffset() {
    var scrollable = this.component.getScrollable();
    var rowsView = this.getView('rowsView');
    var offset = scrollable ? scrollable.scrollWidth() - getWidth(rowsView.element()) : 0;
    return offset;
  },
  _isColumnRendered: function _isColumnRendered(columnIndex) {
    var allVisibleColumns = this._columnsController.getVisibleColumns(null, true);

    var renderedVisibleColumns = this._columnsController.getVisibleColumns();

    var column = allVisibleColumns[columnIndex];
    var result = false;

    if (column) {
      result = renderedVisibleColumns.indexOf(column) >= 0;
    }

    return result;
  },
  _isFixedColumn: function _isFixedColumn(columnIndex) {
    var allVisibleColumns = this._columnsController.getVisibleColumns(null, true);

    var column = allVisibleColumns[columnIndex];
    return !!column && !!column.fixed;
  },
  _isColumnVirtual: function _isColumnVirtual(columnIndex) {
    var localColumnIndex = columnIndex - this._columnsController.getColumnIndexOffset();

    var visibleColumns = this._columnsController.getVisibleColumns();

    var column = visibleColumns[localColumnIndex];
    return !!column && column.command === 'virtual';
  },
  _processVirtualHorizontalPosition: function _processVirtualHorizontalPosition(direction) {
    var scrollable = this.component.getScrollable();
    var columnIndex = this.getColumnIndex();
    var nextColumnIndex;
    var horizontalScrollPosition = 0;
    var needToScroll = false;

    switch (direction) {
      case 'next':
      case 'nextInRow':
        {
          var columnsCount = this._getVisibleColumnCount();

          nextColumnIndex = columnIndex + 1;
          horizontalScrollPosition = this.option('rtlEnabled') ? this._getMaxHorizontalOffset() : 0;

          if (direction === 'next') {
            needToScroll = columnsCount === nextColumnIndex || this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex);
          } else {
            needToScroll = columnsCount > nextColumnIndex && this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex);
          }

          break;
        }

      case 'previous':
      case 'previousInRow':
        {
          nextColumnIndex = columnIndex - 1;
          horizontalScrollPosition = this.option('rtlEnabled') ? 0 : this._getMaxHorizontalOffset();

          if (direction === 'previous') {
            var columnIndexOffset = this._columnsController.getColumnIndexOffset();

            var leftEdgePosition = nextColumnIndex < 0 && columnIndexOffset === 0;
            needToScroll = leftEdgePosition || this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex);
          } else {
            needToScroll = nextColumnIndex >= 0 && this._isFixedColumn(columnIndex) && !this._isColumnRendered(nextColumnIndex);
          }

          break;
        }
    }

    if (needToScroll) {
      scrollable.scrollTo({
        left: horizontalScrollPosition
      });
    } else if (isDefined(nextColumnIndex) && isDefined(direction) && this._isColumnVirtual(nextColumnIndex)) {
      horizontalScrollPosition = this._getHorizontalScrollPositionOffset(direction);
      horizontalScrollPosition !== 0 && scrollable.scrollBy({
        left: horizontalScrollPosition,
        top: 0
      });
    }
  },
  _getHorizontalScrollPositionOffset: function _getHorizontalScrollPositionOffset(direction) {
    var positionOffset = 0;

    var $currentCell = this._getCell(this._focusedCellPosition);

    var currentCellWidth = $currentCell && getOuterWidth($currentCell);

    if (currentCellWidth > 0) {
      var rtlMultiplier = this.option('rtlEnabled') ? -1 : 1;
      positionOffset = direction === 'nextInRow' || direction === 'next' ? currentCellWidth * rtlMultiplier : currentCellWidth * rtlMultiplier * -1;
    }

    return positionOffset;
  },
  _editingCellTabHandler: function _editingCellTabHandler(eventArgs, direction) {
    var eventTarget = eventArgs.originalEvent.target;

    var $cell = this._getCellElementFromTarget(eventTarget);

    var isEditingAllowed;
    var $event = eventArgs.originalEvent;

    var elementType = this._getElementType(eventTarget);

    if ($cell.is(COMMAND_CELL_SELECTOR)) {
      return !this._targetCellTabHandler(eventArgs, direction);
    }

    this._updateFocusedCellPosition($cell);

    var nextCellInfo = this._getNextCellByTabKey($event, direction, elementType);

    $cell = nextCellInfo.$cell;

    if (!$cell || this._handleTabKeyOnMasterDetailCell($cell, direction)) {
      return false;
    }

    var columnsController = this._columnsController;
    var cellIndex = this.getView('rowsView').getCellIndex($cell);
    var columnIndex = cellIndex + columnsController.getColumnIndexOffset();
    var column = columnsController.getVisibleColumns(null, true)[columnIndex];
    var $row = $cell.parent();

    var rowIndex = this._getRowIndex($row);

    var row = this._dataController.items()[rowIndex];

    var editingController = this._editingController;

    if (column && column.allowEditing) {
      var _isDataRow = !row || row.rowType === 'data';

      isEditingAllowed = editingController.allowUpdating({
        row: row
      }) ? _isDataRow : row && row.isNewRow;
    }

    if (!isEditingAllowed) {
      this._closeEditCell();
    }

    if (this._focusCell($cell, !nextCellInfo.isHighlighted)) {
      if (!this._isRowEditMode() && isEditingAllowed) {
        this._editFocusedCell();
      } else {
        this._focusInteractiveElement($cell, eventArgs.shift);
      }
    }

    return true;
  },
  _targetCellTabHandler: function _targetCellTabHandler(eventArgs, direction) {
    var $event = eventArgs.originalEvent;
    var eventTarget = $event.target;

    var $cell = this._getCellElementFromTarget(eventTarget);

    var $lastInteractiveElement = this._getInteractiveElement($cell, !eventArgs.shift);

    var isOriginalHandlerRequired = false;
    var elementType;

    if (!isEditorCell(this, $cell) && $lastInteractiveElement.length && eventTarget !== $lastInteractiveElement.get(0)) {
      isOriginalHandlerRequired = true;
    } else {
      if (this._focusedCellPosition.rowIndex === undefined && $(eventTarget).hasClass(ROW_CLASS)) {
        this._updateFocusedCellPosition($cell);
      }

      elementType = this._getElementType(eventTarget);

      if (this.isRowFocusType()) {
        this.setCellFocusType();

        if (elementType === 'row' && isDataRow($(eventTarget))) {
          eventTarget = this.getFirstValidCellInRow($(eventTarget));
          elementType = this._getElementType(eventTarget);
        }
      }

      var nextCellInfo = this._getNextCellByTabKey($event, direction, elementType);

      $cell = nextCellInfo.$cell;

      if (!$cell) {
        return false;
      }

      $cell = this._checkNewLineTransition($event, $cell);

      if (!$cell) {
        return false;
      }

      this._focusCell($cell, !nextCellInfo.isHighlighted);

      if (!isEditorCell(this, $cell)) {
        this._focusInteractiveElement($cell, eventArgs.shift);
      }
    }

    return isOriginalHandlerRequired;
  },
  _getNextCellByTabKey: function _getNextCellByTabKey($event, direction, elementType) {
    var $cell = this._getNextCell(direction, elementType);

    var args = $cell && this._fireFocusedCellChanging($event, $cell, true);

    if (!args || args.cancel) {
      return {};
    }

    if (args.$newCellElement) {
      $cell = args.$newCellElement;
    }

    return {
      $cell,
      isHighlighted: args.isHighlighted
    };
  },
  _checkNewLineTransition: function _checkNewLineTransition($event, $cell) {
    var rowIndex = this.getVisibleRowIndex();
    var $row = $cell.parent();

    if (rowIndex !== this._getRowIndex($row)) {
      var cellPosition = this._getCellPosition($cell);

      var args = this._fireFocusedRowChanging($event, $row);

      if (args.cancel) {
        return;
      }

      if (args.rowIndexChanged) {
        this.setFocusedColumnIndex(cellPosition.columnIndex);
        $cell = this._getFocusedCell();
      }
    }

    return $cell;
  },
  _enterKeyHandler: function _enterKeyHandler(eventArgs, isEditing) {
    var $cell = this._getFocusedCell();

    var rowIndex = this.getVisibleRowIndex();

    var $row = this._focusedView && this._focusedView.getRow(rowIndex);

    if (this.option('grouping.allowCollapsing') && isGroupRow($row) || this.option('masterDetail.enabled') && $cell && $cell.hasClass(COMMAND_EXPAND_CLASS)) {
      var key = this._dataController.getKeyByRowIndex(rowIndex);

      var item = this._dataController.items()[rowIndex];

      if (key !== undefined && item && item.data && !item.data.isContinuation) {
        this._dataController.changeRowExpand(key);
      }
    } else {
      this._processEnterKeyForDataCell(eventArgs, isEditing);
    }
  },
  _processEnterKeyForDataCell: function _processEnterKeyForDataCell(eventArgs, isEditing) {
    var direction = this._getEnterKeyDirection(eventArgs);

    var allowEditingOnEnterKey = this._allowEditingOnEnterKey();

    if (isEditing || !allowEditingOnEnterKey && direction) {
      this._handleEnterKeyEditingCell(eventArgs.originalEvent);

      if (direction === 'next' || direction === 'previous') {
        this._targetCellTabHandler(eventArgs, direction);
      } else if (direction === 'upArrow' || direction === 'downArrow') {
        this._navigateNextCell(eventArgs.originalEvent, direction);
      }
    } else if (allowEditingOnEnterKey) {
      this._startEditing(eventArgs);
    }
  },
  _getEnterKeyDirection: function _getEnterKeyDirection(eventArgs) {
    var enterKeyDirection = this.option('keyboardNavigation.enterKeyDirection');
    var isShift = eventArgs.shift;

    if (enterKeyDirection === 'column') {
      return isShift ? 'upArrow' : 'downArrow';
    }

    if (enterKeyDirection === 'row') {
      return isShift ? 'previous' : 'next';
    }
  },
  _handleEnterKeyEditingCell: function _handleEnterKeyEditingCell(event) {
    var target = event.target;

    var $cell = this._getCellElementFromTarget(target);

    var isRowEditMode = this._isRowEditMode();

    this._updateFocusedCellPosition($cell);

    if (isRowEditMode) {
      this._focusEditFormCell($cell);

      setTimeout(this._editingController.saveEditData.bind(this._editingController));
    } else {
      eventsEngine.trigger($(target), 'change');

      this._closeEditCell();

      event.preventDefault();
    }
  },
  _escapeKeyHandler: function _escapeKeyHandler(eventArgs, isEditing) {
    var $cell = this._getCellElementFromTarget(eventArgs.originalEvent.target);

    if (isEditing) {
      this._updateFocusedCellPosition($cell);

      if (!this._isRowEditMode()) {
        if (this._editingController.getEditMode() === 'cell') {
          this._editingController.cancelEditData();
        } else {
          this._closeEditCell();
        }
      } else {
        this._focusEditFormCell($cell);

        this._editingController.cancelEditData();

        if (this._dataController.items().length === 0) {
          this._resetFocusedCell();

          this._editorFactory.loseFocus();
        }
      }

      eventArgs.originalEvent.preventDefault();
    }
  },
  _ctrlFKeyHandler: function _ctrlFKeyHandler(eventArgs) {
    if (this.option('searchPanel.visible')) {
      var searchTextEditor = this._headerPanel.getSearchTextEditor();

      if (searchTextEditor) {
        searchTextEditor.focus();
        eventArgs.originalEvent.preventDefault();
      }
    }
  },
  _f2KeyHandler: function _f2KeyHandler() {
    var isEditing = this._editingController.isEditing();

    var rowIndex = this.getVisibleRowIndex();

    var $row = this._focusedView && this._focusedView.getRow(rowIndex);

    if (!isEditing && isDataRow($row)) {
      this._startEditing();
    }
  },
  _navigateNextCell: function _navigateNextCell($event, keyCode) {
    var $cell = this._getNextCell(keyCode);

    var directionCode = this._getDirectionCodeByKey(keyCode);

    var isCellValid = $cell && this._isCellValid($cell);

    var result = isCellValid ? this._arrowKeysHandlerFocusCell($event, $cell, directionCode) : false;
    return result;
  },
  _arrowKeysHandlerFocusCell: function _arrowKeysHandlerFocusCell($event, $nextCell, direction) {
    var isVerticalDirection = direction === 'prevRow' || direction === 'nextRow';

    var args = this._fireFocusChangingEvents($event, $nextCell, isVerticalDirection, true);

    $nextCell = args.$newCellElement;

    if (!args.cancel && this._isCellValid($nextCell)) {
      this._focus($nextCell, !args.isHighlighted);

      return true;
    }

    return false;
  },
  _beginFastEditing: function _beginFastEditing(originalEvent, isDeleting) {
    if (!this._isFastEditingAllowed() || originalEvent.altKey || originalEvent.ctrlKey || this._editingController.isEditing()) {
      return false;
    }

    if (isDeleting) {
      this._startEditing(originalEvent, FAST_EDITING_DELETE_KEY);
    } else {
      var key = originalEvent.key;
      var keyCode = originalEvent.keyCode || originalEvent.which;
      var fastEditingKey = key || keyCode && String.fromCharCode(keyCode);

      if (fastEditingKey && (fastEditingKey.length === 1 || fastEditingKey === FAST_EDITING_DELETE_KEY)) {
        this._startEditing(originalEvent, fastEditingKey);
      }
    }

    return true;
  },
  // #endregion Key_Handlers
  // #region Pointer_Event_Handler
  _pointerEventHandler: function _pointerEventHandler(e) {
    var event = e.event || e;
    var $target = $(event.currentTarget);
    var rowsView = this.getView('rowsView');
    var focusedViewElement = rowsView && rowsView.element();
    var $parent = $target.parent();
    var isInteractiveElement = $(event.target).is(INTERACTIVE_ELEMENTS_SELECTOR);
    var isRevertButton = !!$(event.target).closest(".".concat(REVERT_BUTTON_CLASS)).length;
    var isExpandCommandCell = $target.hasClass(COMMAND_EXPAND_CLASS);

    if (!this._isEventInCurrentGrid(event)) {
      return;
    }

    if (!isRevertButton && (this._isCellValid($target, !isInteractiveElement) || isExpandCommandCell)) {
      $target = this._isInsideEditForm($target) ? $(event.target) : $target;

      this._focusView();

      $(focusedViewElement).removeClass(FOCUS_STATE_CLASS);

      if ($parent.hasClass(FREESPACE_ROW_CLASS)) {
        this._updateFocusedCellPosition($target);

        this._applyTabIndexToElement(this._focusedView.element());

        this._focusedView.focus();
      } else if (!this._isMasterDetailCell($target)) {
        this._clickTargetCellHandler(event, $target);
      } else {
        this._updateFocusedCellPosition($target);
      }
    } else if ($target.is('td')) {
      this._resetFocusedCell();
    }
  },
  _clickTargetCellHandler: function _clickTargetCellHandler(event, $cell) {
    var columnIndex = this.getView('rowsView').getCellIndex($cell);

    var column = this._columnsController.getVisibleColumns()[columnIndex];

    var isCellEditMode = this._isCellEditMode();

    this.setCellFocusType();

    var args = this._fireFocusChangingEvents(event, $cell, true);

    $cell = args.$newCellElement;

    if (!args.cancel) {
      if (args.resetFocusedRow) {
        this.getController('focus')._resetFocusedRow();

        return;
      }

      if (args.rowIndexChanged) {
        $cell = this._getFocusedCell();
      }

      if (!args.isHighlighted && !isCellEditMode) {
        this.setRowFocusType();
      }

      this._updateFocusedCellPosition($cell);

      if (this._allowRowUpdating() && isCellEditMode && column && column.allowEditing) {
        this._isNeedFocus = false;
        this._isHiddenFocus = false;
      } else {
        var $target = event && $(event.target).closest(NON_FOCUSABLE_ELEMENTS_SELECTOR + ', td');
        var skipFocusEvent = $target && $target.not($cell).is(NON_FOCUSABLE_ELEMENTS_SELECTOR);
        var isEditor = !!column && !column.command && $cell.hasClass(EDITOR_CELL_CLASS);
        var isDisabled = !isEditor && (!args.isHighlighted || skipFocusEvent);

        this._focus($cell, isDisabled, skipFocusEvent);
      }
    } else {
      this.setRowFocusType();
      this.setFocusedRowIndex(args.prevRowIndex);
      $cell = this._getFocusedCell();

      if (this._editingController.isEditing() && isCellEditMode) {
        this._closeEditCell();
      }
    }
  },
  _allowRowUpdating: function _allowRowUpdating() {
    var rowIndex = this.getVisibleRowIndex();

    var row = this._dataController.items()[rowIndex];

    return this._editingController.allowUpdating({
      row: row
    }, 'click');
  },
  // #endregion Pointer_Event_Handler
  // #region Focusing
  focus: function focus(element) {
    var activeElementSelector;
    var focusedRowEnabled = this.option('focusedRowEnabled');
    var isHighlighted = isCellElement($(element));

    if (!element) {
      activeElementSelector = '.dx-datagrid-rowsview .dx-row[tabindex]';

      if (!focusedRowEnabled) {
        activeElementSelector += ', .dx-datagrid-rowsview .dx-row > td[tabindex]';
      }

      element = this.component.$element().find(activeElementSelector).first();
    }

    element && this._focusElement($(element), isHighlighted);
  },
  getFocusedView: function getFocusedView() {
    return this._focusedView;
  },
  setupFocusedView: function setupFocusedView() {
    if (this.isKeyboardEnabled() && !isDefined(this._focusedView)) {
      this._focusView();
    }
  },
  _focusElement: function _focusElement($element, isHighlighted) {
    var rowsViewElement = $(this._getRowsViewElement());
    var $focusedView = $element.closest(rowsViewElement);
    var isRowFocusType = this.isRowFocusType();
    var args = {};

    if (!$focusedView.length || isCellElement($element) && !this._isCellValid($element)) {
      return;
    }

    this._focusView();

    this._isNeedFocus = true;
    this._isNeedScroll = true;

    if (isCellElement($element) || isGroupRow($element)) {
      this.setCellFocusType();
      args = this._fireFocusChangingEvents(null, $element, false, isHighlighted);
      $element = args.$newCellElement;

      if (isRowFocusType && !args.isHighlighted) {
        this.setRowFocusType();
      }
    }

    if (!args.cancel) {
      this._focus($element, !args.isHighlighted);

      this._focusInteractiveElement($element);
    }
  },
  _getFocusedViewByElement: function _getFocusedViewByElement($element) {
    var view = this.getFocusedView();
    var $view = view && $(view.element());
    return $element && $element.closest($view).length !== 0;
  },
  _focusView: function _focusView() {
    this._focusedView = this.getView('rowsView');
  },
  _resetFocusedView: function _resetFocusedView() {
    this.setRowFocusType();
    this._focusedView = null;
  },
  _focusInteractiveElement: function _focusInteractiveElement($cell, isLast) {
    if (!$cell) return;

    var $focusedElement = this._getInteractiveElement($cell, isLast);

    gridCoreUtils.focusAndSelectElement(this, $focusedElement);
  },
  _focus: function _focus($cell, disableFocus, skipFocusEvent) {
    var $row = $cell && !$cell.hasClass(ROW_CLASS) ? $cell.closest(".".concat(ROW_CLASS)) : $cell;

    if ($row && isNotFocusedRow($row)) {
      return;
    }

    var focusedView = this._focusedView;
    var $focusViewElement = focusedView && focusedView.element();
    var $focusElement;
    this._isHiddenFocus = disableFocus;
    var isRowFocus = isGroupRow($row) || this.isRowFocusType();

    if (isRowFocus) {
      $focusElement = $row;

      if (focusedView) {
        this.setFocusedRowIndex(this._getRowIndex($row));
      }
    } else if (isCellElement($cell)) {
      $focusElement = $cell;

      this._updateFocusedCellPosition($cell);
    }

    if ($focusElement) {
      if ($focusViewElement) {
        $focusViewElement.find('.dx-row[tabindex], .dx-row > td[tabindex]').not($focusElement).removeClass(CELL_FOCUS_DISABLED_CLASS).removeAttr('tabindex');
      }

      eventsEngine.one($focusElement, 'blur', e => {
        if (e.relatedTarget) {
          $focusElement.removeClass(CELL_FOCUS_DISABLED_CLASS);
        }
      });

      if (!skipFocusEvent) {
        this._applyTabIndexToElement($focusElement);

        eventsEngine.trigger($focusElement, 'focus');
      }

      if (disableFocus) {
        $focusElement.addClass(CELL_FOCUS_DISABLED_CLASS);

        if (isRowFocus) {
          $cell.addClass(CELL_FOCUS_DISABLED_CLASS);
        }
      } else {
        this._editorFactory.focus($focusElement);
      }
    }
  },
  _updateFocus: function _updateFocus(isRenderView) {
    this._updateFocusTimeout = setTimeout(() => {
      var editingController = this._editingController;
      var isCellEditMode = editingController.getEditMode() === EDIT_MODE_CELL;
      var isBatchEditMode = editingController.getEditMode() === EDIT_MODE_BATCH;

      if (isCellEditMode && editingController.hasChanges() || isBatchEditMode && editingController.isNewRowInEditMode()) {
        editingController._focusEditingCell();

        return;
      }

      var $cell = this._getFocusedCell();

      var isEditing = editingController.isEditing();

      if ($cell && !(this._isMasterDetailCell($cell) && !this._isRowEditMode())) {
        if (this._hasSkipRow($cell.parent())) {
          var direction = this._focusedCellPosition && this._focusedCellPosition.rowIndex > 0 ? 'upArrow' : 'downArrow';
          $cell = this._getNextCell(direction);
        }

        if (isElementDefined($cell)) {
          if (isRenderView && !isEditing && this._checkCellOverlapped($cell)) {
            return;
          }

          if ($cell.is('td') || $cell.hasClass(this.addWidgetPrefix(EDIT_FORM_ITEM_CLASS))) {
            var isCommandCell = $cell.is(COMMAND_CELL_SELECTOR);
            var $focusedElementInsideCell = $cell.find(':focus');
            var isFocusedElementDefined = isElementDefined($focusedElementInsideCell);

            if ((isRenderView || !isCommandCell) && this._editorFactory.focus()) {
              if (isCommandCell && isFocusedElementDefined) {
                gridCoreUtils.focusAndSelectElement(this, $focusedElementInsideCell);
                return;
              }

              !isFocusedElementDefined && this._focus($cell);
            } else if (!isFocusedElementDefined && (this._isNeedFocus || this._isHiddenFocus)) {
              this._focus($cell, this._isHiddenFocus);
            }

            if (isEditing) {
              this._focusInteractiveElement.bind(this)($cell);
            }
          } else {
            eventsEngine.trigger($cell, 'focus');
          }
        }
      }
    });
  },
  _checkCellOverlapped: function _checkCellOverlapped($cell) {
    var cellOffset = $cell.offset();
    var hasScrollable = this.component.getScrollable && this.component.getScrollable();
    var isOverlapped = false;

    if (hasScrollable) {
      if (cellOffset.left < 0) {
        isOverlapped = getWidth($cell) + cellOffset.left <= 0;
      } else if (cellOffset.top < 0) {
        isOverlapped = getHeight($cell) + cellOffset.top <= 0;
      }
    }

    return isOverlapped;
  },
  _getFocusedCell: function _getFocusedCell() {
    return $(this._getCell(this._focusedCellPosition));
  },
  _updateFocusedCellPositionByTarget: function _updateFocusedCellPositionByTarget(target) {
    var _this$_focusedCellPos;

    var elementType = this._getElementType(target);

    if (elementType === 'row' && isDefined((_this$_focusedCellPos = this._focusedCellPosition) === null || _this$_focusedCellPos === void 0 ? void 0 : _this$_focusedCellPos.columnIndex)) {
      var $row = $(target);
      this._focusedView && isGroupRow($row) && this.setFocusedRowIndex(this._getRowIndex($row));
    } else {
      this._updateFocusedCellPosition(this._getCellElementFromTarget(target));
    }
  },
  _updateFocusedCellPosition: function _updateFocusedCellPosition($cell, direction) {
    var position = this._getCellPosition($cell, direction);

    if (position) {
      if (!$cell.length || position.rowIndex >= 0 && position.columnIndex >= 0) {
        this.setFocusedCellPosition(position.rowIndex, position.columnIndex);
      }
    }

    return position;
  },
  _getFocusedColumnIndexOffset: function _getFocusedColumnIndexOffset(columnIndex) {
    var offset = 0;

    var column = this._columnsController.getVisibleColumns()[columnIndex];

    if (column && column.fixed) {
      offset = this._getFixedColumnIndexOffset(column);
    } else if (columnIndex >= 0) {
      offset = this._columnsController.getColumnIndexOffset();
    }

    return offset;
  },
  _getFixedColumnIndexOffset: function _getFixedColumnIndexOffset(column) {
    var offset = isFixedColumnIndexOffsetRequired(this, column) ? this._getVisibleColumnCount() - this._columnsController.getVisibleColumns().length : 0;
    return offset;
  },
  _getCellPosition: function _getCellPosition($cell, direction) {
    var columnIndex;
    var $row = isElementDefined($cell) && $cell.closest('tr');
    var rowsView = this.getView('rowsView');

    if (isElementDefined($row)) {
      var rowIndex = this._getRowIndex($row);

      columnIndex = rowsView.getCellIndex($cell, rowIndex);
      columnIndex += this._getFocusedColumnIndexOffset(columnIndex);

      if (direction) {
        columnIndex = direction === 'previous' ? columnIndex - 1 : columnIndex + 1;
        columnIndex = this._applyColumnIndexBoundaries(columnIndex);
      }

      return {
        rowIndex: rowIndex,
        columnIndex: columnIndex
      };
    }
  },
  _focusCell: function _focusCell($cell, isDisabled) {
    if (this._isCellValid($cell)) {
      this._focus($cell, isDisabled);

      return true;
    }
  },
  _focusEditFormCell: function _focusEditFormCell($cell) {
    if ($cell.hasClass(MASTER_DETAIL_CELL_CLASS)) {
      this._editorFactory.focus($cell, true);
    }
  },
  _resetFocusedCell: function _resetFocusedCell(preventScroll) {
    var _this$_focusedView;

    var $cell = this._getFocusedCell();

    isElementDefined($cell) && $cell.removeAttr('tabindex');
    this._isNeedFocus = false;
    this._isNeedScroll = false;
    this._focusedCellPosition = {};
    clearTimeout(this._updateFocusTimeout);
    (_this$_focusedView = this._focusedView) === null || _this$_focusedView === void 0 ? void 0 : _this$_focusedView.renderFocusState({
      preventScroll
    });
  },
  restoreFocusableElement: function restoreFocusableElement(rowIndex, $event) {
    var that = this;
    var args;
    var $rowElement;
    var isUpArrow = isDefined(rowIndex);
    var rowsView = that.getView('rowsView');
    var $rowsViewElement = rowsView.element();
    var columnIndex = that._focusedCellPosition.columnIndex;

    var rowIndexOffset = that._dataController.getRowIndexOffset();

    rowIndex = isUpArrow ? rowIndex : rowsView.getTopVisibleItemIndex() + rowIndexOffset;

    if (!isUpArrow) {
      that._editorFactory.loseFocus();

      that._applyTabIndexToElement($rowsViewElement);

      eventsEngine.trigger($rowsViewElement, 'focus');
    } else {
      $rowElement = rowsView.getRow(rowIndex - rowIndexOffset);
      args = that._fireFocusedRowChanging($event, $rowElement);

      if (!args.cancel && args.rowIndexChanged) {
        rowIndex = args.newRowIndex;
      }
    }

    if (!isUpArrow || !args.cancel) {
      that.setFocusedCellPosition(rowIndex, columnIndex);
    }

    isUpArrow && that._updateFocus();
  },
  // #endregion Focusing
  // #region Cell_Position
  _getNewPositionByCode: function _getNewPositionByCode(cellPosition, elementType, code) {
    var columnIndex = cellPosition.columnIndex;
    var rowIndex = cellPosition.rowIndex;
    var visibleColumnsCount;

    if (cellPosition.rowIndex === undefined && code === 'next') {
      return {
        columnIndex: 0,
        rowIndex: 0
      };
    }

    switch (code) {
      case 'nextInRow':
      case 'next':
        visibleColumnsCount = this._getVisibleColumnCount();

        if (columnIndex < visibleColumnsCount - 1 && elementType !== 'row' && this._hasValidCellAfterPosition({
          columnIndex: columnIndex,
          rowIndex: rowIndex
        })) {
          columnIndex++;
        } else if (!this._isLastRow(rowIndex) && code === 'next') {
          columnIndex = 0;
          rowIndex++;
        }

        break;

      case 'previousInRow':
      case 'previous':
        if (columnIndex > 0 && elementType !== 'row' && this._hasValidCellBeforePosition({
          columnIndex: columnIndex,
          rowIndex: rowIndex
        })) {
          columnIndex--;
        } else if (rowIndex > 0 && code === 'previous') {
          rowIndex--;
          visibleColumnsCount = this._getVisibleColumnCount();
          columnIndex = visibleColumnsCount - 1;
        }

        break;

      case 'upArrow':
        rowIndex = rowIndex > 0 ? rowIndex - 1 : rowIndex;
        break;

      case 'downArrow':
        rowIndex = !this._isLastRow(rowIndex) ? rowIndex + 1 : rowIndex;
        break;
    }

    return {
      columnIndex: columnIndex,
      rowIndex: rowIndex
    };
  },
  setFocusedCellPosition: function setFocusedCellPosition(rowIndex, columnIndex) {
    this.setFocusedRowIndex(rowIndex);
    this.setFocusedColumnIndex(columnIndex);
  },
  setFocusedRowIndex: function setFocusedRowIndex(rowIndex) {
    if (!this._focusedCellPosition) {
      this._focusedCellPosition = {};
    }

    this._focusedCellPosition.rowIndex = rowIndex;
  },
  setFocusedColumnIndex: function setFocusedColumnIndex(columnIndex) {
    if (!this._focusedCellPosition) {
      this._focusedCellPosition = {};
    }

    this._focusedCellPosition.columnIndex = columnIndex;
  },
  getRowIndex: function getRowIndex() {
    return this._focusedCellPosition ? this._focusedCellPosition.rowIndex : -1;
  },
  getColumnIndex: function getColumnIndex() {
    return this._focusedCellPosition ? this._focusedCellPosition.columnIndex : -1;
  },
  getVisibleRowIndex: function getVisibleRowIndex() {
    var rowIndex = this._focusedCellPosition && this._focusedCellPosition.rowIndex;

    if (!isDefined(rowIndex) || rowIndex < 0) {
      return -1;
    }

    return rowIndex - this._dataController.getRowIndexOffset();
  },
  getVisibleColumnIndex: function getVisibleColumnIndex() {
    var columnIndex = this._focusedCellPosition && this._focusedCellPosition.columnIndex;

    if (!isDefined(columnIndex)) {
      return -1;
    }

    return columnIndex - this._columnsController.getColumnIndexOffset();
  },
  _applyColumnIndexBoundaries: function _applyColumnIndexBoundaries(columnIndex) {
    var visibleColumnsCount = this._getVisibleColumnCount();

    if (columnIndex < 0) {
      columnIndex = 0;
    } else if (columnIndex >= visibleColumnsCount) {
      columnIndex = visibleColumnsCount - 1;
    }

    return columnIndex;
  },
  _isCellByPositionValid: function _isCellByPositionValid(cellPosition) {
    var $cell = $(this._getCell(cellPosition));
    return this._isCellValid($cell);
  },
  _isLastRow: function _isLastRow(rowIndex) {
    var dataController = this._dataController;

    if (this._isVirtualRowRender()) {
      return rowIndex >= dataController.getMaxRowIndex();
    }

    return rowIndex === dataController.items().length - 1;
  },
  _isFirstValidCell: function _isFirstValidCell(cellPosition) {
    var isFirstValidCell = false;

    if (cellPosition.rowIndex === 0 && cellPosition.columnIndex >= 0) {
      isFirstValidCell = isFirstValidCell || !this._hasValidCellBeforePosition(cellPosition);
    }

    return isFirstValidCell;
  },
  _hasValidCellBeforePosition: function _hasValidCellBeforePosition(cellPosition) {
    var columnIndex = cellPosition.columnIndex;
    var hasValidCells = false;

    while (columnIndex > 0 && !hasValidCells) {
      var checkingPosition = {
        columnIndex: --columnIndex,
        rowIndex: cellPosition.rowIndex
      };
      hasValidCells = this._isCellByPositionValid(checkingPosition);
    }

    return hasValidCells;
  },
  _hasValidCellAfterPosition: function _hasValidCellAfterPosition(cellPosition) {
    var columnIndex = cellPosition.columnIndex;
    var hasValidCells = false;

    var visibleColumnCount = this._getVisibleColumnCount();

    while (columnIndex < visibleColumnCount - 1 && !hasValidCells) {
      var checkingPosition = {
        columnIndex: ++columnIndex,
        rowIndex: cellPosition.rowIndex
      };
      hasValidCells = this._isCellByPositionValid(checkingPosition);
    }

    return hasValidCells;
  },
  _isLastValidCell: function _isLastValidCell(cellPosition) {
    var nextColumnIndex = cellPosition.columnIndex >= 0 ? cellPosition.columnIndex + 1 : 0;
    var rowIndex = cellPosition.rowIndex;
    var checkingPosition = {
      columnIndex: nextColumnIndex,
      rowIndex: rowIndex
    };

    var visibleRows = this._dataController.getVisibleRows();

    var row = visibleRows && visibleRows[rowIndex];

    var isLastRow = this._isLastRow(rowIndex);

    if (!isLastRow) {
      return false;
    }

    if (row && row.rowType === 'group' && cellPosition.columnIndex > 0) {
      return true;
    }

    if (cellPosition.columnIndex === this._getVisibleColumnCount() - 1) {
      return true;
    }

    if (this._isCellByPositionValid(checkingPosition)) {
      return false;
    }

    return this._isLastValidCell(checkingPosition);
  },
  // #endregion Cell_Position
  // #region DOM_Manipulation
  _isCellValid: function _isCellValid($cell, isClick) {
    if (isElementDefined($cell)) {
      var rowsView = this.getView('rowsView');
      var $row = $cell.parent();
      var columnsController = this._columnsController;
      var columnIndex = rowsView.getCellIndex($cell) + columnsController.getColumnIndexOffset();
      var column = columnsController.getVisibleColumns(null, true)[columnIndex];

      var visibleColumnCount = this._getVisibleColumnCount();

      var editingController = this._editingController;
      var isMasterDetailRow = isDetailRow($row);
      var isShowWhenGrouped = column && column.showWhenGrouped;
      var isDataCell = column && !$cell.hasClass(COMMAND_EXPAND_CLASS) && isDataRow($row);

      var isValidGroupSpaceColumn = function isValidGroupSpaceColumn() {
        return !isMasterDetailRow && column && (!isDefined(column.groupIndex) || isShowWhenGrouped && isDataCell) || parseInt($cell.attr('colspan')) > 1;
      };

      if (this._isMasterDetailCell($cell)) {
        return true;
      }

      if (visibleColumnCount > columnIndex && isValidGroupSpaceColumn()) {
        var rowItems = this._dataController.items();

        var visibleRowIndex = rowsView.getRowIndex($row);
        var row = rowItems[visibleRowIndex];
        var isCellEditing = editingController && this._isCellEditMode() && editingController.isEditing();
        var isRowEditingInCurrentRow = editingController && editingController.isEditRow(visibleRowIndex);
        var isEditing = isRowEditingInCurrentRow || isCellEditing;

        if (column.command) {
          if (this._isLegacyNavigation()) {
            return !isEditing && column.command === 'expand';
          }

          if (isCellEditing) {
            return false;
          }

          if (isRowEditingInCurrentRow) {
            return column.command !== 'select';
          }

          return !isEditing;
        }

        if (isCellEditing && row && row.rowType !== 'data') {
          return false;
        }

        return !isEditing || column.allowEditing || isClick;
      }
    }
  },
  getFirstValidCellInRow: function getFirstValidCellInRow($row, columnIndex) {
    var that = this;
    var $cells = $row.find('> td');
    var $cell;
    var $result;
    columnIndex = columnIndex || 0;

    for (var i = columnIndex; i < $cells.length; ++i) {
      $cell = $cells.eq(i);

      if (that._isCellValid($cell)) {
        $result = $cell;
        break;
      }
    }

    return $result;
  },
  _getNextCell: function _getNextCell(keyCode, elementType, cellPosition) {
    var focusedCellPosition = cellPosition || this._focusedCellPosition;
    var isRowFocusType = this.isRowFocusType();
    var includeCommandCells = isRowFocusType || inArray(keyCode, ['next', 'previous']) > -1;
    var $cell;
    var $row;

    if (this._focusedView && focusedCellPosition) {
      var newFocusedCellPosition = this._getNewPositionByCode(focusedCellPosition, elementType, keyCode);

      $cell = $(this._getCell(newFocusedCellPosition));
      var isLastCellOnDirection = keyCode === 'previous' ? this._isFirstValidCell(newFocusedCellPosition) : this._isLastValidCell(newFocusedCellPosition);

      if (isElementDefined($cell) && !this._isCellValid($cell) && this._isCellInRow(newFocusedCellPosition, includeCommandCells) && !isLastCellOnDirection) {
        if (isRowFocusType) {
          $cell = this.getFirstValidCellInRow($cell.parent(), newFocusedCellPosition.columnIndex);
        } else {
          $cell = this._getNextCell(keyCode, 'cell', newFocusedCellPosition);
        }
      }

      $row = isElementDefined($cell) && $cell.parent();

      if (this._hasSkipRow($row)) {
        var rowIndex = this._getRowIndex($row);

        if (!this._isLastRow(rowIndex)) {
          $cell = this._getNextCell(keyCode, 'row', {
            columnIndex: focusedCellPosition.columnIndex,
            rowIndex: rowIndex
          });
        } else {
          return null;
        }
      }

      return isElementDefined($cell) ? $cell : null;
    }

    return null;
  },
  // #endregion DOM_Manipulation
  // #region Editing
  _startEditing: function _startEditing(eventArgs, fastEditingKey) {
    var focusedCellPosition = this._focusedCellPosition;
    var visibleRowIndex = this.getVisibleRowIndex();
    var visibleColumnIndex = this.getVisibleColumnIndex();

    var row = this._dataController.items()[visibleRowIndex];

    var column = this._columnsController.getVisibleColumns()[visibleColumnIndex];

    if (this._isAllowEditing(row, column)) {
      if (this._isRowEditMode()) {
        this._editingController.editRow(visibleRowIndex);
      } else if (focusedCellPosition) {
        this._startEditCell(eventArgs, fastEditingKey);
      }
    }
  },
  _isAllowEditing: function _isAllowEditing(row, column) {
    return this._editingController.allowUpdating({
      row: row
    }) && column && column.allowEditing;
  },
  _editFocusedCell: function _editFocusedCell() {
    var rowIndex = this.getVisibleRowIndex();
    var colIndex = this.getVisibleColumnIndex();
    return this._editingController.editCell(rowIndex, colIndex);
  },
  _startEditCell: function _startEditCell(eventArgs, fastEditingKey) {
    this._fastEditingStarted = isDefined(fastEditingKey);

    var editResult = this._editFocusedCell();

    if (this._isFastEditingStarted()) {
      if (editResult === true) {
        this._editingCellHandler(eventArgs, fastEditingKey);
      } else if (editResult && editResult.done) {
        var editorValue = fastEditingKey !== FAST_EDITING_DELETE_KEY ? fastEditingKey : '';
        editResult.done(() => this._editingCellHandler(eventArgs, editorValue));
      }
    }
  },
  _editingCellHandler: function _editingCellHandler(eventArgs, editorValue) {
    var _$input$get$select, _$input$get;

    var $input = this._getFocusedCell().find(INTERACTIVE_ELEMENTS_SELECTOR).eq(0);

    var keyDownEvent = createEvent(eventArgs, {
      type: 'keydown',
      target: $input.get(0)
    });
    var keyPressEvent = createEvent(eventArgs, {
      type: 'keypress',
      target: $input.get(0)
    });
    var inputEvent = createEvent(eventArgs, {
      type: 'input',
      target: $input.get(0)
    });
    (_$input$get$select = (_$input$get = $input.get(0)).select) === null || _$input$get$select === void 0 ? void 0 : _$input$get$select.call(_$input$get);
    eventsEngine.trigger($input, keyDownEvent);

    if (!keyDownEvent.isDefaultPrevented()) {
      eventsEngine.trigger($input, keyPressEvent);

      if (!keyPressEvent.isDefaultPrevented()) {
        var timeout = browser.mozilla ? 25 : 0; // T882996

        setTimeout(() => {
          $input.val(editorValue);
          var $widgetContainer = $input.closest(".".concat(WIDGET_CLASS));
          eventsEngine.off($widgetContainer, 'focusout'); // for NumberBox to save entered symbol

          eventsEngine.one($widgetContainer, 'focusout', function () {
            eventsEngine.trigger($input, 'change');
          });
          eventsEngine.trigger($input, inputEvent);
        }, timeout);
      }
    }
  },
  // #endregion Editing
  // #region Events
  _fireFocusChangingEvents: function _fireFocusChangingEvents($event, $cell, fireRowEvent, isHighlighted) {
    var args = {};
    var cellPosition = this._getCellPosition($cell) || {};

    if (this.isCellFocusType()) {
      args = this._fireFocusedCellChanging($event, $cell, isHighlighted);

      if (!args.cancel) {
        cellPosition.columnIndex = args.newColumnIndex;
        cellPosition.rowIndex = args.newRowIndex;
        isHighlighted = args.isHighlighted;
        $cell = $(this._getCell(cellPosition));
      }
    }

    if (!args.cancel && fireRowEvent && $cell) {
      args = this._fireFocusedRowChanging($event, $cell.parent());

      if (!args.cancel) {
        cellPosition.rowIndex = args.newRowIndex;
        args.isHighlighted = isHighlighted;
      }
    }

    args.$newCellElement = $(this._getCell(cellPosition));

    if (!args.$newCellElement.length) {
      args.$newCellElement = $cell;
    }

    return args;
  },
  _fireFocusedCellChanging: function _fireFocusedCellChanging($event, $cellElement, isHighlighted) {
    var that = this;
    var prevCellIndex = that.option('focusedColumnIndex');
    var prevRowIndex = that.option('focusedRowIndex');

    var cellPosition = that._getCellPosition($cellElement);

    var columnIndex = cellPosition ? cellPosition.columnIndex : -1;
    var rowIndex = cellPosition ? cellPosition.rowIndex : -1;
    var args = {
      cellElement: $cellElement,
      prevColumnIndex: prevCellIndex,
      prevRowIndex: prevRowIndex,
      newColumnIndex: columnIndex,
      newRowIndex: rowIndex,
      rows: that._dataController.getVisibleRows(),
      columns: that._columnsController.getVisibleColumns(),
      event: $event,
      isHighlighted: isHighlighted || false,
      cancel: false
    };
    this._canceledCellPosition = null;
    that.executeAction('onFocusedCellChanging', args);

    if (args.newColumnIndex !== columnIndex || args.newRowIndex !== rowIndex) {
      args.$newCellElement = $(this._getCell({
        columnIndex: args.newColumnIndex,
        rowIndex: args.newRowIndex
      }));
    }

    if (args.cancel) {
      this._canceledCellPosition = {
        rowIndex: rowIndex,
        columnIndex: columnIndex
      };
    }

    return args;
  },
  _fireFocusedCellChanged: function _fireFocusedCellChanged($cellElement, prevCellIndex, prevRowIndex) {
    var that = this;
    var dataController = that._dataController;
    var columnIndex = that.getView('rowsView').getCellIndex($cellElement);

    var rowIndex = this._getRowIndex($cellElement && $cellElement.parent());

    var localRowIndex = Math.min(rowIndex - dataController.getRowIndexOffset(), dataController.items().length - 1);

    var isEditingCell = that._editingController.isEditCell(localRowIndex, columnIndex);

    var row = dataController.items()[localRowIndex];

    if (!isEditingCell && (prevCellIndex !== columnIndex || prevRowIndex !== rowIndex)) {
      that.executeAction('onFocusedCellChanged', {
        cellElement: $cellElement,
        columnIndex: columnIndex,
        rowIndex: rowIndex,
        row: row,
        column: that._columnsController.getVisibleColumns()[columnIndex]
      });
    }
  },
  _fireFocusedRowChanging: function _fireFocusedRowChanging(eventArgs, $newFocusedRow) {
    var newRowIndex = this._getRowIndex($newFocusedRow);

    var dataController = this._dataController;
    var prevFocusedRowIndex = this.option('focusedRowIndex');
    var loadingOperationTypes = dataController.loadingOperationTypes();
    var args = {
      rowElement: $newFocusedRow,
      prevRowIndex: prevFocusedRowIndex,
      newRowIndex: newRowIndex,
      event: eventArgs,
      rows: dataController.getVisibleRows(),
      cancel: false
    };

    if (!dataController || dataController.isLoading() && (loadingOperationTypes.reload || loadingOperationTypes.paging)) {
      args.cancel = true;
      return args;
    }

    if (this.option('focusedRowEnabled')) {
      this.executeAction('onFocusedRowChanging', args);

      if (!args.cancel && args.newRowIndex !== newRowIndex) {
        args.resetFocusedRow = args.newRowIndex < 0;

        if (!args.resetFocusedRow) {
          this.setFocusedRowIndex(args.newRowIndex);
        }

        args.rowIndexChanged = true;
      }
    }

    return args;
  },
  _fireFocusedRowChanged: function _fireFocusedRowChanged($rowElement) {
    var row;
    var focusedRowKey = this.option('focusedRowKey');
    var focusController = this.getController('focus');
    var focusedRowIndex = focusController === null || focusController === void 0 ? void 0 : focusController.getFocusedRowIndexByKey(focusedRowKey);

    if (this.option('focusedRowEnabled')) {
      if (focusedRowIndex >= 0) {
        var dataController = this._dataController;
        row = focusedRowIndex >= 0 && dataController.getVisibleRows()[focusedRowIndex - dataController.getRowIndexOffset()];
      }

      this.executeAction('onFocusedRowChanged', {
        rowElement: $rowElement,
        rowIndex: focusedRowIndex,
        row: row
      });
    }
  },
  // #endregion Events
  _isEventInCurrentGrid: function _isEventInCurrentGrid(event) {
    return gridCoreUtils.isElementInCurrentGrid(this, $(event.target));
  },
  _isRowEditMode: function _isRowEditMode() {
    var editMode = this._editingController.getEditMode();

    return editMode === EDIT_MODE_ROW || editMode === EDIT_MODE_FORM;
  },
  _isCellEditMode: function _isCellEditMode() {
    var editMode = this._editingController.getEditMode();

    return editMode === EDIT_MODE_CELL || editMode === EDIT_MODE_BATCH;
  },
  _isFastEditingAllowed: function _isFastEditingAllowed() {
    return this._isCellEditMode() && this.option('keyboardNavigation.editOnKeyPress');
  },
  _getInteractiveElement: function _getInteractiveElement($cell, isLast) {
    var $focusedElement = $cell.find(INTERACTIVE_ELEMENTS_SELECTOR).filter(':visible');
    return isLast ? $focusedElement.last() : $focusedElement.first();
  },
  _applyTabIndexToElement: function _applyTabIndexToElement($element) {
    var tabIndex = this.option('tabIndex') || 0;
    $element.attr('tabindex', isDefined(tabIndex) ? tabIndex : 0);
  },
  _getCell: function _getCell(cellPosition) {
    if (this._focusedView && cellPosition) {
      var rowIndexOffset = this._dataController.getRowIndexOffset();

      var column = this._columnsController.getVisibleColumns(null, true)[cellPosition.columnIndex];

      var columnIndexOffset = column && column.fixed ? this._getFixedColumnIndexOffset(column) : this._columnsController.getColumnIndexOffset();
      var rowIndex = cellPosition.rowIndex >= 0 ? cellPosition.rowIndex - rowIndexOffset : -1;
      var columnIndex = cellPosition.columnIndex >= 0 ? cellPosition.columnIndex - columnIndexOffset : -1;
      return this._focusedView.getCell({
        rowIndex,
        columnIndex
      });
    }
  },
  _getRowIndex: function _getRowIndex($row) {
    var rowsView = this.getView('rowsView');
    var rowIndex = rowsView.getRowIndex($row);

    if (rowIndex >= 0) {
      rowIndex += this._dataController.getRowIndexOffset();
    }

    return rowIndex;
  },
  _hasSkipRow: function _hasSkipRow($row) {
    var row = $row && $row.get(0);
    return row && (row.style.display === 'none' || $row.hasClass(this.addWidgetPrefix(GROUP_FOOTER_CLASS)) || isDetailRow($row) && !$row.hasClass(this.addWidgetPrefix(EDIT_FORM_CLASS)));
  },
  _allowEditingOnEnterKey: function _allowEditingOnEnterKey() {
    return this.option('keyboardNavigation.enterKeyAction') === 'startEdit';
  },
  _isLegacyNavigation: function _isLegacyNavigation() {
    return this.option('useLegacyKeyboardNavigation');
  },
  _getDirectionCodeByKey: function _getDirectionCodeByKey(key) {
    var directionCode;

    switch (key) {
      case 'upArrow':
        directionCode = 'prevRow';
        break;

      case 'downArrow':
        directionCode = 'nextRow';
        break;

      case 'leftArrow':
        directionCode = this.option('rtlEnabled') ? 'nextInRow' : 'previousInRow';
        break;

      case 'rightArrow':
        directionCode = this.option('rtlEnabled') ? 'previousInRow' : 'nextInRow';
        break;
    }

    return directionCode;
  },
  _isVirtualScrolling: function _isVirtualScrolling() {
    var scrollingMode = this.option('scrolling.mode');
    return scrollingMode === 'virtual' || scrollingMode === 'infinite';
  },
  _isVirtualRowRender: function _isVirtualRowRender() {
    return this._isVirtualScrolling() || gridCoreUtils.isVirtualRowRendering(this);
  },
  _isVirtualColumnRender: function _isVirtualColumnRender() {
    return this.option('scrolling.columnRenderingMode') === 'virtual';
  },
  _scrollBy: function _scrollBy(left, top, rowIndex, $event) {
    var that = this;
    var scrollable = this.getView('rowsView').getScrollable();

    if (that._focusedCellPosition) {
      var scrollHandler = function scrollHandler() {
        scrollable.off('scroll', scrollHandler);
        setTimeout(that.restoreFocusableElement.bind(that, rowIndex, $event));
      };

      scrollable.on('scroll', scrollHandler);
    }

    return scrollable.scrollBy({
      left,
      top
    });
  },
  _isInsideEditForm: function _isInsideEditForm(element) {
    return $(element).closest('.' + this.addWidgetPrefix(EDIT_FORM_CLASS)).length > 0;
  },
  _isMasterDetailCell: function _isMasterDetailCell(element) {
    var $masterDetailCell = $(element).closest('.' + MASTER_DETAIL_CELL_CLASS);
    var $masterDetailGrid = $masterDetailCell.closest('.' + this.getWidgetContainerClass()).parent();
    return $masterDetailCell.length && $masterDetailGrid.is(this.component.$element());
  },
  _processNextCellInMasterDetail: function _processNextCellInMasterDetail($nextCell) {
    if (!this._isInsideEditForm($nextCell) && $nextCell) {
      this._applyTabIndexToElement($nextCell);
    }
  },
  _handleTabKeyOnMasterDetailCell: function _handleTabKeyOnMasterDetailCell(target, direction) {
    if (this._isMasterDetailCell(target)) {
      this._updateFocusedCellPosition($(target), direction);

      var $nextCell = this._getNextCell(direction, 'row');

      this._processNextCellInMasterDetail($nextCell);

      return true;
    }

    return false;
  },
  _getElementType: function _getElementType(target) {
    return $(target).is('tr') ? 'row' : 'cell';
  },
  _isFastEditingStarted: function _isFastEditingStarted() {
    return this._isFastEditingAllowed() && this._fastEditingStarted;
  },
  _getVisibleColumnCount: function _getVisibleColumnCount() {
    return this._columnsController.getVisibleColumns(null, true).length;
  },
  _isCellInRow: function _isCellInRow(cellPosition, includeCommandCells) {
    var columnIndex = cellPosition.columnIndex;

    var visibleColumnsCount = this._getVisibleColumnCount();

    return includeCommandCells ? columnIndex >= 0 && columnIndex <= visibleColumnsCount - 1 : columnIndex > 0 && columnIndex < visibleColumnsCount - 1;
  },
  _getCellElementFromTarget: function _getCellElementFromTarget(target) {
    var elementType = this._getElementType(target);

    var $targetElement = $(target);
    var $cell;

    if (elementType === 'cell') {
      $cell = $targetElement.closest(".".concat(ROW_CLASS, " > td"));
    } else {
      $cell = $targetElement.children().not('.' + COMMAND_EXPAND_CLASS).first();
    }

    return $cell;
  },
  _getRowsViewElement: function _getRowsViewElement() {
    var rowsView = this.getView('rowsView');
    return rowsView && rowsView.element();
  },
  isKeyboardEnabled: function isKeyboardEnabled() {
    return this.option('keyboardNavigation.enabled');
  },
  _processCanceledEditCellPosition: function _processCanceledEditCellPosition(rowIndex, columnIndex) {
    if (this._canceledCellPosition) {
      var isCanceled = this._canceledCellPosition.rowIndex === rowIndex && this._canceledCellPosition.columnIndex === columnIndex;
      this._canceledCellPosition = null;
      return isCanceled;
    }
  },
  updateFocusedRowIndex: function updateFocusedRowIndex() {
    var dataController = this._dataController;
    var visibleRowIndex = this.getVisibleRowIndex();
    var visibleItems = dataController.items();
    var lastVisibleIndex = visibleItems.length ? visibleItems.length - 1 : -1;
    var rowIndexOffset = dataController.getRowIndexOffset();
    lastVisibleIndex >= 0 && visibleRowIndex > lastVisibleIndex && this.setFocusedRowIndex(lastVisibleIndex + rowIndexOffset);
  }
});
/**
* @name GridBase.registerKeyHandler
* @publicName registerKeyHandler(key, handler)
* @hidden
*/

export var keyboardNavigationModule = {
  defaultOptions: function defaultOptions() {
    return {
      useLegacyKeyboardNavigation: false,
      keyboardNavigation: {
        enabled: true,
        enterKeyAction: 'startEdit',
        enterKeyDirection: 'none',
        editOnKeyPress: false
      }
    };
  },
  controllers: {
    keyboardNavigation: KeyboardNavigationController
  },
  extenders: {
    views: {
      rowsView: {
        _rowClick: function _rowClick(e) {
          var editRowIndex = this.getController('editing').getEditRowIndex();
          var keyboardController = this.getController('keyboardNavigation');

          if (editRowIndex === e.rowIndex) {
            keyboardController.setCellFocusType();
          }

          var needTriggerPointerEventHandler = isMobile() && this.option('focusedRowEnabled');

          if (needTriggerPointerEventHandler) {
            this._triggerPointerDownEventHandler(e);
          }

          this.callBase.apply(this, arguments);
        },
        _triggerPointerDownEventHandler: function _triggerPointerDownEventHandler(e) {
          var originalEvent = e.event.originalEvent;

          if (originalEvent) {
            var keyboardController = this.getController('keyboardNavigation');
            var $cell = $(originalEvent.target);
            var columnIndex = this.getCellIndex($cell);
            var column = this.getController('columns').getVisibleColumns()[columnIndex];
            var row = this.getController('data').items()[e.rowIndex];

            if (keyboardController._isAllowEditing(row, column)) {
              var eventArgs = createEvent(originalEvent, {
                currentTarget: originalEvent.target
              });

              keyboardController._pointerEventHandler(eventArgs);
            }
          }
        },
        renderFocusState: function renderFocusState(params) {
          var {
            preventScroll,
            pageSizeChanged
          } = params !== null && params !== void 0 ? params : {};
          var keyboardController = this.getController('keyboardNavigation');
          var $rowsViewElement = this.element();

          if ($rowsViewElement && !focused($rowsViewElement)) {
            $rowsViewElement.attr('tabindex', null);
          }

          pageSizeChanged && keyboardController.updateFocusedRowIndex();
          var rowIndex = keyboardController.getVisibleRowIndex();

          if (!isDefined(rowIndex) || rowIndex < 0) {
            rowIndex = 0;
          }

          var cellElements = this.getCellElements(rowIndex);

          if (keyboardController.isKeyboardEnabled() && cellElements.length) {
            this.updateFocusElementTabIndex(cellElements, preventScroll);
          }
        },
        updateFocusElementTabIndex: function updateFocusElementTabIndex(cellElements) {
          var keyboardController = this.getController('keyboardNavigation');
          var $row = cellElements.eq(0).parent();

          if (isGroupRow($row)) {
            keyboardController._applyTabIndexToElement($row);
          } else {
            var columnIndex = keyboardController.getColumnIndex();

            if (!isDefined(columnIndex) || columnIndex < 0) {
              columnIndex = 0;
            }

            this._updateFocusedCellTabIndex(cellElements, columnIndex);
          }
        },
        _updateFocusedCellTabIndex: function _updateFocusedCellTabIndex(cellElements, columnIndex) {
          var keyboardController = this.getController('keyboardNavigation');
          var cellElementsLength = cellElements ? cellElements.length : -1;

          var updateCellTabIndex = function updateCellTabIndex($cell) {
            var isMasterDetailCell = keyboardController._isMasterDetailCell($cell);

            var isValidCell = keyboardController._isCellValid($cell);

            if (!isMasterDetailCell && isValidCell && isCellElement($cell)) {
              keyboardController._applyTabIndexToElement($cell);

              keyboardController.setCellFocusType();
              return true;
            }
          };

          var $cell = cellElements.filter("[aria-colindex='".concat(columnIndex + 1, "']"));

          if ($cell.length) {
            updateCellTabIndex($cell);
          } else {
            if (cellElementsLength <= columnIndex) {
              columnIndex = cellElementsLength - 1;
            }

            for (var i = columnIndex; i < cellElementsLength; ++i) {
              if (updateCellTabIndex($(cellElements[i]))) {
                break;
              }
            }
          }
        },
        renderDelayedTemplates: function renderDelayedTemplates(change) {
          this.callBase.apply(this, arguments);

          this._renderFocusByChange(change);
        },

        _renderFocusByChange(change) {
          var {
            operationTypes,
            repaintChangesOnly
          } = change !== null && change !== void 0 ? change : {};
          var {
            fullReload,
            pageSize
          } = operationTypes !== null && operationTypes !== void 0 ? operationTypes : {};

          if (!change || !repaintChangesOnly || fullReload || pageSize) {
            var preventScroll = shouldPreventScroll(this);
            this.renderFocusState({
              preventScroll,
              pageSizeChanged: pageSize
            });
          }
        },

        _renderCore: function _renderCore(change) {
          this.callBase.apply(this, arguments);

          this._renderFocusByChange(change);
        },
        _editCellPrepared: function _editCellPrepared($cell) {
          var editorInstance = this._getEditorInstance($cell);

          var keyboardController = this.getController('keyboardNavigation');

          var isEditingNavigationMode = keyboardController && keyboardController._isFastEditingStarted();

          if (editorInstance && isEditingNavigationMode) {
            this._handleEditingNavigationMode(editorInstance);
          }

          this.callBase.apply(this, arguments);
        },
        _handleEditingNavigationMode: function _handleEditingNavigationMode(editorInstance) {
          ['downArrow', 'upArrow'].forEach(function (keyName) {
            var originalKeyHandler = editorInstance._supportedKeys()[keyName];

            editorInstance.registerKeyHandler(keyName, e => {
              var isDropDownOpened = editorInstance._input().attr('aria-expanded') === 'true';

              if (isDropDownOpened) {
                return originalKeyHandler && originalKeyHandler.call(editorInstance, e);
              }
            });
          });
          editorInstance.registerKeyHandler('leftArrow', noop);
          editorInstance.registerKeyHandler('rightArrow', noop);
          var isDateBoxWithMask = editorInstance.NAME === DATEBOX_WIDGET_NAME && editorInstance.option('useMaskBehavior');

          if (isDateBoxWithMask) {
            editorInstance.registerKeyHandler('enter', noop);
          }
        },
        _getEditorInstance: function _getEditorInstance($cell) {
          var $editor = $cell.find('.dx-texteditor').eq(0);
          return gridCoreUtils.getWidgetInstance($editor);
        }
      }
    },
    controllers: {
      editing: {
        editCell: function editCell(rowIndex, columnIndex) {
          var keyboardController = this.getController('keyboardNavigation');

          if (keyboardController._processCanceledEditCellPosition(rowIndex, columnIndex)) {
            return false;
          }

          var isCellEditing = this.callBase(rowIndex, columnIndex);

          if (isCellEditing) {
            keyboardController.setupFocusedView();
          }

          return isCellEditing;
        },
        editRow: function editRow(rowIndex) {
          var keyboardController = this.getController('keyboardNavigation');
          var visibleColumnIndex = keyboardController.getVisibleColumnIndex();

          var column = this._columnsController.getVisibleColumns()[visibleColumnIndex];

          if (column && column.type || this.option('editing.mode') === EDIT_MODE_FORM) {
            keyboardController._resetFocusedCell();
          }

          this.callBase(rowIndex);
        },
        addRow: function addRow(parentKey) {
          var keyboardController = this.getController('keyboardNavigation');
          keyboardController.setupFocusedView();
          keyboardController.setCellFocusType();
          return this.callBase.apply(this, arguments);
        },
        getFocusedCellInRow: function getFocusedCellInRow(rowIndex) {
          var keyboardNavigationController = this.getController('keyboardNavigation');
          var $cell = this.callBase(rowIndex);

          if (keyboardNavigationController.isKeyboardEnabled() && keyboardNavigationController._focusedCellPosition.rowIndex === rowIndex) {
            var $focusedCell = keyboardNavigationController._getFocusedCell();

            if (isElementDefined($focusedCell) && !$focusedCell.hasClass(COMMAND_EDIT_CLASS)) {
              $cell = $focusedCell;
            }
          }

          return $cell;
        },
        _processCanceledEditingCell: function _processCanceledEditingCell() {
          this.closeEditCell().done(() => {
            var keyboardNavigation = this.getController('keyboardNavigation');

            keyboardNavigation._updateFocus();
          });
        },
        init: function init() {
          this.callBase();
          this._keyboardNavigationController = this.getController('keyboardNavigation');
        },
        closeEditCell: function closeEditCell() {
          var keyboardNavigation = this._keyboardNavigationController;
          keyboardNavigation._fastEditingStarted = false;
          var result = this.callBase.apply(this, arguments);

          keyboardNavigation._updateFocus();

          return result;
        },
        _delayedInputFocus: function _delayedInputFocus() {
          this._keyboardNavigationController._isNeedScroll = true;
          this.callBase.apply(this, arguments);
        },
        _isEditingStart: function _isEditingStart() {
          var keyboardNavigation = this.getController('keyboardNavigation');
          var cancel = this.callBase.apply(this, arguments);

          if (cancel && !keyboardNavigation._isNeedFocus) {
            var $cell = keyboardNavigation._getFocusedCell();

            keyboardNavigation._focus($cell, true);
          }

          return cancel;
        }
      },
      data: {
        _correctRowIndices: function _correctRowIndices(getRowIndexCorrection) {
          var that = this;
          var keyboardNavigationController = that.getController('keyboardNavigation');
          var editorFactory = that.getController('editorFactory');
          var focusedCellPosition = keyboardNavigationController._focusedCellPosition;
          that.callBase.apply(that, arguments);

          if (focusedCellPosition && focusedCellPosition.rowIndex >= 0) {
            var focusedRowIndexCorrection = getRowIndexCorrection(focusedCellPosition.rowIndex);

            if (focusedRowIndexCorrection) {
              focusedCellPosition.rowIndex += focusedRowIndexCorrection;
              editorFactory.refocus();
            }
          }
        },
        getMaxRowIndex: function getMaxRowIndex() {
          var result = this.items().length - 1;
          var virtualItemsCount = this.virtualItemsCount();

          if (virtualItemsCount) {
            result += virtualItemsCount.begin + virtualItemsCount.end;
          }

          return result;
        }
      },
      adaptiveColumns: {
        _showHiddenCellsInView: function _showHiddenCellsInView(_ref) {
          var {
            viewName,
            $cells,
            isCommandColumn
          } = _ref;
          this.callBase.apply(this, arguments);
          viewName === COLUMN_HEADERS_VIEW && !isCommandColumn && $cells.each((_, cellElement) => {
            var $cell = $(cellElement);
            isCellInHeaderRow($cell) && $cell.attr('tabindex', 0);
          });
        },
        _hideVisibleCellInView: function _hideVisibleCellInView(_ref2) {
          var {
            viewName,
            $cell,
            isCommandColumn
          } = _ref2;
          this.callBase.apply(this, arguments);

          if (viewName === COLUMN_HEADERS_VIEW && !isCommandColumn && isCellInHeaderRow($cell)) {
            $cell.removeAttr('tabindex');
          }
        }
      }
    }
  }
};
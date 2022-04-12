import registerComponent from '../../core/component_registrator';
import { noop, deferRender } from '../../core/utils/common';
import { isFunction, isDefined } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import Widget from '../widget/ui.widget';
import treeListCore from './ui.tree_list.core';
import { isMaterial } from '../themes';
var callModuleItemsMethod = treeListCore.callModuleItemsMethod;
var DATAGRID_ROW_SELECTOR = '.dx-row';
var TREELIST_CLASS = 'dx-treelist';
import './ui.tree_list.column_headers';
import './ui.tree_list.columns_controller';
import './ui.tree_list.data_controller';
import './ui.tree_list.sorting';
import './ui.tree_list.rows';
import './ui.tree_list.context_menu';
import './ui.tree_list.error_handling';
import './ui.tree_list.grid_view';
import './ui.tree_list.header_panel'; // STYLE treeList

treeListCore.registerModulesOrder(['stateStoring', 'columns', 'selection', 'editorFactory', 'columnChooser', 'editingRowBased', 'editingFormBased', 'editingCellBased', 'editing', 'grouping', 'masterDetail', 'validating', 'adaptivity', 'data', 'virtualScrolling', 'columnHeaders', 'filterRow', 'headerPanel', 'headerFilter', 'sorting', 'search', 'rows', 'pager', 'columnsResizingReordering', 'contextMenu', 'keyboardNavigation', 'errorHandling', 'summary', 'columnFixing', 'export', 'gridView']);
var TreeList = Widget.inherit({
  _activeStateUnit: DATAGRID_ROW_SELECTOR,
  _getDefaultOptions: function _getDefaultOptions() {
    var that = this;
    var result = that.callBase();
    each(treeListCore.modules, function () {
      if (isFunction(this.defaultOptions)) {
        extend(true, result, this.defaultOptions());
      }
    });
    return result;
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: function device() {
        return isMaterial();
      },
      options: {
        showRowLines: true,
        showColumnLines: false,
        headerFilter: {
          height: 315
        },
        editing: {
          useIcons: true
        }
      }
    }]);
  },
  _init: function _init() {
    var that = this;
    that.callBase();
    treeListCore.processModules(that, treeListCore);
    callModuleItemsMethod(that, 'init');
  },
  _clean: noop,
  _optionChanged: function _optionChanged(args) {
    var that = this;
    callModuleItemsMethod(that, 'optionChanged', [args]);

    if (!args.handled) {
      that.callBase(args);
    }
  },
  _dimensionChanged: function _dimensionChanged() {
    this.updateDimensions(true);
  },
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      this.updateDimensions();
    }
  },
  _initMarkup: function _initMarkup() {
    this.callBase.apply(this, arguments);
    this.$element().addClass(TREELIST_CLASS);
    this.getView('gridView').render(this.$element());
  },
  _renderContentImpl: function _renderContentImpl() {
    this.getView('gridView').update();
  },
  _renderContent: function _renderContent() {
    var that = this;
    deferRender(function () {
      that._renderContentImpl();
    });
  },
  _dispose: function _dispose() {
    var that = this;
    that.callBase();
    callModuleItemsMethod(that, 'dispose');
  },
  isReady: function isReady() {
    return this.getController('data').isReady();
  },
  beginUpdate: function beginUpdate() {
    var that = this;
    that.callBase();
    callModuleItemsMethod(that, 'beginUpdate');
  },
  endUpdate: function endUpdate() {
    var that = this;
    callModuleItemsMethod(that, 'endUpdate');
    that.callBase();
  },
  getController: function getController(name) {
    return this._controllers[name];
  },
  getView: function getView(name) {
    return this._views[name];
  },
  focus: function focus(element) {
    this.callBase();

    if (isDefined(element)) {
      this.getController('keyboardNavigation').focus(element);
    }
  }
});
TreeList.registerModule = treeListCore.registerModule.bind(treeListCore);
registerComponent('dxTreeList', TreeList);
export default TreeList;
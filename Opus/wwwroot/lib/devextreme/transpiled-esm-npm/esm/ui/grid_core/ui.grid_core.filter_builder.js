import $ from '../../core/renderer';
import modules from './ui.grid_core.modules';
import { extend } from '../../core/utils/extend';
import FilterBuilder from './../filter_builder';
import messageLocalization from '../../localization/message';
import ScrollView from './../scroll_view';
import Popup from './../popup';
import { restoreFocus } from '../shared/accessibility';
var FilterBuilderView = modules.View.inherit({
  _renderCore: function _renderCore() {
    this._updatePopupOptions();
  },
  _updatePopupOptions: function _updatePopupOptions() {
    if (this.option('filterBuilderPopup.visible')) {
      this._initPopup();
    } else if (this._filterBuilderPopup) {
      this._filterBuilderPopup.hide();
    }
  },
  _disposePopup: function _disposePopup() {
    if (this._filterBuilderPopup) {
      this._filterBuilderPopup.dispose();

      this._filterBuilderPopup = undefined;
    }

    if (this._filterBuilder) {
      this._filterBuilder.dispose();

      this._filterBuilder = undefined;
    }
  },
  _initPopup: function _initPopup() {
    var that = this;

    that._disposePopup();

    that._filterBuilderPopup = that._createComponent(that.element(), Popup, extend({
      title: messageLocalization.format('dxDataGrid-filterBuilderPopupTitle'),
      contentTemplate: function contentTemplate($contentElement) {
        return that._getPopupContentTemplate($contentElement);
      },
      onOptionChanged: function onOptionChanged(args) {
        if (args.name === 'visible') {
          that.option('filterBuilderPopup.visible', args.value);
        }
      },
      toolbarItems: that._getPopupToolbarItems()
    }, that.option('filterBuilderPopup'), {
      onHidden: function onHidden(e) {
        restoreFocus(that);

        that._disposePopup();
      }
    }));
  },
  _getPopupContentTemplate: function _getPopupContentTemplate(contentElement) {
    var $contentElement = $(contentElement);
    var $filterBuilderContainer = $('<div>').appendTo($(contentElement));
    this._filterBuilder = this._createComponent($filterBuilderContainer, FilterBuilder, extend({
      value: this.option('filterValue'),
      fields: this.getController('columns').getFilteringColumns()
    }, this.option('filterBuilder'), {
      customOperations: this.getController('filterSync').getCustomFilterOperations()
    }));

    this._createComponent($contentElement, ScrollView, {
      direction: 'both'
    });
  },
  _getPopupToolbarItems: function _getPopupToolbarItems() {
    var that = this;
    return [{
      toolbar: 'bottom',
      location: 'after',
      widget: 'dxButton',
      options: {
        text: messageLocalization.format('OK'),
        onClick: function onClick(e) {
          var filter = that._filterBuilder.option('value');

          that.option('filterValue', filter);

          that._filterBuilderPopup.hide();
        }
      }
    }, {
      toolbar: 'bottom',
      location: 'after',
      widget: 'dxButton',
      options: {
        text: messageLocalization.format('Cancel'),
        onClick: function onClick(e) {
          that._filterBuilderPopup.hide();
        }
      }
    }];
  },
  optionChanged: function optionChanged(args) {
    switch (args.name) {
      case 'filterBuilder':
      case 'filterBuilderPopup':
        this._invalidate();

        args.handled = true;
        break;

      default:
        this.callBase(args);
    }
  }
});
export var filterBuilderModule = {
  defaultOptions: function defaultOptions() {
    return {
      filterBuilder: {
        groupOperationDescriptions: {
          and: messageLocalization.format('dxFilterBuilder-and'),
          or: messageLocalization.format('dxFilterBuilder-or'),
          notAnd: messageLocalization.format('dxFilterBuilder-notAnd'),
          notOr: messageLocalization.format('dxFilterBuilder-notOr')
        },
        filterOperationDescriptions: {
          between: messageLocalization.format('dxFilterBuilder-filterOperationBetween'),
          equal: messageLocalization.format('dxFilterBuilder-filterOperationEquals'),
          notEqual: messageLocalization.format('dxFilterBuilder-filterOperationNotEquals'),
          lessThan: messageLocalization.format('dxFilterBuilder-filterOperationLess'),
          lessThanOrEqual: messageLocalization.format('dxFilterBuilder-filterOperationLessOrEquals'),
          greaterThan: messageLocalization.format('dxFilterBuilder-filterOperationGreater'),
          greaterThanOrEqual: messageLocalization.format('dxFilterBuilder-filterOperationGreaterOrEquals'),
          startsWith: messageLocalization.format('dxFilterBuilder-filterOperationStartsWith'),
          contains: messageLocalization.format('dxFilterBuilder-filterOperationContains'),
          notContains: messageLocalization.format('dxFilterBuilder-filterOperationNotContains'),
          endsWith: messageLocalization.format('dxFilterBuilder-filterOperationEndsWith'),
          isBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsBlank'),
          isNotBlank: messageLocalization.format('dxFilterBuilder-filterOperationIsNotBlank')
        }
      },
      filterBuilderPopup: {}
    };
  },
  views: {
    filterBuilderView: FilterBuilderView
  }
};
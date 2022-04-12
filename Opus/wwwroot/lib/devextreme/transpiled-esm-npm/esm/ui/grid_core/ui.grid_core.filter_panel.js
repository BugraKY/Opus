import $ from '../../core/renderer';
import { isDefined } from '../../core/utils/type';
import modules from './ui.grid_core.modules';
import gridUtils from './ui.grid_core.utils';
import eventsEngine from '../../events/core/events_engine';
import messageLocalization from '../../localization/message';
import CheckBox from '../check_box';
import { getCurrentLookupValueText, getCustomOperation, getCurrentValueText, getField, getCaptionByOperation, getGroupValue, isCondition, isGroup } from '../filter_builder/utils';
import { when, Deferred } from '../../core/utils/deferred';
import { captionize } from '../../core/utils/inflector';
import { registerKeyboardAction } from './ui.grid_core.accessibility';
var FILTER_PANEL_CLASS = 'filter-panel';
var FILTER_PANEL_TEXT_CLASS = FILTER_PANEL_CLASS + '-text';
var FILTER_PANEL_CHECKBOX_CLASS = FILTER_PANEL_CLASS + '-checkbox';
var FILTER_PANEL_CLEAR_FILTER_CLASS = FILTER_PANEL_CLASS + '-clear-filter';
var FILTER_PANEL_LEFT_CONTAINER = FILTER_PANEL_CLASS + '-left';
var FILTER_PANEL_TARGET = 'filterPanel';
var FilterPanelView = modules.View.inherit({
  isVisible: function isVisible() {
    return this.option('filterPanel.visible') && this.getController('data').dataSource();
  },
  init: function init() {
    this.getController('data').dataSourceChanged.add(() => this.render());
  },
  _renderCore: function _renderCore() {
    var that = this;
    var $element = that.element();
    $element.empty().addClass(that.addWidgetPrefix(FILTER_PANEL_CLASS));
    var $leftContainer = $('<div>').addClass(that.addWidgetPrefix(FILTER_PANEL_LEFT_CONTAINER)).appendTo($element);

    if (that.option('filterValue') || that._filterValueBuffer) {
      $leftContainer.append(that._getCheckElement()).append(that._getFilterElement()).append(that._getTextElement());
      $element.append(that._getRemoveButtonElement());
    } else {
      $leftContainer.append(that._getFilterElement()).append(that._getTextElement());
    }
  },
  _getCheckElement: function _getCheckElement() {
    var that = this;
    var $element = $('<div>').addClass(this.addWidgetPrefix(FILTER_PANEL_CHECKBOX_CLASS));

    that._createComponent($element, CheckBox, {
      value: that.option('filterPanel.filterEnabled'),
      onValueChanged: function onValueChanged(e) {
        that.option('filterPanel.filterEnabled', e.value);
      }
    });

    $element.attr('title', this.option('filterPanel.texts.filterEnabledHint'));
    return $element;
  },
  _getFilterElement: function _getFilterElement() {
    var that = this;
    var $element = $('<div>').addClass('dx-icon-filter');
    eventsEngine.on($element, 'click', () => that._showFilterBuilder());
    registerKeyboardAction('filterPanel', that, $element, undefined, () => that._showFilterBuilder());

    that._addTabIndexToElement($element);

    return $element;
  },
  _getTextElement: function _getTextElement() {
    var that = this;
    var $textElement = $('<div>').addClass(that.addWidgetPrefix(FILTER_PANEL_TEXT_CLASS));
    var filterText;
    var filterValue = that.option('filterValue');

    if (filterValue) {
      when(that.getFilterText(filterValue, that.getController('filterSync').getCustomFilterOperations())).done(function (filterText) {
        var customizeText = that.option('filterPanel.customizeText');

        if (customizeText) {
          var customText = customizeText({
            component: that.component,
            filterValue: filterValue,
            text: filterText
          });

          if (typeof customText === 'string') {
            filterText = customText;
          }
        }

        $textElement.text(filterText);
      });
    } else {
      filterText = that.option('filterPanel.texts.createFilter');
      $textElement.text(filterText);
    }

    eventsEngine.on($textElement, 'click', () => that._showFilterBuilder());
    registerKeyboardAction('filterPanel', that, $textElement, undefined, () => that._showFilterBuilder());

    that._addTabIndexToElement($textElement);

    return $textElement;
  },
  _showFilterBuilder: function _showFilterBuilder() {
    this.option('filterBuilderPopup.visible', true);
  },
  _getRemoveButtonElement: function _getRemoveButtonElement() {
    var that = this;

    var clearFilterValue = () => that.option('filterValue', null);

    var $element = $('<div>').addClass(that.addWidgetPrefix(FILTER_PANEL_CLEAR_FILTER_CLASS)).text(that.option('filterPanel.texts.clearFilter'));
    eventsEngine.on($element, 'click', clearFilterValue);
    registerKeyboardAction('filterPanel', this, $element, undefined, clearFilterValue);

    that._addTabIndexToElement($element);

    return $element;
  },
  _addTabIndexToElement: function _addTabIndexToElement($element) {
    if (!this.option('useLegacyKeyboardNavigation')) {
      var tabindex = this.option('tabindex') || 0;
      $element.attr('tabindex', tabindex);
    }
  },
  optionChanged: function optionChanged(args) {
    switch (args.name) {
      case 'filterValue':
        this._invalidate();

        this.option('filterPanel.filterEnabled', true);
        args.handled = true;
        break;

      case 'filterPanel':
        this._invalidate();

        args.handled = true;
        break;

      default:
        this.callBase(args);
    }
  },
  _getConditionText: function _getConditionText(fieldText, operationText, valueText) {
    var result = "[".concat(fieldText, "] ").concat(operationText);

    if (isDefined(valueText)) {
      result += valueText;
    }

    return result;
  },
  _getValueMaskedText: function _getValueMaskedText(value) {
    return Array.isArray(value) ? "('".concat(value.join('\', \''), "')") : " '".concat(value, "'");
  },
  _getValueText: function _getValueText(field, customOperation, value) {
    var deferred = new Deferred();
    var hasCustomOperation = customOperation && customOperation.customizeText;

    if (isDefined(value) || hasCustomOperation) {
      if (!hasCustomOperation && field.lookup) {
        getCurrentLookupValueText(field, value, data => {
          deferred.resolve(this._getValueMaskedText(data));
        });
      } else {
        var displayValue = Array.isArray(value) ? value : gridUtils.getDisplayValue(field, value);
        when(getCurrentValueText(field, displayValue, customOperation, FILTER_PANEL_TARGET)).done(data => {
          deferred.resolve(this._getValueMaskedText(data));
        });
      }
    } else {
      deferred.resolve('');
    }

    return deferred.promise();
  },
  getConditionText: function getConditionText(filterValue, options) {
    var that = this;
    var operation = filterValue[1];
    var deferred = new Deferred();
    var customOperation = getCustomOperation(options.customOperations, operation);
    var operationText;
    var field = getField(filterValue[0], options.columns);
    var fieldText = field.caption || '';
    var value = filterValue[2];

    if (customOperation) {
      operationText = customOperation.caption || captionize(customOperation.name);
    } else if (value === null) {
      operationText = getCaptionByOperation(operation === '=' ? 'isblank' : 'isnotblank', options.filterOperationDescriptions);
    } else {
      operationText = getCaptionByOperation(operation, options.filterOperationDescriptions);
    }

    this._getValueText(field, customOperation, value).done(valueText => {
      deferred.resolve(that._getConditionText(fieldText, operationText, valueText));
    });

    return deferred;
  },
  getGroupText: function getGroupText(filterValue, options, isInnerGroup) {
    var that = this;
    var result = new Deferred();
    var textParts = [];
    var groupValue = getGroupValue(filterValue);
    filterValue.forEach(item => {
      if (isCondition(item)) {
        textParts.push(that.getConditionText(item, options));
      } else if (isGroup(item)) {
        textParts.push(that.getGroupText(item, options, true));
      }
    });
    when.apply(this, textParts).done(function () {
      var text;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (groupValue[0] === '!') {
        var groupText = options.groupOperationDescriptions['not' + groupValue.substring(1, 2).toUpperCase() + groupValue.substring(2)].split(' ');
        text = "".concat(groupText[0], " ").concat(args[0]);
      } else {
        text = args.join(" ".concat(options.groupOperationDescriptions[groupValue], " "));
      }

      if (isInnerGroup) {
        text = "(".concat(text, ")");
      }

      result.resolve(text);
    });
    return result;
  },
  getFilterText: function getFilterText(filterValue, customOperations) {
    var that = this;
    var options = {
      customOperations: customOperations,
      columns: that.getController('columns').getFilteringColumns(),
      filterOperationDescriptions: that.option('filterBuilder.filterOperationDescriptions'),
      groupOperationDescriptions: that.option('filterBuilder.groupOperationDescriptions')
    };
    return isCondition(filterValue) ? that.getConditionText(filterValue, options) : that.getGroupText(filterValue, options);
  }
});
export var filterPanelModule = {
  defaultOptions: function defaultOptions() {
    return {
      filterPanel: {
        visible: false,
        filterEnabled: true,
        texts: {
          createFilter: messageLocalization.format('dxDataGrid-filterPanelCreateFilter'),
          clearFilter: messageLocalization.format('dxDataGrid-filterPanelClearFilter'),
          filterEnabledHint: messageLocalization.format('dxDataGrid-filterPanelFilterEnabledHint')
        }
      }
    };
  },
  views: {
    filterPanelView: FilterPanelView
  },
  extenders: {
    controllers: {
      data: {
        optionChanged: function optionChanged(args) {
          switch (args.name) {
            case 'filterPanel':
              this._applyFilter();

              args.handled = true;
              break;

            default:
              this.callBase(args);
          }
        }
      }
    }
  }
};
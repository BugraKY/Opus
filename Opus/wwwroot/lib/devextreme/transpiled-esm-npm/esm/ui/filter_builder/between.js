import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
var FILTER_BUILDER_RANGE_CLASS = 'dx-filterbuilder-range';
var FILTER_BUILDER_RANGE_START_CLASS = FILTER_BUILDER_RANGE_CLASS + '-start';
var FILTER_BUILDER_RANGE_END_CLASS = FILTER_BUILDER_RANGE_CLASS + '-end';
var FILTER_BUILDER_RANGE_SEPARATOR_CLASS = FILTER_BUILDER_RANGE_CLASS + '-separator';
var SEPARATOR = '\u2013';

function editorTemplate(conditionInfo, container) {
  var $editorStart = $('<div>').addClass(FILTER_BUILDER_RANGE_START_CLASS);
  var $editorEnd = $('<div>').addClass(FILTER_BUILDER_RANGE_END_CLASS);
  var values = conditionInfo.value || [];

  var getStartValue = function getStartValue(values) {
    return values && values.length > 0 ? values[0] : null;
  };

  var getEndValue = function getEndValue(values) {
    return values && values.length === 2 ? values[1] : null;
  };

  container.append($editorStart);
  container.append($('<span>').addClass(FILTER_BUILDER_RANGE_SEPARATOR_CLASS).text(SEPARATOR));
  container.append($editorEnd);
  container.addClass(FILTER_BUILDER_RANGE_CLASS);

  this._editorFactory.createEditor.call(this, $editorStart, extend({}, conditionInfo.field, conditionInfo, {
    value: getStartValue(values),
    parentType: 'filterBuilder',
    setValue: function setValue(value) {
      values = [value, getEndValue(values)];
      conditionInfo.setValue(values);
    }
  }));

  this._editorFactory.createEditor.call(this, $editorEnd, extend({}, conditionInfo.field, conditionInfo, {
    value: getEndValue(values),
    parentType: 'filterBuilder',
    setValue: function setValue(value) {
      values = [getStartValue(values), value];
      conditionInfo.setValue(values);
    }
  }));
}

export function getConfig(caption, context) {
  return {
    name: 'between',
    caption: caption,
    icon: 'range',
    valueSeparator: SEPARATOR,
    dataTypes: ['number', 'date', 'datetime'],
    editorTemplate: editorTemplate.bind(context),
    notForLookup: true
  };
}
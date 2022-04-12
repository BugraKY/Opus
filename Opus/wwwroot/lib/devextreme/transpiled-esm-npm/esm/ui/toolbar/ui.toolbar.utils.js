import $ from '../../core/renderer';
var BUTTON_GROUP_CLASS = 'dx-buttongroup';
var TOOLBAR_ITEMS = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];

var getItemInstance = function getItemInstance($element) {
  var itemData = $element.data && $element.data();
  var dxComponents = itemData && itemData.dxComponents;
  var widgetName = dxComponents && dxComponents[0];
  return widgetName && itemData[widgetName];
};

export function toggleItemFocusableElementTabIndex(context, item) {
  var _itemData$options;

  if (!context) return;

  var $item = context._findItemElementByItem(item);

  if (!$item.length) {
    return;
  }

  var itemData = context._getItemData($item);

  var isItemNotFocusable = !!((_itemData$options = itemData.options) !== null && _itemData$options !== void 0 && _itemData$options.disabled || itemData.disabled || context.option('disabled'));
  var {
    widget
  } = itemData;

  if (widget && TOOLBAR_ITEMS.indexOf(widget) !== -1) {
    var $widget = $item.find(widget.toLowerCase().replace('dx', '.dx-'));

    if ($widget.length) {
      var _itemInstance$_focusT, _itemData$options2;

      var itemInstance = getItemInstance($widget);
      var $focusTarget = widget === 'dxDropDownButton' ? itemInstance._focusTarget().find(".".concat(BUTTON_GROUP_CLASS)) : (itemInstance === null || itemInstance === void 0 ? void 0 : (_itemInstance$_focusT = itemInstance._focusTarget) === null || _itemInstance$_focusT === void 0 ? void 0 : _itemInstance$_focusT.call(itemInstance)) || $(itemInstance.element());
      var tabIndex = (_itemData$options2 = itemData.options) === null || _itemData$options2 === void 0 ? void 0 : _itemData$options2.tabIndex;

      if (isItemNotFocusable) {
        $focusTarget.attr('tabIndex', -1);
      } else {
        $focusTarget.attr('tabIndex', tabIndex ? tabIndex : 0);
      }
    }
  }
}
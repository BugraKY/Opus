import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';

var focusableFn = function focusableFn(element, tabIndex) {
  if (!visible(element)) {
    return false;
  }

  var nodeName = element.nodeName.toLowerCase();
  var isTabIndexNotNaN = !isNaN(tabIndex);
  var isDisabled = element.disabled;
  var isDefaultFocus = /^(input|select|textarea|button|object|iframe)$/.test(nodeName);
  var isHyperlink = nodeName === 'a';
  var isFocusable = true;
  var isContentEditable = element.isContentEditable;

  if (isDefaultFocus || isContentEditable) {
    isFocusable = !isDisabled;
  } else {
    if (isHyperlink) {
      isFocusable = element.href || isTabIndexNotNaN;
    } else {
      isFocusable = isTabIndexNotNaN;
    }
  }

  return isFocusable;
};

function visible(element) {
  var $element = $(element);
  return $element.is(':visible') && $element.css('visibility') !== 'hidden' && $element.parents().css('visibility') !== 'hidden';
}

export var focusable = function focusable(index, element) {
  return focusableFn(element, $(element).attr('tabIndex'));
};
export var tabbable = function tabbable(index, element) {
  var tabIndex = $(element).attr('tabIndex');
  return (isNaN(tabIndex) || tabIndex >= 0) && focusableFn(element, tabIndex);
}; // note: use this method instead of is(":focus")

export var focused = function focused($element) {
  var element = $($element).get(0);
  return domAdapter.getActiveElement() === element;
};
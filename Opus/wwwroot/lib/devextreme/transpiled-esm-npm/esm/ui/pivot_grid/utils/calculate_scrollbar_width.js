import domAdapter from '../../../core/dom_adapter';
import callOnce from '../../../core/utils/call_once';
import { getScrollbarWidth } from './get_scrollbar_width';
var calculateScrollbarWidth = callOnce(function () {
  var document = domAdapter.getDocument();
  document.body.insertAdjacentHTML('beforeend', '<div style=\'position: absolute; overflow: scroll; width: 100px; height: 100px; top: -9999;\'></div>');
  var scrollbar = document.body.lastElementChild;
  var scrollbarWidth = getScrollbarWidth(scrollbar);
  document.body.removeChild(scrollbar);
  return scrollbarWidth;
});
export { calculateScrollbarWidth };
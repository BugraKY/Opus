import { setPublicElementWrapper } from '../../core/element';
import useJQueryFn from './use_jquery';
var useJQuery = useJQueryFn();

var getPublicElement = function getPublicElement($element) {
  return $element;
};

if (useJQuery) {
  setPublicElementWrapper(getPublicElement);
}
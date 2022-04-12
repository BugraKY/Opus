// eslint-disable-next-line no-restricted-imports
import jQuery from 'jquery';
import rendererBase from '../../core/renderer_base';
import useJQueryFn from './use_jquery';
var useJQuery = useJQueryFn();

if (useJQuery) {
  rendererBase.set(jQuery);
}
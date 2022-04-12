// eslint-disable-next-line no-restricted-imports
import jQuery from 'jquery';
import ajax from '../../core/utils/ajax';
import useJQueryFn from './use_jquery';
var useJQuery = useJQueryFn();

if (useJQuery) {
  ajax.inject({
    sendRequest: function sendRequest(options) {
      if (!options.responseType && !options.upload) {
        return jQuery.ajax(options);
      }

      return this.callBase.apply(this, [options]);
    }
  });
}
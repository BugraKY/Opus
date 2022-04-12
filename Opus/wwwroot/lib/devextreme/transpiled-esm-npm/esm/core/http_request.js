import { getWindow } from './utils/window';
var window = getWindow();
import injector from './utils/dependency_injector';
var nativeXMLHttpRequest = {
  getXhr: function getXhr() {
    return new window.XMLHttpRequest();
  }
};
export default injector(nativeXMLHttpRequest);
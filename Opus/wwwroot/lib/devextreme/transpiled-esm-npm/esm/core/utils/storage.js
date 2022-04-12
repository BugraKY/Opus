import { getWindow } from '../../core/utils/window';
var window = getWindow();

var getSessionStorage = function getSessionStorage() {
  var sessionStorage;

  try {
    sessionStorage = window.sessionStorage;
  } catch (e) {}

  return sessionStorage;
};

export { getSessionStorage as sessionStorage };
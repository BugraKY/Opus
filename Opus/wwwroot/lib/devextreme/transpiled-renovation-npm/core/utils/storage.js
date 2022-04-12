"use strict";

exports.sessionStorage = void 0;

var _window = require("../../core/utils/window");

var window = (0, _window.getWindow)();

var getSessionStorage = function getSessionStorage() {
  var sessionStorage;

  try {
    sessionStorage = window.sessionStorage;
  } catch (e) {}

  return sessionStorage;
};

exports.sessionStorage = getSessionStorage;
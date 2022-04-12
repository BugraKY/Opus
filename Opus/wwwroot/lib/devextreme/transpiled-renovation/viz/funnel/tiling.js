"use strict";

exports.addAlgorithm = addAlgorithm;
exports.getAlgorithm = getAlgorithm;

var _utils = require("../core/utils");

var algorithms = {};
var defaultAlgorithm;

function getAlgorithm(name) {
  return algorithms[(0, _utils.normalizeEnum)(name)] || defaultAlgorithm;
}

function addAlgorithm(name, callback, setDefault) {
  algorithms[name] = callback;

  if (setDefault) {
    defaultAlgorithm = algorithms[name];
  }
}
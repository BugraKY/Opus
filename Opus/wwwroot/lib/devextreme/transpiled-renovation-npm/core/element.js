"use strict";

exports.getPublicElement = getPublicElement;
exports.setPublicElementWrapper = setPublicElementWrapper;

var strategy = function strategy(element) {
  return element && element.get(0);
};

function getPublicElement(element) {
  return strategy(element);
}

function setPublicElementWrapper(newStrategy) {
  strategy = newStrategy;
}
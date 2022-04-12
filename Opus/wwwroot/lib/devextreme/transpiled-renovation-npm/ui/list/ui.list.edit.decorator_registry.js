"use strict";

exports.register = register;
exports.registry = void 0;

var _extend = require("../../core/utils/extend");

var registry = {};
exports.registry = registry;

function register(option, type, decoratorClass) {
  var decoratorsRegistry = registry;
  var decoratorConfig = {};
  decoratorConfig[option] = decoratorsRegistry[option] ? decoratorsRegistry[option] : {};
  decoratorConfig[option][type] = decoratorClass;
  (0, _extend.extend)(decoratorsRegistry, decoratorConfig);
}
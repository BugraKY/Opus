import { extend } from '../../core/utils/extend';
export var registry = {};
export function register(option, type, decoratorClass) {
  var decoratorsRegistry = registry;
  var decoratorConfig = {};
  decoratorConfig[option] = decoratorsRegistry[option] ? decoratorsRegistry[option] : {};
  decoratorConfig[option][type] = decoratorClass;
  extend(decoratorsRegistry, decoratorConfig);
}
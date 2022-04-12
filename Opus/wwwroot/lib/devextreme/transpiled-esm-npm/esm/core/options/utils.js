import devices from '../devices';
import { isEmptyObject, isFunction } from '../utils/type';
import { findBestMatches } from '../utils/common';
import { extend } from '../utils/extend';
import { compileGetter } from '../utils/data';
var cachedGetters = {};
export var convertRulesToOptions = rules => {
  var currentDevice = devices.current();
  return rules.reduce((options, _ref) => {
    var {
      device,
      options: ruleOptions
    } = _ref;
    var deviceFilter = device || {};
    var match = isFunction(deviceFilter) ? deviceFilter(currentDevice) : deviceMatch(currentDevice, deviceFilter);

    if (match) {
      extend(true, options, ruleOptions);
    }

    return options;
  }, {});
};
export var normalizeOptions = (options, value) => {
  return typeof options !== 'string' ? options : {
    [options]: value
  };
};
export var deviceMatch = (device, filter) => isEmptyObject(filter) || findBestMatches(device, [filter]).length > 0;
export var getFieldName = fullName => fullName.substr(fullName.lastIndexOf('.') + 1);
export var getParentName = fullName => fullName.substr(0, fullName.lastIndexOf('.'));
export var getNestedOptionValue = function getNestedOptionValue(optionsObject, name) {
  cachedGetters[name] = cachedGetters[name] || compileGetter(name);
  return cachedGetters[name](optionsObject, {
    functionsAsIs: true
  });
};
export var createDefaultOptionRules = function createDefaultOptionRules() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return options;
};
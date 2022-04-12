"use strict";

var _jquery = _interopRequireDefault(require("jquery"));

var _component_registrator_callbacks = _interopRequireDefault(require("../../core/component_registrator_callbacks"));

var _errors = _interopRequireDefault(require("../../core/errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-restricted-imports
if (_jquery.default) {
  var registerJQueryComponent = function registerJQueryComponent(name, componentClass) {
    _jquery.default.fn[name] = function (options) {
      var isMemberInvoke = typeof options === 'string';
      var result;

      if (isMemberInvoke) {
        var memberName = options;
        var memberArgs = [].slice.call(arguments).slice(1);
        this.each(function () {
          var instance = componentClass.getInstance(this);

          if (!instance) {
            throw _errors.default.Error('E0009', name);
          }

          var member = instance[memberName];
          var memberValue = member.apply(instance, memberArgs);

          if (result === undefined) {
            result = memberValue;
          }
        });
      } else {
        this.each(function () {
          var instance = componentClass.getInstance(this);

          if (instance) {
            instance.option(options);
          } else {
            new componentClass(this, options);
          }
        });
        result = this;
      }

      return result;
    };
  };

  _component_registrator_callbacks.default.add(registerJQueryComponent);
}
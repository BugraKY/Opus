// eslint-disable-next-line no-restricted-imports
import jQuery from 'jquery';
import componentRegistratorCallbacks from '../../core/component_registrator_callbacks';
import errors from '../../core/errors';

if (jQuery) {
  var registerJQueryComponent = function registerJQueryComponent(name, componentClass) {
    jQuery.fn[name] = function (options) {
      var isMemberInvoke = typeof options === 'string';
      var result;

      if (isMemberInvoke) {
        var memberName = options;
        var memberArgs = [].slice.call(arguments).slice(1);
        this.each(function () {
          var instance = componentClass.getInstance(this);

          if (!instance) {
            throw errors.Error('E0009', name);
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

  componentRegistratorCallbacks.add(registerJQueryComponent);
}
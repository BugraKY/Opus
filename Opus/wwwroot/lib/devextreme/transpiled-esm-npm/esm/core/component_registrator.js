import $ from './renderer';
import callbacks from './component_registrator_callbacks';
import errors from './errors';
import { name as publicComponentName } from './utils/public_component';

var registerComponent = function registerComponent(name, namespace, componentClass) {
  if (!componentClass) {
    componentClass = namespace;
  } else {
    namespace[name] = componentClass;
  }

  publicComponentName(componentClass, name);
  callbacks.fire(name, componentClass);
};

var registerRendererComponent = function registerRendererComponent(name, componentClass) {
  $.fn[name] = function (options) {
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

callbacks.add(registerRendererComponent);
export default registerComponent;
import $ from '../../core/renderer'; // eslint-disable-next-line no-restricted-imports

import ko from 'knockout';
import Callbacks from '../../core/utils/callbacks';
import { isPlainObject } from '../../core/utils/type';
import registerComponentCallbacks from '../../core/component_registrator_callbacks';
import Widget from '../../ui/widget/ui.widget';
import VizWidget from '../../viz/core/base_widget';
import ComponentWrapper from '../../renovation/component_wrapper/common/component';
import Draggable from '../../ui/draggable';
import { KoTemplate } from './template';
import Editor from '../../ui/editor/editor';
import Locker from '../../core/utils/locker';
import { getClosestNodeWithContext } from './utils';
import config from '../../core/config';

if (ko) {
  var LOCKS_DATA_KEY = 'dxKoLocks';
  var CREATED_WITH_KO_DATA_KEY = 'dxKoCreation';
  var editorsBindingHandlers = [];

  var registerComponentKoBinding = function registerComponentKoBinding(componentName, componentClass) {
    if (Editor.isEditor(componentClass.prototype)) {
      editorsBindingHandlers.push(componentName);
    }

    ko.bindingHandlers[componentName] = {
      init: function init(domNode, valueAccessor) {
        var $element = $(domNode);
        var optionChangedCallbacks = Callbacks();
        var optionsByReference = {};
        var component;
        var knockoutConfig = config().knockout;
        var isBindingPropertyPredicateName = knockoutConfig && knockoutConfig.isBindingPropertyPredicateName;
        var isBindingPropertyPredicate;
        var ctorOptions = {
          onInitializing: function onInitializing(options) {
            optionsByReference = this._getOptionsByReference();
            ko.computed(() => {
              var model = ko.unwrap(valueAccessor());

              if (component) {
                component.beginUpdate();
              }

              isBindingPropertyPredicate = isBindingPropertyPredicateName && model && model[isBindingPropertyPredicateName];
              unwrapModel(model);

              if (component) {
                component.endUpdate();
              } else {
                var _model$onInitializing;

                model === null || model === void 0 ? void 0 : (_model$onInitializing = model.onInitializing) === null || _model$onInitializing === void 0 ? void 0 : _model$onInitializing.call(this, options);
              }
            }, null, {
              disposeWhenNodeIsRemoved: domNode
            });
            component = this;
          },
          modelByElement: function modelByElement($element) {
            if ($element.length) {
              var node = getClosestNodeWithContext($element.get(0));
              return ko.dataFor(node);
            }
          },
          nestedComponentOptions: function nestedComponentOptions(component) {
            return {
              modelByElement: component.option('modelByElement'),
              nestedComponentOptions: component.option('nestedComponentOptions')
            };
          },
          _optionChangedCallbacks: optionChangedCallbacks,
          integrationOptions: {
            watchMethod: function watchMethod(fn, callback, options) {
              options = options || {};
              var skipCallback = options.skipImmediate;
              var watcher = ko.computed(function () {
                var newValue = ko.unwrap(fn());

                if (!skipCallback) {
                  callback(newValue);
                }

                skipCallback = false;
              });
              return function () {
                watcher.dispose();
              };
            },
            templates: {
              'dx-polymorph-widget': {
                render: function render(options) {
                  var widgetName = ko.utils.unwrapObservable(options.model.widget);

                  if (!widgetName) {
                    return;
                  }

                  var markup = $('<div>').attr('data-bind', widgetName + ': options').get(0);
                  $(options.container).append(markup);
                  ko.applyBindings(options.model, markup);
                }
              }
            },
            createTemplate: function createTemplate(element) {
              return new KoTemplate(element);
            }
          }
        };
        var optionNameToModelMap = {};

        var applyModelValueToOption = function applyModelValueToOption(optionName, modelValue, unwrap) {
          var locks = $element.data(LOCKS_DATA_KEY);
          var optionValue = unwrap ? ko.unwrap(modelValue) : modelValue;

          if (ko.isWriteableObservable(modelValue)) {
            optionNameToModelMap[optionName] = modelValue;
          }

          if (component) {
            if (locks.locked(optionName)) {
              return;
            }

            locks.obtain(optionName);

            try {
              if (ko.ignoreDependencies) {
                ko.ignoreDependencies(component.option, component, [optionName, optionValue]);
              } else {
                component.option(optionName, optionValue);
              }
            } finally {
              locks.release(optionName);
            }
          } else {
            ctorOptions[optionName] = optionValue;
          }
        };

        var handleOptionChanged = function handleOptionChanged(args) {
          var optionName = args.fullName;
          var optionValue = args.value;

          if (!(optionName in optionNameToModelMap)) {
            return;
          }

          var $element = this._$element;
          var locks = $element.data(LOCKS_DATA_KEY);

          if (locks.locked(optionName)) {
            return;
          }

          locks.obtain(optionName);

          try {
            optionNameToModelMap[optionName](optionValue);
          } finally {
            locks.release(optionName);
          }
        };

        var createComponent = function createComponent() {
          optionChangedCallbacks.add(handleOptionChanged);
          $element.data(CREATED_WITH_KO_DATA_KEY, true).data(LOCKS_DATA_KEY, new Locker());
          new componentClass($element, ctorOptions);
          ctorOptions = null;
        };

        var unwrapModelValue = function unwrapModelValue(currentModel, propertyName, propertyPath) {
          if (propertyPath === isBindingPropertyPredicateName) {
            return;
          }

          if (!isBindingPropertyPredicate || isBindingPropertyPredicate(propertyPath, propertyName, currentModel)) {
            var unwrappedPropertyValue;
            ko.computed(function () {
              var propertyValue = currentModel[propertyName];
              applyModelValueToOption(propertyPath, propertyValue, true);
              unwrappedPropertyValue = ko.unwrap(propertyValue);
            }, null, {
              disposeWhenNodeIsRemoved: domNode
            });

            if (isPlainObject(unwrappedPropertyValue)) {
              if (!optionsByReference[propertyPath]) {
                unwrapModel(unwrappedPropertyValue, propertyPath);
              }
            }
          } else {
            applyModelValueToOption(propertyPath, currentModel[propertyName], false);
          }
        };

        function unwrapModel(model, propertyPath) {
          for (var propertyName in model) {
            if (Object.prototype.hasOwnProperty.call(model, propertyName)) {
              unwrapModelValue(model, propertyName, propertyPath ? [propertyPath, propertyName].join('.') : propertyName);
            }
          }
        }

        createComponent();
        return {
          controlsDescendantBindings: componentClass.subclassOf(Widget) || componentClass.subclassOf(VizWidget) || componentClass.subclassOf(ComponentWrapper) || component instanceof Draggable
        };
      }
    };

    if (componentName === 'dxValidator') {
      ko.bindingHandlers['dxValidator'].after = editorsBindingHandlers;
    }
  };

  registerComponentCallbacks.add(function (name, componentClass) {
    registerComponentKoBinding(name, componentClass);
  });
}
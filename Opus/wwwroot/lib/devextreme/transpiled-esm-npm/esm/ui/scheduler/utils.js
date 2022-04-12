import _extends from "@babel/runtime/helpers/esm/extends";
import { getOuterHeight, setHeight, setWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import { each } from '../../core/utils/iterator';
import { APPOINTMENT_SETTINGS_KEY } from './constants';
import { getPublicElement } from '../../core/element';
import { compileGetter, compileSetter } from '../../core/utils/data';
import dateSerialization from '../../core/utils/date_serialization';
export var utils = {
  dataAccessors: {
    getAppointmentSettings: element => {
      return $(element).data(APPOINTMENT_SETTINGS_KEY);
    },
    getAppointmentInfo: element => {
      var settings = utils.dataAccessors.getAppointmentSettings(element);
      return settings === null || settings === void 0 ? void 0 : settings.info;
    },
    create: (fields, currentDataAccessors, forceIsoDateParsing, dateSerializationFormat) => {
      var isDateField = field => field === 'startDate' || field === 'endDate';

      var defaultDataAccessors = {
        getter: {},
        setter: {},
        expr: {}
      };
      var dataAccessors = currentDataAccessors ? _extends({}, currentDataAccessors) : defaultDataAccessors;
      each(fields, (name, expr) => {
        if (expr) {
          var getter = compileGetter(expr);
          var setter = compileSetter(expr);
          var dateGetter;
          var dateSetter;
          var serializationFormat;

          if (isDateField(name)) {
            dateGetter = object => {
              var value = getter(object);

              if (forceIsoDateParsing) {
                value = dateSerialization.deserializeDate(value);
              }

              return value;
            };

            dateSetter = (object, value) => {
              if (dateSerializationFormat) {
                serializationFormat = dateSerializationFormat;
              } else if (forceIsoDateParsing && !serializationFormat) {
                var oldValue = getter(object);
                serializationFormat = dateSerialization.getDateSerializationFormat(oldValue);
              }

              var newValue = dateSerialization.serializeDate(value, serializationFormat);
              setter(object, newValue);
            };
          }

          dataAccessors.getter[name] = dateGetter || getter;
          dataAccessors.setter[name] = dateSetter || setter;
          dataAccessors.expr["".concat(name, "Expr")] = expr;
        } else {
          delete dataAccessors.getter[name];
          delete dataAccessors.setter[name];
          delete dataAccessors.expr["".concat(name, "Expr")];
        }
      });
      return dataAccessors;
    }
  },
  DOM: {
    getHeaderHeight: header => {
      return header ? header._$element && parseInt(getOuterHeight(header._$element), 10) : 0;
    }
  },
  renovation: {
    renderComponent: (widget, parentElement, componentClass, componentName, viewModel) => {
      var component = widget[componentName];

      if (!component) {
        var container = getPublicElement(parentElement);
        component = widget._createComponent(container, componentClass, viewModel);
        widget[componentName] = component;
      } else {
        // TODO: this is a workaround for setTablesSizes. Remove after CSS refactoring
        var $element = component.$element();
        var elementStyle = $element.get(0).style;
        var height = elementStyle.height;
        var width = elementStyle.width;
        component.option(viewModel);

        if (height) {
          setHeight($element, height);
        }

        if (width) {
          setWidth($element, width);
        }
      }
    }
  }
};
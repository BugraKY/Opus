import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["appointmentTemplate", "appointments", "isAllDay", "overflowIndicatorTemplate", "overflowIndicators"];
import { createVNode, createComponentVNode, normalizeProps } from "inferno";
import { InfernoWrapperComponent } from "@devextreme/runtime/inferno";
import { Appointment } from "./appointment";
import { OverflowIndicator } from "./overflow_indicator/layout";
import { combineClasses } from "../../../utils/combine_classes";
export var viewFunction = _ref => {
  var {
    classes,
    props: {
      appointmentTemplate,
      appointments,
      overflowIndicatorTemplate,
      overflowIndicators
    }
  } = _ref;
  return createVNode(1, "div", classes, [appointments.map((item, index) => createComponentVNode(2, Appointment, {
    "viewModel": item,
    "appointmentTemplate": appointmentTemplate,
    "index": index
  }, item.key)), overflowIndicators.map(item => createComponentVNode(2, OverflowIndicator, {
    "viewModel": item,
    "overflowIndicatorTemplate": overflowIndicatorTemplate
  }, item.key))], 0);
};
export var AppointmentLayoutProps = {
  isAllDay: false,

  get appointments() {
    return [];
  },

  get overflowIndicators() {
    return [];
  }

};
import { createReRenderEffect } from "@devextreme/runtime/inferno";

var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);

export class AppointmentLayout extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createEffects() {
    return [createReRenderEffect()];
  }

  get classes() {
    var {
      isAllDay
    } = this.props;
    return combineClasses({
      "dx-scheduler-scrollable-appointments": !isAllDay,
      "dx-scheduler-all-day-appointments": isAllDay
    });
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        appointmentTemplate: getTemplate(props.appointmentTemplate),
        overflowIndicatorTemplate: getTemplate(props.overflowIndicatorTemplate)
      }),
      classes: this.classes,
      restAttributes: this.restAttributes
    });
  }

}
AppointmentLayout.defaultProps = AppointmentLayoutProps;
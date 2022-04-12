import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["appointmentTemplate", "index", "viewModel"];
import { createVNode, createComponentVNode, normalizeProps } from "inferno";
import { BaseInfernoComponent, normalizeStyles } from "@devextreme/runtime/inferno";
import { getAppointmentStyles } from "./utils";
import { AppointmentContent } from "./content";
import { combineClasses } from "../../../utils/combine_classes";
export var viewFunction = _ref => {
  var {
    classes,
    data,
    dateText,
    index,
    isReduced,
    props: {
      appointmentTemplate,
      viewModel: {
        info: {
          isRecurrent
        }
      }
    },
    styles,
    text
  } = _ref;
  var AppointmentTemplate = appointmentTemplate;
  return createVNode(1, "div", classes, [!!appointmentTemplate && AppointmentTemplate({
    data: data,
    index: index
  }), !appointmentTemplate && createComponentVNode(2, AppointmentContent, {
    "text": text,
    "dateText": dateText,
    "isRecurrent": isRecurrent,
    "isReduced": isReduced
  })], 0, {
    "style": normalizeStyles(styles),
    "title": text,
    "role": "button"
  });
};
export var AppointmentProps = {
  index: 0
};

var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);

export class Appointment extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get text() {
    return this.props.viewModel.appointment.text;
  }

  get dateText() {
    return this.props.viewModel.info.dateText;
  }

  get styles() {
    return getAppointmentStyles(this.props.viewModel);
  }

  get data() {
    return {
      appointmentData: this.props.viewModel.info.appointment,
      targetedAppointmentData: this.props.viewModel.appointment
    };
  }

  get index() {
    return this.props.index;
  }

  get isReduced() {
    var {
      appointmentReduced
    } = this.props.viewModel.info;
    return !!appointmentReduced;
  }

  get classes() {
    var {
      allDay,
      appointmentReduced,
      direction,
      isRecurrent
    } = this.props.viewModel.info;
    var isVerticalDirection = direction === "vertical";
    return combineClasses({
      "dx-scheduler-appointment": true,
      "dx-scheduler-appointment-horizontal": !isVerticalDirection,
      "dx-scheduler-appointment-vertical": isVerticalDirection,
      "dx-scheduler-appointment-recurrence": isRecurrent,
      "dx-scheduler-all-day-appointment": allDay,
      "dx-scheduler-appointment-reduced": this.isReduced,
      "dx-scheduler-appointment-head": appointmentReduced === "head",
      "dx-scheduler-appointment-body": appointmentReduced === "body",
      "dx-scheduler-appointment-tail": appointmentReduced === "tail"
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
        appointmentTemplate: getTemplate(props.appointmentTemplate)
      }),
      text: this.text,
      dateText: this.dateText,
      styles: this.styles,
      data: this.data,
      index: this.index,
      isReduced: this.isReduced,
      classes: this.classes,
      restAttributes: this.restAttributes
    });
  }

}
Appointment.defaultProps = AppointmentProps;
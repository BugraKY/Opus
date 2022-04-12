import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["className", "getTextAndFormatDate", "index", "item", "itemContentTemplate", "onDelete", "onHide", "showDeleteButton", "singleAppointment"];
import { createVNode, createComponentVNode, normalizeProps } from "inferno";
import { BaseInfernoComponent } from "@devextreme/runtime/inferno";
import { Marker } from "./marker";
import { Button } from "../../button";
import { TooltipItemContent } from "./item_content";
import getCurrentAppointment from "./utils/get_current_appointment";
import { defaultGetTextAndFormatDate } from "./utils/default_functions";
export var viewFunction = viewModel => {
  var ItemContentTemplate = viewModel.props.itemContentTemplate;
  return viewModel.props.itemContentTemplate ? ItemContentTemplate({
    model: {
      appointmentData: viewModel.props.item.data,
      targetedAppointmentData: viewModel.currentAppointment
    },
    index: viewModel.props.index
  }) : normalizeProps(createVNode(1, "div", "dx-tooltip-appointment-item ".concat(viewModel.props.className), [createComponentVNode(2, Marker), createComponentVNode(2, TooltipItemContent, {
    "text": viewModel.formattedContent.text,
    "formattedDate": viewModel.formattedContent.formatDate
  }), viewModel.props.showDeleteButton && createVNode(1, "div", "dx-tooltip-appointment-item-delete-button-container", createComponentVNode(2, Button, {
    "className": "dx-tooltip-appointment-item-delete-button",
    "icon": "trash",
    "stylingMode": "text",
    "onClick": viewModel.onDeleteButtonClick
  }), 2)], 0, _extends({}, viewModel.restAttributes)));
};
export var TooltipItemLayoutProps = {
  className: "",

  get item() {
    return {
      data: {}
    };
  },

  index: 0,
  showDeleteButton: true,
  getTextAndFormatDate: defaultGetTextAndFormatDate,

  get singleAppointment() {
    return {};
  }

};

var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);

export class TooltipItemLayout extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
  }

  get currentAppointment() {
    var {
      item
    } = this.props;
    return getCurrentAppointment(item);
  }

  get onDeleteButtonClick() {
    if (this.__getterCache["onDeleteButtonClick"] !== undefined) {
      return this.__getterCache["onDeleteButtonClick"];
    }

    return this.__getterCache["onDeleteButtonClick"] = (() => {
      var {
        item,
        onDelete,
        onHide,
        singleAppointment
      } = this.props;
      return e => {
        onHide === null || onHide === void 0 ? void 0 : onHide();
        e.event.stopPropagation();
        onDelete === null || onDelete === void 0 ? void 0 : onDelete(item.data, singleAppointment);
      };
    })();
  }

  get formattedContent() {
    if (this.__getterCache["formattedContent"] !== undefined) {
      return this.__getterCache["formattedContent"];
    }

    return this.__getterCache["formattedContent"] = (() => {
      var {
        getTextAndFormatDate,
        item
      } = this.props;
      var {
        data
      } = item;
      return getTextAndFormatDate(data, this.currentAppointment);
    })();
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  componentWillUpdate(nextProps, nextState, context) {
    if (this.props["item"] !== nextProps["item"] || this.props["onDelete"] !== nextProps["onDelete"] || this.props["onHide"] !== nextProps["onHide"] || this.props["singleAppointment"] !== nextProps["singleAppointment"]) {
      this.__getterCache["onDeleteButtonClick"] = undefined;
    }

    if (this.props["getTextAndFormatDate"] !== nextProps["getTextAndFormatDate"] || this.props["item"] !== nextProps["item"]) {
      this.__getterCache["formattedContent"] = undefined;
    }
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        itemContentTemplate: getTemplate(props.itemContentTemplate)
      }),
      currentAppointment: this.currentAppointment,
      onDeleteButtonClick: this.onDeleteButtonClick,
      formattedContent: this.formattedContent,
      restAttributes: this.restAttributes
    });
  }

}
TooltipItemLayout.defaultProps = TooltipItemLayoutProps;
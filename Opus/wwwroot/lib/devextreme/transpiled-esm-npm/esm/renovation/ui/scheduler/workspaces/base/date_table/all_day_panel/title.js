import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode } from "inferno";
import { InfernoWrapperComponent } from "@devextreme/runtime/inferno";
import messageLocalization from "../../../../../../../localization/message";
export var viewFunction = viewModel => createVNode(1, "div", "dx-scheduler-all-day-title", viewModel.text, 0);
export var AllDayPanelTitleProps = {};
import { createReRenderEffect } from "@devextreme/runtime/inferno";
export class AllDayPanelTitle extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createEffects() {
    return [createReRenderEffect()];
  }

  get text() {
    return messageLocalization.format("dxScheduler-allDay");
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _extends({}, _this$props);

    return restProps;
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      text: this.text,
      restAttributes: this.restAttributes
    });
  }

}
AllDayPanelTitle.defaultProps = AllDayPanelTitleProps;
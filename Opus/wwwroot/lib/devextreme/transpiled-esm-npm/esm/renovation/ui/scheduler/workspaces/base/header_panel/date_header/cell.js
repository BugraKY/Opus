import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["allDay", "ariaLabel", "children", "className", "colSpan", "contentTemplate", "contentTemplateProps", "dateCellTemplate", "endDate", "groupIndex", "groups", "index", "isFirstGroupCell", "isLastGroupCell", "isTimeCellTemplate", "isWeekDayCell", "startDate", "text", "timeCellTemplate", "today"];
import { createVNode, createFragment, createComponentVNode, normalizeProps } from "inferno";
import { Fragment } from "inferno";
import { BaseInfernoComponent } from "@devextreme/runtime/inferno";
import { CellBaseProps } from "../../cell";
import { combineClasses } from "../../../../../../utils/combine_classes";
import { getGroupCellClasses } from "../../../utils";
export var viewFunction = _ref => {
  var {
    classes,
    props: {
      colSpan,
      dateCellTemplate: DateCellTemplate,
      groupIndex,
      groups,
      index,
      isTimeCellTemplate,
      startDate,
      text,
      timeCellTemplate: TimeCellTemplate
    },
    useTemplate
  } = _ref;
  return createVNode(1, "th", classes, useTemplate ? createFragment([isTimeCellTemplate && TimeCellTemplate && TimeCellTemplate({
    data: {
      date: startDate,
      text,
      groups,
      groupIndex
    },
    index: index
  }), !isTimeCellTemplate && DateCellTemplate && DateCellTemplate({
    data: {
      date: startDate,
      text,
      groups,
      groupIndex
    },
    index: index
  })], 0) : text, 0, {
    "colSpan": colSpan,
    "title": text
  });
};
export var DateHeaderCellProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(CellBaseProps), Object.getOwnPropertyDescriptors({
  today: false,
  colSpan: 1,
  isWeekDayCell: false,
  isTimeCellTemplate: false
})));

var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);

export class DateHeaderCell extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get classes() {
    var {
      className,
      isFirstGroupCell,
      isLastGroupCell,
      isWeekDayCell,
      today
    } = this.props;
    var cellClasses = combineClasses({
      "dx-scheduler-header-panel-cell": true,
      "dx-scheduler-cell-sizes-horizontal": true,
      "dx-scheduler-header-panel-current-time-cell": today,
      "dx-scheduler-header-panel-week-cell": isWeekDayCell,
      [className]: !!className
    });
    return getGroupCellClasses(isFirstGroupCell, isLastGroupCell, cellClasses);
  }

  get useTemplate() {
    var {
      dateCellTemplate,
      isTimeCellTemplate,
      timeCellTemplate
    } = this.props;
    return !isTimeCellTemplate && !!dateCellTemplate || isTimeCellTemplate && !!timeCellTemplate;
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
        timeCellTemplate: getTemplate(props.timeCellTemplate),
        dateCellTemplate: getTemplate(props.dateCellTemplate),
        contentTemplate: getTemplate(props.contentTemplate)
      }),
      classes: this.classes,
      useTemplate: this.useTemplate,
      restAttributes: this.restAttributes
    });
  }

}
DateHeaderCell.defaultProps = DateHeaderCellProps;
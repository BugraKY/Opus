import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["dateCellTemplate", "dateHeaderData", "groupByDate", "groupOrientation", "groups", "timeCellTemplate"];
import { createFragment, createComponentVNode, normalizeProps } from "inferno";
import { Fragment } from "inferno";
import { BaseInfernoComponent } from "@devextreme/runtime/inferno";
import { Row } from "../../../base/row";
import { isHorizontalGroupingApplied } from "../../../utils";
import { DateHeaderCell } from "../../../base/header_panel/date_header/cell";
import { DateHeaderLayoutProps } from "../../../base/header_panel/date_header/layout";
export var viewFunction = _ref => {
  var {
    isHorizontalGrouping,
    props: {
      dateCellTemplate,
      dateHeaderData,
      timeCellTemplate
    }
  } = _ref;
  var {
    dataMap,
    leftVirtualCellCount,
    leftVirtualCellWidth,
    rightVirtualCellCount,
    rightVirtualCellWidth,
    weekDayLeftVirtualCellCount,
    weekDayLeftVirtualCellWidth,
    weekDayRightVirtualCellCount,
    weekDayRightVirtualCellWidth
  } = dateHeaderData;
  return createFragment(dataMap.map((dateHeaderRow, rowIndex) => {
    var rowsCount = dataMap.length;
    var isTimeCellTemplate = rowsCount - 1 === rowIndex;
    var isWeekDayRow = rowsCount > 1 && rowIndex === 0;
    var validLeftVirtualCellCount = leftVirtualCellCount;
    var validRightVirtualCellCount = rightVirtualCellCount;
    var validRightVirtualCellWidth = rightVirtualCellWidth;
    var validLeftVirtualCellWidth = leftVirtualCellWidth;

    if (isWeekDayRow) {
      validLeftVirtualCellCount = weekDayLeftVirtualCellCount;
      validRightVirtualCellCount = weekDayRightVirtualCellCount;
      validRightVirtualCellWidth = weekDayRightVirtualCellWidth;
      validLeftVirtualCellWidth = weekDayLeftVirtualCellWidth;
    }

    return createComponentVNode(2, Row, {
      "className": "dx-scheduler-header-row",
      "leftVirtualCellWidth": validLeftVirtualCellWidth,
      "leftVirtualCellCount": validLeftVirtualCellCount,
      "rightVirtualCellWidth": validRightVirtualCellWidth,
      "rightVirtualCellCount": validRightVirtualCellCount,
      children: dateHeaderRow.map(_ref2 => {
        var {
          colSpan,
          endDate,
          groupIndex,
          groups: cellGroups,
          index,
          isFirstGroupCell,
          isLastGroupCell,
          key,
          startDate,
          text,
          today
        } = _ref2;
        return createComponentVNode(2, DateHeaderCell, {
          "startDate": startDate,
          "endDate": endDate,
          "groups": isHorizontalGrouping ? cellGroups : undefined,
          "groupIndex": isHorizontalGrouping ? groupIndex : undefined,
          "today": today,
          "index": index,
          "text": text,
          "isFirstGroupCell": isFirstGroupCell,
          "isLastGroupCell": isLastGroupCell,
          "isWeekDayCell": isWeekDayRow,
          "colSpan": colSpan,
          "dateCellTemplate": dateCellTemplate,
          "timeCellTemplate": timeCellTemplate,
          "isTimeCellTemplate": isTimeCellTemplate
        }, key);
      })
    }, rowIndex.toString());
  }), 0);
};

var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);

export class TimelineDateHeaderLayout extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get isHorizontalGrouping() {
    var {
      groupByDate,
      groupOrientation,
      groups
    } = this.props;
    return isHorizontalGroupingApplied(groups, groupOrientation) && !groupByDate;
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
        dateCellTemplate: getTemplate(props.dateCellTemplate),
        timeCellTemplate: getTemplate(props.timeCellTemplate)
      }),
      isHorizontalGrouping: this.isHorizontalGrouping,
      restAttributes: this.restAttributes
    });
  }

}
TimelineDateHeaderLayout.defaultProps = DateHeaderLayoutProps;
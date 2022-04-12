import { addToStyles } from "../../workspaces/utils";
export var getOverflowIndicatorStyles = viewModel => {
  var {
    color,
    geometry: {
      height,
      left,
      top,
      width
    }
  } = viewModel;
  var result = addToStyles([{
    attr: "left",
    value: "".concat(left, "px")
  }, {
    attr: "top",
    value: "".concat(top, "px")
  }, {
    attr: "width",
    value: "".concat(width, "px")
  }, {
    attr: "height",
    value: "".concat(height, "px")
  }]);

  if (color) {
    result = addToStyles([{
      attr: "backgroundColor",
      value: color
    }, {
      attr: "boxShadow",
      value: "inset ".concat(width, "px 0 0 0 rgba(0, 0, 0, 0.3)")
    }], result);
  }

  return result;
};
export var getOverflowIndicatorColor = (color, colors) => !colors.length || colors.filter(item => item !== color).length === 0 ? color : undefined;
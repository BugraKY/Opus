import { addToStyles } from "../workspaces/utils";
export var getAppointmentStyles = item => {
  var defaultSize = 50;
  var {
    geometry: {
      height,
      left,
      top,
      width
    },
    info: {
      resourceColor
    }
  } = item;
  var result = addToStyles([{
    attr: "height",
    value: "".concat(height || defaultSize, "px")
  }, {
    attr: "width",
    value: "".concat(width || defaultSize, "px")
  }, {
    attr: "top",
    value: "".concat(top, "px")
  }, {
    attr: "left",
    value: "".concat(left, "px")
  }]);

  if (resourceColor) {
    result = addToStyles([{
      attr: "backgroundColor",
      value: resourceColor
    }], result);
  }

  return result;
};
export var getAppointmentKey = geometry => {
  var {
    height,
    left,
    top,
    width
  } = geometry;
  return "".concat(left, "-").concat(top, "-").concat(width, "-").concat(height);
};
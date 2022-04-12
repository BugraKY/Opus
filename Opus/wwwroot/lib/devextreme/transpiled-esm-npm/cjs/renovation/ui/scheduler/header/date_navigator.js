"use strict";

exports.getDateNavigator = void 0;

var _themes = require("../../../../ui/themes");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DATE_NAVIGATOR_CLASS = "dx-scheduler-navigator";
var PREVIOUS_BUTTON_CLASS = "dx-scheduler-navigator-previous";
var CALENDAR_BUTTON_CLASS = "dx-scheduler-navigator-caption";
var NEXT_BUTTON_CLASS = "dx-scheduler-navigator-next";
var DIRECTION_LEFT = -1;
var DIRECTION_RIGHT = 1;

var getPreviousButtonOptions = function getPreviousButtonOptions(isPreviousButtonDisabled) {
  return {
    icon: "chevronprev",
    elementAttr: {
      class: PREVIOUS_BUTTON_CLASS
    },
    disabled: isPreviousButtonDisabled
  };
};

var getCalendarButtonOptions = function getCalendarButtonOptions(captionText) {
  return {
    text: captionText,
    elementAttr: {
      class: CALENDAR_BUTTON_CLASS
    }
  };
};

var getNextButtonOptions = function getNextButtonOptions(isNextButtonDisabled) {
  return {
    icon: "chevronnext",
    elementAttr: {
      class: NEXT_BUTTON_CLASS
    },
    disabled: isNextButtonDisabled
  };
};

var getDateNavigator = function getDateNavigator(item, showCalendar, captionText, updateDateByDirection, isPreviousButtonDisabled, isNextButtonDisabled) {
  var items = [getPreviousButtonOptions(isPreviousButtonDisabled), getCalendarButtonOptions(captionText), getNextButtonOptions(isNextButtonDisabled)];
  var stylingMode = (0, _themes.isMaterial)((0, _themes.current)()) ? "text" : "contained";
  return _extends({
    widget: "dxButtonGroup",
    cssClass: DATE_NAVIGATOR_CLASS,
    options: {
      items: items,
      stylingMode: stylingMode,
      selectionMode: "none",
      onItemClick: function onItemClick(e) {
        switch (e.itemIndex) {
          case 0:
            updateDateByDirection(DIRECTION_LEFT);
            break;

          case 1:
            showCalendar();
            break;

          case 2:
            updateDateByDirection(DIRECTION_RIGHT);
            break;

          default:
            break;
        }
      }
    }
  }, item);
};

exports.getDateNavigator = getDateNavigator;
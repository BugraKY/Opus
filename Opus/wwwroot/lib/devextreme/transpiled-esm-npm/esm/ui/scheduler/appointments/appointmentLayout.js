import $ from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import messageLocalization from '../../../localization/message';
import { APPOINTMENT_CONTENT_CLASSES } from '../classes';
var allDayText = ' ' + messageLocalization.format('dxScheduler-allDay') + ': ';
export var createAppointmentLayout = (formatText, config) => {
  var result = $(domAdapter.createDocumentFragment());
  $('<div>').text(formatText.text).addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_TITLE).appendTo(result);

  if (config.html) {
    result.html(config.html);
  }

  var $contentDetails = $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS).appendTo(result);
  $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_DATE).text(formatText.formatDate).appendTo($contentDetails);
  config.isRecurrence && $('<span>').addClass(APPOINTMENT_CONTENT_CLASSES.RECURRING_ICON + ' dx-icon-repeat').appendTo(result);
  config.isAllDay && $('<div>').text(allDayText).addClass(APPOINTMENT_CONTENT_CLASSES.ALL_DAY_CONTENT).prependTo($contentDetails);
  return result;
};
export var createAgendaAppointmentLayout = (formatText, config) => {
  var result = $(domAdapter.createDocumentFragment());
  var leftLayoutContainer = $('<div>').addClass('dx-scheduler-agenda-appointment-left-layout').appendTo(result);
  var rightLayoutContainer = $('<div>').addClass('dx-scheduler-agenda-appointment-right-layout').appendTo(result); // eslint-disable-next-line no-unused-vars

  var marker = $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.AGENDA_MARKER).appendTo(leftLayoutContainer);
  config.isRecurrence && $('<span>').addClass(APPOINTMENT_CONTENT_CLASSES.RECURRING_ICON + ' dx-icon-repeat').appendTo(marker); // eslint-disable-next-line no-unused-vars

  var text = $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_TITLE).text(formatText.text).appendTo(rightLayoutContainer);
  var additionalContainer = $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS).appendTo(rightLayoutContainer); // eslint-disable-next-line no-unused-vars

  var date = $('<div>').addClass(APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_DATE).text(formatText.formatDate).appendTo(additionalContainer);
  config.isAllDay && $('<div>').text(allDayText).addClass(APPOINTMENT_CONTENT_CLASSES.ALL_DAY_CONTENT).prependTo(additionalContainer);
  return result;
};
var normalizeDate = (options, date, sourceDate, isStartDate) => {
  if (!options.considerTime) {
    return date;
  }

  var result = new Date(date);
  result.setHours(sourceDate.getHours(), sourceDate.getMinutes(), sourceDate.getSeconds());
  var {
    startDayHour,
    endDayHour,
    appointmentSettings: {
      allDay
    }
  } = options;
  var minDate = new Date(date);
  var maxDate = new Date(date);
  minDate.setHours(startDayHour, 0, 0, 0);
  maxDate.setHours(endDayHour, 0, 0, 0);
  var isDateOutInterval = isStartDate ? result < minDate.getTime() || result >= maxDate.getTime() : result <= minDate.getTime() || result > maxDate.getTime();

  if (isDateOutInterval) {
    result = !allDay ? maxDate : minDate;
  }

  return result;
};

export var normalizeStartDate = (options, startDate, sourceStartDate) => {
  return normalizeDate(options, startDate, sourceStartDate, true);
};
export var normalizeEndDate = (options, endDate, sourceEndDate) => {
  return normalizeDate(options, endDate, sourceEndDate, false);
};
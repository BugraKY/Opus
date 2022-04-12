import core from './localization/core';
import message from './localization/message';
import number from './localization/number';
import date from './localization/date';
import './localization/currency';
/**
 * @name localization
 */

export var locale = core.locale.bind(core);
export var loadMessages = message.load.bind(message);
export var formatMessage = message.format.bind(message);
export var formatNumber = number.format.bind(number);
export var parseNumber = number.parse.bind(number);
export var formatDate = date.format.bind(date);
export var parseDate = date.parse.bind(date);
export { message, number, date };
export function disableIntl() {
  if (number.engine() === 'intl') {
    number.resetInjection();
  }

  if (date.engine() === 'intl') {
    date.resetInjection();
  }
}
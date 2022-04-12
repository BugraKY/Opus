import { hasWindow, getWindow } from '../../core/utils/window';
var number = hasWindow() ? getWindow().Number : Number;

number.isFinite = number.isFinite || function (value) {
  return typeof value === 'number' && isFinite(value);
};

export default number;
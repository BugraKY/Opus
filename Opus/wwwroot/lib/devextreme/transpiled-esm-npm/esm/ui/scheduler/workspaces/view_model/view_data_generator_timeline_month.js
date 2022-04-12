import { ViewDataGenerator } from './view_data_generator';
import { calculateCellIndex } from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/month';
import { calculateStartViewDate } from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/timeline_month';
import { setOptionHour } from '../../../../renovation/ui/scheduler/view_model/to_test/views/utils/base';
import dateUtils from '../../../../core/utils/date';
var DAY_IN_MILLISECONDS = dateUtils.dateToMilliseconds('day');
export class ViewDataGeneratorTimelineMonth extends ViewDataGenerator {
  _calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount) {
    return calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount);
  }

  calculateEndDate(startDate, interval, endDayHour) {
    return setOptionHour(startDate, endDayHour);
  }

  getInterval() {
    return DAY_IN_MILLISECONDS;
  }

  _calculateStartViewDate(options) {
    return calculateStartViewDate(options.currentDate, options.startDayHour, options.startDate, options.intervalCount);
  }

  getCellCount(options) {
    var {
      intervalCount,
      currentDate
    } = options;
    var cellCount = 0;

    for (var i = 1; i <= intervalCount; i++) {
      cellCount += new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 0).getDate();
    }

    return cellCount;
  }

  setHiddenInterval() {
    this.hiddenInterval = 0;
  }

}
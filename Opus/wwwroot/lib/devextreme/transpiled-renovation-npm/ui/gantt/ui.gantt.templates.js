"use strict";

exports.GanttTemplatesManager = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _element = require("../../core/element");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GanttTemplatesManager = /*#__PURE__*/function () {
  function GanttTemplatesManager(gantt) {
    this._gantt = gantt;
  }

  var _proto = GanttTemplatesManager.prototype;

  _proto.getTaskTooltipContentTemplateFunc = function getTaskTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
    var _this = this;

    var isTooltipShowing = true;

    var template = taskTooltipContentTemplateOption && this._gantt._getTemplate(taskTooltipContentTemplateOption);

    var createTemplateFunction = template && function (container, item, callback) {
      template.render({
        model: _this._gantt.getTaskDataByCoreData(item),
        container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
        onRendered: function onRendered() {
          callback();
        }
      });
      return isTooltipShowing;
    };

    return createTemplateFunction;
  };

  _proto.getTaskProgressTooltipContentTemplateFunc = function getTaskProgressTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
    var isTooltipShowing = true;

    var template = taskTooltipContentTemplateOption && this._gantt._getTemplate(taskTooltipContentTemplateOption);

    var createTemplateFunction = template && function (container, item, callback) {
      template.render({
        model: item,
        container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
        onRendered: function onRendered() {
          callback();
        }
      });
      return isTooltipShowing;
    };

    return createTemplateFunction;
  };

  _proto.getTaskTimeTooltipContentTemplateFunc = function getTaskTimeTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
    var isTooltipShowing = true;

    var template = taskTooltipContentTemplateOption && this._gantt._getTemplate(taskTooltipContentTemplateOption);

    var createTemplateFunction = template && function (container, item, callback) {
      template.render({
        model: item,
        container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
        onRendered: function onRendered() {
          callback();
        }
      });
      return isTooltipShowing;
    };

    return createTemplateFunction;
  };

  _proto.getTaskContentTemplateFunc = function getTaskContentTemplateFunc(taskContentTemplateOption) {
    var _this2 = this;

    var isTaskShowing = true;

    var template = taskContentTemplateOption && this._gantt._getTemplate(taskContentTemplateOption);

    var createTemplateFunction = template && function (container, item, callback, index) {
      item.taskData = _this2._gantt.getTaskDataByCoreData(item.taskData);
      template.render({
        model: item,
        container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
        onRendered: function onRendered() {
          callback(container, index);
        }
      });
      return isTaskShowing;
    };

    return createTemplateFunction;
  };

  return GanttTemplatesManager;
}();

exports.GanttTemplatesManager = GanttTemplatesManager;
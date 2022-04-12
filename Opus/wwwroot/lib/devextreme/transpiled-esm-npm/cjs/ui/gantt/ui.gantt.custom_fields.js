"use strict";

exports.GanttCustomFieldsManager = void 0;

var _data = require("../../core/utils/data");

var _uiGantt = require("./ui.gantt.cache");

var _uiGantt2 = require("./ui.gantt.helper");

var GANTT_TASKS = 'tasks';

var GanttCustomFieldsManager = /*#__PURE__*/function () {
  function GanttCustomFieldsManager(gantt) {
    this._gantt = gantt;
    this._mappingHelper = gantt._mappingHelper;
    this.cache = new _uiGantt.GanttDataCache();
  }

  var _proto = GanttCustomFieldsManager.prototype;

  _proto._getTaskCustomFields = function _getTaskCustomFields() {
    var columns = this._gantt.option('columns');

    var columnFields = columns && columns.map(function (c) {
      return c.dataField;
    });

    var mappedFields = this._mappingHelper.getTaskMappedFieldNames();

    return columnFields ? columnFields.filter(function (f) {
      return mappedFields.indexOf(f) < 0;
    }) : [];
  };

  _proto._getCustomFieldsData = function _getCustomFieldsData(data) {
    return this._getTaskCustomFields().reduce(function (previous, field) {
      if (data && data[field] !== undefined) {
        previous[field] = data[field];
      }

      return previous;
    }, {});
  };

  _proto.addCustomFieldsData = function addCustomFieldsData(key, data) {
    if (data) {
      var modelData = this._gantt._tasksOption && this._gantt._tasksOption._getItems();

      var keyGetter = (0, _data.compileGetter)(this._gantt.option("".concat(GANTT_TASKS, ".keyExpr")));
      var modelItem = modelData && modelData.filter(function (obj) {
        return keyGetter(obj) === key;
      })[0];

      var customFields = this._getTaskCustomFields();

      if (modelItem) {
        for (var i = 0; i < customFields.length; i++) {
          var field = customFields[i];

          if (Object.prototype.hasOwnProperty.call(modelItem, field)) {
            data[field] = modelItem[field];
          }
        }
      }
    }
  };

  _proto.appendCustomFields = function appendCustomFields(data) {
    var modelData = this._gantt._tasksOption && this._gantt._tasksOption._getItems();

    var keyGetter = this._gantt._getTaskKeyGetter();

    var invertedData = _uiGantt2.GanttHelper.getInvertedData(modelData, keyGetter);

    return data.reduce(function (previous, item) {
      var key = keyGetter(item);
      var modelItem = invertedData[key];

      if (!modelItem) {
        previous.push(item);
      } else {
        var updatedItem = {};

        for (var field in modelItem) {
          updatedItem[field] = Object.prototype.hasOwnProperty.call(item, field) ? item[field] : modelItem[field];
        }

        previous.push(updatedItem);
      }

      return previous;
    }, []);
  };

  _proto.addCustomFieldsDataFromCache = function addCustomFieldsDataFromCache(key, data) {
    this.cache.pullDataFromCache(key, data);
  };

  _proto.saveCustomFieldsDataToCache = function saveCustomFieldsDataToCache(key, data) {
    var _this = this;

    var forceUpdateOnKeyExpire = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var isCustomFieldsUpdateOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var customFieldsData = this._getCustomFieldsData(data);

    if (Object.keys(customFieldsData).length > 0) {
      var updateCallback = function updateCallback(key, data) {
        var dataOption = _this._gantt["_".concat(GANTT_TASKS, "Option")];

        if (dataOption && data) {
          dataOption.update(key, data, function (data, key) {
            var updatedCustomFields = {};

            _this.addCustomFieldsData(key, updatedCustomFields);

            dataOption._reloadDataSource().done(function (data) {
              _this._gantt._ganttTreeList.updateDataSource(data !== null && data !== void 0 ? data : dataOption._dataSource, false, isCustomFieldsUpdateOnly);
            });

            var selectedRowKey = _this._gantt.option('selectedRowKey');

            _this._gantt._ganttView._selectTask(selectedRowKey);

            _this._gantt._actionsManager.raiseUpdatedAction(GANTT_TASKS, updatedCustomFields, key);
          });
        }
      };

      this.cache.saveData(key, customFieldsData, forceUpdateOnKeyExpire ? updateCallback : null);
    }
  };

  _proto.resetCustomFieldsDataCache = function resetCustomFieldsDataCache(key) {
    this.cache.resetCache(key);
  };

  return GanttCustomFieldsManager;
}();

exports.GanttCustomFieldsManager = GanttCustomFieldsManager;
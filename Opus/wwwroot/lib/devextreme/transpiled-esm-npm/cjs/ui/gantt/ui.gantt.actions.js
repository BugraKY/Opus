"use strict";

exports.GanttActionsManager = void 0;

/* eslint-disable spellcheck/spell-checker */
var Actions = {
  onContextMenuPreparing: 'onContextMenuPreparing',
  onCustomCommand: 'onCustomCommand',
  onDependencyDeleted: 'onDependencyDeleted',
  onDependencyDeleting: 'onDependencyDeleting',
  onDependencyInserted: 'onDependencyInserted',
  onDependencyInserting: 'onDependencyInserting',
  onResourceAssigned: 'onResourceAssigned',
  onResourceAssigning: 'onResourceAssigning',
  onResourceDeleted: 'onResourceDeleted',
  onResourceDeleting: 'onResourceDeleting',
  onResourceInserted: 'onResourceInserted',
  onResourceInserting: 'onResourceInserting',
  onResourceManagerDialogShowing: 'onResourceManagerDialogShowing',
  onResourceUnassigned: 'onResourceUnassigned',
  onResourceUnassigning: 'onResourceUnassigning',
  onSelectionChanged: 'onSelectionChanged',
  onTaskClick: 'onTaskClick',
  onTaskDblClick: 'onTaskDblClick',
  onTaskDeleted: 'onTaskDeleted',
  onTaskDeleting: 'onTaskDeleting',
  onTaskEditDialogShowing: 'onTaskEditDialogShowing',
  onTaskInserted: 'onTaskInserted',
  onTaskInserting: 'onTaskInserting',
  onTaskMoving: 'onTaskMoving',
  onTaskUpdated: 'onTaskUpdated',
  onTaskUpdating: 'onTaskUpdating'
};
var GANTT_TASKS = 'tasks';
var GANTT_DEPENDENCIES = 'dependencies';
var GANTT_RESOURCES = 'resources';
var GANTT_RESOURCE_ASSIGNMENTS = 'resourceAssignments';
var GANTT_NEW_TASK_CACHE_KEY = 'gantt_new_task_key';

var GanttActionsManager = /*#__PURE__*/function () {
  function GanttActionsManager(gantt) {
    this._gantt = gantt;
    this._mappingHelper = gantt._mappingHelper;
    this._customFieldsManager = gantt._customFieldsManager;
  }

  var _proto = GanttActionsManager.prototype;

  _proto._createActionByOption = function _createActionByOption(optionName) {
    return this._gantt._createActionByOption(optionName);
  };

  _proto._getTaskData = function _getTaskData(key) {
    return this._gantt.getTaskData(key);
  };

  _proto._convertCoreToMappedData = function _convertCoreToMappedData(optionName, coreData) {
    return this._mappingHelper.convertCoreToMappedData(optionName, coreData);
  };

  _proto._convertMappedToCoreData = function _convertMappedToCoreData(optionName, mappedData) {
    return this._mappingHelper.convertMappedToCoreData(optionName, mappedData);
  };

  _proto._convertMappedToCoreFields = function _convertMappedToCoreFields(optionName, fields) {
    return this._mappingHelper.convertMappedToCoreFields(optionName, fields);
  };

  _proto._convertCoreToMappedFields = function _convertCoreToMappedFields(optionName, fields) {
    return this._mappingHelper.convertCoreToMappedFields(optionName, fields);
  };

  _proto._saveCustomFieldsDataToCache = function _saveCustomFieldsDataToCache(key, data) {
    var forceUpdateOnKeyExpire = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var isCustomFieldsUpdateOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    this._customFieldsManager.saveCustomFieldsDataToCache(key, data, forceUpdateOnKeyExpire, isCustomFieldsUpdateOnly);
  };

  _proto.createTaskDblClickAction = function createTaskDblClickAction() {
    this._taskDblClickAction = this._createActionByOption(Actions.onTaskDblClick);
  };

  _proto.taskDblClickAction = function taskDblClickAction(args) {
    if (!this._taskDblClickAction) {
      this.createTaskDblClickAction();
    }

    this._taskDblClickAction(args);
  };

  _proto.raiseTaskDblClickAction = function raiseTaskDblClickAction(key, event) {
    var args = {
      cancel: false,
      data: this._getTaskData(key),
      event: event,
      key: key
    };
    this.taskDblClickAction(args);
    return !args.cancel;
  };

  _proto.createTaskClickAction = function createTaskClickAction() {
    this._taskClickAction = this._createActionByOption(Actions.onTaskClick);
  };

  _proto.taskClickAction = function taskClickAction(args) {
    if (!this._taskClickAction) {
      this.createTaskClickAction();
    }

    this._taskClickAction(args);
  };

  _proto.raiseTaskClickAction = function raiseTaskClickAction(key, event) {
    var args = {
      key: key,
      event: event,
      data: this._getTaskData(key)
    };
    this.taskClickAction(args);
  };

  _proto.createSelectionChangedAction = function createSelectionChangedAction() {
    this._selectionChangedAction = this._createActionByOption(Actions.onSelectionChanged);
  };

  _proto.selectionChangedAction = function selectionChangedAction(args) {
    if (!this._selectionChangedAction) {
      this.createSelectionChangedAction();
    }

    this._selectionChangedAction(args);
  };

  _proto.raiseSelectionChangedAction = function raiseSelectionChangedAction(selectedRowKey) {
    this.selectionChangedAction({
      selectedRowKey: selectedRowKey
    });
  };

  _proto.createCustomCommandAction = function createCustomCommandAction() {
    this._customCommandAction = this._createActionByOption(Actions.onCustomCommand);
  };

  _proto.customCommandAction = function customCommandAction(args) {
    if (!this._customCommandAction) {
      this.createCustomCommandAction();
    }

    this._customCommandAction(args);
  };

  _proto.raiseCustomCommand = function raiseCustomCommand(commandName) {
    this.customCommandAction({
      name: commandName
    });
  };

  _proto.createContextMenuPreparingAction = function createContextMenuPreparingAction() {
    this._contextMenuPreparingAction = this._createActionByOption(Actions.onContextMenuPreparing);
  };

  _proto.contextMenuPreparingAction = function contextMenuPreparingAction(args) {
    if (!this._contextMenuPreparingAction) {
      this.createContextMenuPreparingAction();
    }

    this._contextMenuPreparingAction(args);
  };

  _proto.raiseContextMenuPreparing = function raiseContextMenuPreparing(options) {
    this.contextMenuPreparingAction(options);
  };

  _proto._getInsertingAction = function _getInsertingAction(optionName) {
    switch (optionName) {
      case GANTT_TASKS:
        return this._getTaskInsertingAction();

      case GANTT_DEPENDENCIES:
        return this._getDependencyInsertingAction();

      case GANTT_RESOURCES:
        return this._getResourceInsertingAction();

      case GANTT_RESOURCE_ASSIGNMENTS:
        return this._getResourceAssigningAction();
    }

    return function () {};
  };

  _proto.raiseInsertingAction = function raiseInsertingAction(optionName, coreArgs) {
    var action = this._getInsertingAction(optionName);

    if (action) {
      var args = {
        cancel: false,
        values: this._convertCoreToMappedData(optionName, coreArgs.values)
      };
      action(args);
      coreArgs.cancel = args.cancel;
      coreArgs.values = this._convertMappedToCoreData(optionName, args.values);

      if (optionName === GANTT_TASKS) {
        this._saveCustomFieldsDataToCache(GANTT_NEW_TASK_CACHE_KEY, args.values);
      }
    }
  };

  _proto.createTaskInsertingAction = function createTaskInsertingAction() {
    this._taskInsertingAction = this._createActionByOption(Actions.onTaskInserting);
  };

  _proto.taskInsertingAction = function taskInsertingAction(args) {
    var action = this._getTaskInsertingAction();

    action(args);
  };

  _proto._getTaskInsertingAction = function _getTaskInsertingAction() {
    if (!this._taskInsertingAction) {
      this.createTaskInsertingAction();
    }

    return this._taskInsertingAction;
  };

  _proto.createDependencyInsertingAction = function createDependencyInsertingAction() {
    this._dependencyInsertingAction = this._createActionByOption(Actions.onDependencyInserting);
  };

  _proto.dependencyInsertingAction = function dependencyInsertingAction(args) {
    var action = this._getDependencyInsertingAction();

    action(args);
  };

  _proto._getDependencyInsertingAction = function _getDependencyInsertingAction() {
    if (!this._dependencyInsertingAction) {
      this.createDependencyInsertingAction();
    }

    return this._dependencyInsertingAction;
  };

  _proto.createResourceInsertingAction = function createResourceInsertingAction() {
    this._resourceInsertingAction = this._createActionByOption(Actions.onResourceInserting);
  };

  _proto.resourceInsertingAction = function resourceInsertingAction(args) {
    var action = this._getResourceInsertingAction();

    action(args);
  };

  _proto._getResourceInsertingAction = function _getResourceInsertingAction() {
    if (!this._resourceInsertingAction) {
      this.createResourceInsertingAction();
    }

    return this._resourceInsertingAction;
  };

  _proto.createResourceAssigningAction = function createResourceAssigningAction() {
    this._resourceAssigningAction = this._createActionByOption(Actions.onResourceAssigning);
  };

  _proto.resourceAssigningAction = function resourceAssigningAction(args) {
    var action = this._getResourceAssigningAction();

    action(args);
  };

  _proto._getResourceAssigningAction = function _getResourceAssigningAction() {
    if (!this._resourceAssigningAction) {
      this.createResourceAssigningAction();
    }

    return this._resourceAssigningAction;
  };

  _proto._getInsertedAction = function _getInsertedAction(optionName) {
    switch (optionName) {
      case GANTT_TASKS:
        return this._getTaskInsertedAction();

      case GANTT_DEPENDENCIES:
        return this._getDependencyInsertedAction();

      case GANTT_RESOURCES:
        return this._getResourceInsertedAction();

      case GANTT_RESOURCE_ASSIGNMENTS:
        return this._getResourceAssignedAction();
    }

    return function () {};
  };

  _proto.raiseInsertedAction = function raiseInsertedAction(optionName, data, key) {
    var action = this._getInsertedAction(optionName);

    if (action) {
      var args = {
        values: data,
        key: key
      };
      action(args);
    }
  };

  _proto.createTaskInsertedAction = function createTaskInsertedAction() {
    this._taskInsertedAction = this._createActionByOption(Actions.onTaskInserted);
  };

  _proto.taskInsertedAction = function taskInsertedAction(args) {
    var action = this._getTaskInsertedAction();

    action(args);
  };

  _proto._getTaskInsertedAction = function _getTaskInsertedAction() {
    if (!this._taskInsertedAction) {
      this.createTaskInsertedAction();
    }

    return this._taskInsertedAction;
  };

  _proto.createDependencyInsertedAction = function createDependencyInsertedAction() {
    this._dependencyInsertedAction = this._createActionByOption(Actions.onDependencyInserted);
  };

  _proto.dependencyInsertedAction = function dependencyInsertedAction(args) {
    var action = this._getDependencyInsertedAction();

    action(args);
  };

  _proto._getDependencyInsertedAction = function _getDependencyInsertedAction() {
    if (!this._dependencyInsertedAction) {
      this.createDependencyInsertedAction();
    }

    return this._dependencyInsertedAction;
  };

  _proto.createResourceInsertedAction = function createResourceInsertedAction() {
    this._resourceInsertedAction = this._createActionByOption(Actions.onResourceInserted);
  };

  _proto.resourceInsertedAction = function resourceInsertedAction(args) {
    var action = this._getResourceInsertedAction();

    action(args);
  };

  _proto._getResourceInsertedAction = function _getResourceInsertedAction() {
    if (!this._resourceInsertedAction) {
      this.createResourceInsertedAction();
    }

    return this._resourceInsertedAction;
  };

  _proto.createResourceAssignedAction = function createResourceAssignedAction() {
    this._resourceAssignedAction = this._createActionByOption(Actions.onResourceAssigned);
  };

  _proto.resourceAssignedAction = function resourceAssignedAction(args) {
    var action = this._getResourceAssignedAction();

    action(args);
  };

  _proto._getResourceAssignedAction = function _getResourceAssignedAction() {
    if (!this._resourceAssignedAction) {
      this.createResourceAssignedAction();
    }

    return this._resourceAssignedAction;
  };

  _proto._getDeletingAction = function _getDeletingAction(optionName) {
    switch (optionName) {
      case GANTT_TASKS:
        return this._getTaskDeletingAction();

      case GANTT_DEPENDENCIES:
        return this._getDependencyDeletingAction();

      case GANTT_RESOURCES:
        return this._getResourceDeletingAction();

      case GANTT_RESOURCE_ASSIGNMENTS:
        return this._getResourceUnassigningAction();
    }

    return function () {};
  };

  _proto.raiseDeletingAction = function raiseDeletingAction(optionName, coreArgs) {
    var action = this._getDeletingAction(optionName);

    if (action) {
      var args = {
        cancel: false,
        key: coreArgs.key,
        values: this._convertCoreToMappedData(optionName, coreArgs.values)
      };
      action(args);
      coreArgs.cancel = args.cancel;
    }
  };

  _proto.createTaskDeletingAction = function createTaskDeletingAction() {
    this._taskDeletingAction = this._createActionByOption(Actions.onTaskDeleting);
  };

  _proto.taskDeletingAction = function taskDeletingAction(args) {
    var action = this._getTaskDeletingAction();

    action(args);
  };

  _proto._getTaskDeletingAction = function _getTaskDeletingAction() {
    if (!this._taskDeletingAction) {
      this.createTaskDeletingAction();
    }

    return this._taskDeletingAction;
  };

  _proto.createDependencyDeletingAction = function createDependencyDeletingAction() {
    this._dependencyDeletingAction = this._createActionByOption(Actions.onDependencyDeleting);
  };

  _proto.dependencyDeletingAction = function dependencyDeletingAction(args) {
    var action = this._getDependencyDeletingAction();

    action(args);
  };

  _proto._getDependencyDeletingAction = function _getDependencyDeletingAction() {
    if (!this._dependencyDeletingAction) {
      this.createDependencyDeletingAction();
    }

    return this._dependencyDeletingAction;
  };

  _proto.createResourceDeletingAction = function createResourceDeletingAction() {
    this._resourceDeletingAction = this._createActionByOption(Actions.onResourceDeleting);
  };

  _proto.resourceDeletingAction = function resourceDeletingAction(args) {
    var action = this._getResourceDeletingAction();

    action(args);
  };

  _proto._getResourceDeletingAction = function _getResourceDeletingAction() {
    if (!this._resourceDeletingAction) {
      this.createResourceDeletingAction();
    }

    return this._resourceDeletingAction;
  };

  _proto.createResourceUnassigningAction = function createResourceUnassigningAction() {
    this._resourceUnassigningAction = this._createActionByOption(Actions.onResourceUnassigning);
  };

  _proto.resourceUnassigningAction = function resourceUnassigningAction(args) {
    var action = this._getResourceUnassigningAction();

    action(args);
  };

  _proto._getResourceUnassigningAction = function _getResourceUnassigningAction() {
    if (!this._resourceUnassigningAction) {
      this.createResourceUnassigningAction();
    }

    return this._resourceUnassigningAction;
  };

  _proto._getDeletedAction = function _getDeletedAction(optionName) {
    switch (optionName) {
      case GANTT_TASKS:
        return this._getTaskDeletedAction();

      case GANTT_DEPENDENCIES:
        return this._getDependencyDeletedAction();

      case GANTT_RESOURCES:
        return this._getResourceDeletedAction();

      case GANTT_RESOURCE_ASSIGNMENTS:
        return this._getResourceUnassignedAction();
    }

    return function () {};
  };

  _proto.raiseDeletedAction = function raiseDeletedAction(optionName, key, data) {
    var action = this._getDeletedAction(optionName);

    if (action) {
      var args = {
        key: key,
        values: data
      };
      action(args);
    }
  };

  _proto.createTaskDeletedAction = function createTaskDeletedAction() {
    this._taskDeletedAction = this._createActionByOption(Actions.onTaskDeleted);
  };

  _proto.taskDeletedAction = function taskDeletedAction(args) {
    var action = this._getTaskDeletedAction();

    action(args);
  };

  _proto._getTaskDeletedAction = function _getTaskDeletedAction() {
    if (!this._taskDeletedAction) {
      this.createTaskDeletedAction();
    }

    return this._taskDeletedAction;
  };

  _proto.createDependencyDeletedAction = function createDependencyDeletedAction() {
    this._dependencyDeletedAction = this._createActionByOption(Actions.onDependencyDeleted);
  };

  _proto.dependencyDeletedAction = function dependencyDeletedAction(args) {
    var action = this._getDependencyDeletedAction();

    action(args);
  };

  _proto._getDependencyDeletedAction = function _getDependencyDeletedAction() {
    if (!this._dependencyDeletedAction) {
      this.createDependencyDeletedAction();
    }

    return this._dependencyDeletedAction;
  };

  _proto.createResourceDeletedAction = function createResourceDeletedAction() {
    this._resourceDeletedAction = this._createActionByOption(Actions.onResourceDeleted);
  };

  _proto.resourceDeletedAction = function resourceDeletedAction(args) {
    var action = this._getResourceDeletedAction();

    action(args);
  };

  _proto._getResourceDeletedAction = function _getResourceDeletedAction() {
    if (!this._resourceDeletedAction) {
      this.createResourceDeletedAction();
    }

    return this._resourceDeletedAction;
  };

  _proto.createResourceUnassignedAction = function createResourceUnassignedAction() {
    this._resourceUnassignedAction = this._createActionByOption(Actions.onResourceUnassigned);
  };

  _proto.resourceUnassignedAction = function resourceUnassignedAction(args) {
    var action = this._getResourceUnassignedAction();

    action(args);
  };

  _proto._getResourceUnassignedAction = function _getResourceUnassignedAction() {
    if (!this._resourceUnassignedAction) {
      this.createResourceUnassignedAction();
    }

    return this._resourceUnassignedAction;
  };

  _proto._getUpdatingAction = function _getUpdatingAction(optionName) {
    switch (optionName) {
      case GANTT_TASKS:
        return this._getTaskUpdatingAction();
    }

    return function () {};
  };

  _proto.raiseUpdatingAction = function raiseUpdatingAction(optionName, coreArgs, action) {
    action = action || this._getUpdatingAction(optionName);

    if (action) {
      var isTaskUpdating = optionName === GANTT_TASKS;
      var args = {
        cancel: false,
        key: coreArgs.key,
        newValues: this._convertCoreToMappedData(optionName, coreArgs.newValues),
        values: isTaskUpdating ? this._getTaskData(coreArgs.key) : this._convertCoreToMappedData(optionName, coreArgs.values)
      };

      if (isTaskUpdating && this._customFieldsManager.cache.hasData(args.key)) {
        this._customFieldsManager.addCustomFieldsDataFromCache(args.key, args.newValues);
      }

      action(args);
      coreArgs.cancel = args.cancel;
      coreArgs.newValues = this._convertMappedToCoreData(optionName, args.newValues);

      if (isTaskUpdating) {
        if (args.cancel) {
          this._customFieldsManager.resetCustomFieldsDataCache(args.key);
        } else {
          var forceUpdateOnKeyExpire = !Object.keys(coreArgs.newValues).length;

          this._saveCustomFieldsDataToCache(args.key, args.newValues, forceUpdateOnKeyExpire);
        }
      }
    }
  };

  _proto.createTaskUpdatingAction = function createTaskUpdatingAction() {
    this._taskUpdatingAction = this._createActionByOption(Actions.onTaskUpdating);
  };

  _proto.taskUpdatingAction = function taskUpdatingAction(args) {
    var action = this._getTaskUpdatingAction();

    action(args);
  };

  _proto._getTaskUpdatingAction = function _getTaskUpdatingAction() {
    if (!this._taskUpdatingAction) {
      this.createTaskUpdatingAction();
    }

    return this._taskUpdatingAction;
  };

  _proto._getUpdatedAction = function _getUpdatedAction(optionName) {
    switch (optionName) {
      case GANTT_TASKS:
        return this._getTaskUpdatedAction();
    }

    return function () {};
  };

  _proto.raiseUpdatedAction = function raiseUpdatedAction(optionName, data, key) {
    var action = this._getUpdatedAction(optionName);

    if (action) {
      var args = {
        values: data,
        key: key
      };
      action(args);
    }
  };

  _proto.createTaskUpdatedAction = function createTaskUpdatedAction() {
    this._taskUpdatedAction = this._createActionByOption(Actions.onTaskUpdated);
  };

  _proto.taskUpdatedAction = function taskUpdatedAction(args) {
    var action = this._getTaskUpdatedAction();

    action(args);
  };

  _proto._getTaskUpdatedAction = function _getTaskUpdatedAction() {
    if (!this._taskUpdatedAction) {
      this.createTaskUpdatedAction();
    }

    return this._taskUpdatedAction;
  };

  _proto.createTaskEditDialogShowingAction = function createTaskEditDialogShowingAction() {
    this._taskEditDialogShowingAction = this._createActionByOption(Actions.onTaskEditDialogShowing);
  };

  _proto.taskEditDialogShowingAction = function taskEditDialogShowingAction(args) {
    var action = this._getTaskEditDialogShowingAction();

    action(args);
  };

  _proto._getTaskEditDialogShowingAction = function _getTaskEditDialogShowingAction() {
    if (!this._taskEditDialogShowingAction) {
      this.createTaskEditDialogShowingAction();
    }

    return this._taskEditDialogShowingAction;
  };

  _proto.raiseTaskEditDialogShowingAction = function raiseTaskEditDialogShowingAction(coreArgs) {
    var action = this._getTaskEditDialogShowingAction();

    if (action) {
      var args = {
        cancel: false,
        key: coreArgs.key,
        values: this._convertCoreToMappedData(GANTT_TASKS, coreArgs.values),
        readOnlyFields: this._convertCoreToMappedFields(GANTT_TASKS, coreArgs.readOnlyFields),
        hiddenFields: this._convertCoreToMappedFields(GANTT_TASKS, coreArgs.hiddenFields)
      };
      action(args);
      coreArgs.cancel = args.cancel;
      coreArgs.values = this._convertMappedToCoreData(GANTT_TASKS, args.values);
      coreArgs.readOnlyFields = this._convertMappedToCoreFields(GANTT_TASKS, args.readOnlyFields);
      coreArgs.hiddenFields = this._convertMappedToCoreFields(GANTT_TASKS, args.hiddenFields);
    }
  };

  _proto.createResourceManagerDialogShowingAction = function createResourceManagerDialogShowingAction() {
    this._resourceManagerDialogShowingAction = this._createActionByOption(Actions.onResourceManagerDialogShowing);
  };

  _proto.resourceManagerDialogShowingAction = function resourceManagerDialogShowingAction(args) {
    var action = this._getResourceManagerDialogShowingAction();

    action(args);
  };

  _proto._getResourceManagerDialogShowingAction = function _getResourceManagerDialogShowingAction() {
    if (!this._resourceManagerDialogShowingAction) {
      this.createResourceManagerDialogShowingAction();
    }

    return this._resourceManagerDialogShowingAction;
  };

  _proto.raiseResourceManagerDialogShowingAction = function raiseResourceManagerDialogShowingAction(coreArgs) {
    var _this = this;

    var action = this._getResourceManagerDialogShowingAction();

    if (action) {
      var mappedResources = coreArgs.values.resources.items.map(function (r) {
        return _this._convertMappedToCoreData(GANTT_RESOURCES, r);
      });
      var args = {
        cancel: false,
        values: mappedResources
      };
      action(args);
      coreArgs.cancel = args.cancel;
    }
  };

  _proto.createTaskMovingAction = function createTaskMovingAction() {
    this._taskMovingAction = this._createActionByOption(Actions.onTaskMoving);
  };

  _proto.taskMovingAction = function taskMovingAction(args) {
    var action = this.getTaskMovingAction();
    action(args);
  };

  _proto.getTaskMovingAction = function getTaskMovingAction() {
    if (!this._taskMovingAction) {
      this.createTaskMovingAction();
    }

    return this._taskMovingAction;
  };

  return GanttActionsManager;
}();

exports.GanttActionsManager = GanttActionsManager;
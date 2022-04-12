"use strict";

exports.default = void 0;

var _diagram = require("./diagram.importer");

var DiagramBar = /*#__PURE__*/function () {
  function DiagramBar(owner) {
    var _getDiagram = (0, _diagram.getDiagram)(),
        EventDispatcher = _getDiagram.EventDispatcher;

    this.onChanged = new EventDispatcher(); // IBar.onChanged: EventDispatcher<IBarListener>

    this._owner = owner;
  }

  var _proto = DiagramBar.prototype;

  _proto.raiseBarCommandExecuted = function raiseBarCommandExecuted(key, parameter) {
    this.onChanged.raise('notifyBarCommandExecuted', parseInt(key), parameter);
  };

  _proto.getCommandKeys = function getCommandKeys() {
    // IBar.getCommandKeys(): DiagramCommand[]
    throw 'Not Implemented';
  };

  _proto.setItemValue = function setItemValue(key, value) {// IBar.setItemValue(key: DiagramCommand, value: any)
  };

  _proto.setItemEnabled = function setItemEnabled(key, enabled) {// IBar.setItemEnabled(key: DiagramCommand, enabled: boolean)
  };

  _proto.setItemVisible = function setItemVisible(key, enabled) {// IBar.setItemVisible(key: DiagramCommand, visible: boolean)
  };

  _proto.setEnabled = function setEnabled(enabled) {// IBar.setEnabled(enabled: boolean)
  };

  _proto.setItemSubItems = function setItemSubItems(key, items) {// IBar.setItemSubItems(key: DiagramCommand, items: any[])
  };

  _proto.isVisible = function isVisible() {
    // IBar.isVisible(): boolean
    return true;
  };

  _proto._getKeys = function _getKeys(items) {
    var _this = this;

    var keys = items.reduce(function (commands, item) {
      if (item.command !== undefined) {
        commands.push(item.command);
      }

      if (item.items) {
        commands = commands.concat(_this._getKeys(item.items));
      }

      return commands;
    }, []);
    return keys;
  };

  return DiagramBar;
}();

var _default = DiagramBar;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
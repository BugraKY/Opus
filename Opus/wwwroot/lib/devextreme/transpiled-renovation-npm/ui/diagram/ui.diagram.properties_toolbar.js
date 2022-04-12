"use strict";

exports.default = void 0;

var _uiDiagram = _interopRequireDefault(require("./ui.diagram.toolbar"));

var _diagram = _interopRequireDefault(require("./diagram.commands_manager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DiagramPropertiesToolbar = /*#__PURE__*/function (_DiagramToolbar) {
  _inheritsLoose(DiagramPropertiesToolbar, _DiagramToolbar);

  function DiagramPropertiesToolbar() {
    return _DiagramToolbar.apply(this, arguments) || this;
  }

  var _proto = DiagramPropertiesToolbar.prototype;

  _proto._getCommands = function _getCommands() {
    return _diagram.default.getPropertiesToolbarCommands();
  };

  return DiagramPropertiesToolbar;
}(_uiDiagram.default);

var _default = DiagramPropertiesToolbar;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
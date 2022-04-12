"use strict";

exports.DataGridComponent = void 0;

var _uiData_grid = _interopRequireDefault(require("../../../ui/data_grid/ui.data_grid.base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DATA_GRID_NAME = "dxDataGrid";

var DataGridComponent = /*#__PURE__*/function (_DataGridBase) {
  _inheritsLoose(DataGridComponent, _DataGridBase);

  function DataGridComponent(element, options) {
    var _this;

    _this = _DataGridBase.call(this, element, options) || this;
    _this.NAME = DATA_GRID_NAME;
    _this._deprecatedOptions = {};
    return _this;
  }

  var _proto = DataGridComponent.prototype;

  _proto._setDeprecatedOptions = function _setDeprecatedOptions() {};

  _proto._initTemplates = function _initTemplates() {};

  _proto._updateDOMComponent = function _updateDOMComponent() {};

  _proto._isDimensionChangeSupported = function _isDimensionChangeSupported() {
    return false;
  };

  return DataGridComponent;
}(_uiData_grid.default);

exports.DataGridComponent = DataGridComponent;
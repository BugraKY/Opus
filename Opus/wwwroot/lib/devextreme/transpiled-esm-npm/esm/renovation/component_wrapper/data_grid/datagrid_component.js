import DataGridBase from "../../../ui/data_grid/ui.data_grid.base";
var DATA_GRID_NAME = "dxDataGrid";
export class DataGridComponent extends DataGridBase {
  constructor(element, options) {
    super(element, options);
    this.NAME = DATA_GRID_NAME;
    this._deprecatedOptions = {};
  }

  _setDeprecatedOptions() {}

  _initTemplates() {}

  _updateDOMComponent() {}

  _isDimensionChangeSupported() {
    return false;
  }

}
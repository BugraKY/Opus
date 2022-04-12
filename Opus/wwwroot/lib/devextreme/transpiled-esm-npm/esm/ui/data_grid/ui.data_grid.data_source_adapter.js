import DataSourceAdapter from '../grid_core/ui.grid_core.data_source_adapter';
var dataSourceAdapterType = DataSourceAdapter;
export default {
  extend: function extend(extender) {
    dataSourceAdapterType = dataSourceAdapterType.inherit(extender);
  },
  create: function create(component) {
    return new dataSourceAdapterType(component);
  }
};
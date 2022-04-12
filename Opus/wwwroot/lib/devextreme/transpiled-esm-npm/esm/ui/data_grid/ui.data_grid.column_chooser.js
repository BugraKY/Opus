import gridCore from './ui.data_grid.core';
import { columnChooserModule } from '../grid_core/ui.grid_core.column_chooser';
export var ColumnChooserController = columnChooserModule.controllers.columnChooser;
export var ColumnChooserView = columnChooserModule.views.columnChooserView;
gridCore.registerModule('columnChooser', columnChooserModule);
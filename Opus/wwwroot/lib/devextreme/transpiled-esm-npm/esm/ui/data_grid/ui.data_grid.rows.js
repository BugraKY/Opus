import gridCore from './ui.data_grid.core';
import { rowsModule } from '../grid_core/ui.grid_core.rows';
export var RowsView = rowsModule.views.rowsView;
gridCore.registerModule('rows', rowsModule);
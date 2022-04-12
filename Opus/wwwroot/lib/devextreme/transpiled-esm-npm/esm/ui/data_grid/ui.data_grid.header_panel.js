import gridCore from './ui.data_grid.core';
import { headerPanelModule } from '../grid_core/ui.grid_core.header_panel';
export var HeaderPanel = headerPanelModule.views.headerPanel;
gridCore.registerModule('headerPanel', headerPanelModule);
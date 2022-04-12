"use strict";

exports.RowsView = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _uiTree_list = _interopRequireDefault(require("./ui.tree_list.core"));

var _uiGrid_core = require("../grid_core/ui.grid_core.rows");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TREELIST_TEXT_CONTENT = 'dx-treelist-text-content';
var TREELIST_EXPAND_ICON_CONTAINER_CLASS = 'dx-treelist-icon-container';
var TREELIST_CELL_EXPANDABLE_CLASS = 'dx-treelist-cell-expandable';
var TREELIST_EMPTY_SPACE = 'dx-treelist-empty-space';
var TREELIST_EXPANDED_CLASS = 'dx-treelist-expanded';
var TREELIST_COLLAPSED_CLASS = 'dx-treelist-collapsed';

var RowsView = _uiGrid_core.rowsModule.views.rowsView.inherit(function () {
  var createCellContent = function createCellContent($container) {
    return (0, _renderer.default)('<div>').addClass(TREELIST_TEXT_CONTENT).appendTo($container);
  };

  var createIcon = function createIcon(hasIcon, isExpanded) {
    var $iconElement = (0, _renderer.default)('<div>').addClass(TREELIST_EMPTY_SPACE);

    if (hasIcon) {
      $iconElement.toggleClass(TREELIST_EXPANDED_CLASS, isExpanded).toggleClass(TREELIST_COLLAPSED_CLASS, !isExpanded).append((0, _renderer.default)('<span>'));
    }

    return $iconElement;
  };

  return {
    _renderIconContainer: function _renderIconContainer($container, options) {
      var _this = this;

      var $iconContainer = (0, _renderer.default)('<div>').addClass(TREELIST_EXPAND_ICON_CONTAINER_CLASS).appendTo($container);
      options.watch && options.watch(function () {
        return [options.row.level, options.row.isExpanded, options.row.node.hasChildren];
      }, function () {
        $iconContainer.empty();

        _this._renderIcons($iconContainer, options);
      });
      $container.addClass(TREELIST_CELL_EXPANDABLE_CLASS);
      return this._renderIcons($iconContainer, options);
    },
    _renderIcons: function _renderIcons($iconContainer, options) {
      var row = options.row;
      var level = row.level;

      for (var i = 0; i <= level; i++) {
        $iconContainer.append(createIcon(i === level && row.node.hasChildren, row.isExpanded));
      }

      return $iconContainer;
    },
    _renderCellCommandContent: function _renderCellCommandContent(container, model) {
      this._renderIconContainer(container, model);

      return true;
    },
    _processTemplate: function _processTemplate(template, options) {
      var that = this;
      var resultTemplate;
      var renderingTemplate = this.callBase(template);

      var firstDataColumnIndex = that._columnsController.getFirstDataColumnIndex();

      if (renderingTemplate && options.column.index === firstDataColumnIndex) {
        resultTemplate = {
          render: function render(options) {
            var $container = options.container;

            if (that._renderCellCommandContent($container, options.model)) {
              options.container = createCellContent($container);
            }

            renderingTemplate.render(options);
          }
        };
      } else {
        resultTemplate = renderingTemplate;
      }

      return resultTemplate;
    },
    _updateCell: function _updateCell($cell, options) {
      $cell = $cell.hasClass(TREELIST_TEXT_CONTENT) ? $cell.parent() : $cell;
      this.callBase($cell, options);
    },
    _rowClick: function _rowClick(e) {
      var dataController = this._dataController;
      var $targetElement = (0, _renderer.default)(e.event.target);
      var isExpandIcon = this.isExpandIcon($targetElement);
      var item = dataController && dataController.items()[e.rowIndex];

      if (isExpandIcon && item) {
        dataController.changeRowExpand(item.key);
      }

      this.callBase(e);
    },
    _createRow: function _createRow(row) {
      var node = row && row.node;
      var $rowElement = this.callBase.apply(this, arguments);

      if (node) {
        this.setAria('level', row.level + 1, $rowElement);

        if (node.hasChildren) {
          this.setAria('expanded', row.isExpanded, $rowElement);
        }
      }

      return $rowElement;
    },
    isExpandIcon: function isExpandIcon($targetElement) {
      return !!$targetElement.closest('.' + TREELIST_EXPANDED_CLASS + ', .' + TREELIST_COLLAPSED_CLASS).length;
    }
  };
}());

exports.RowsView = RowsView;

_uiTree_list.default.registerModule('rows', {
  defaultOptions: _uiGrid_core.rowsModule.defaultOptions,
  views: {
    rowsView: RowsView
  }
});
"use strict";

exports.default = void 0;

var _size = require("../../core/utils/size");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _scroll_view = _interopRequireDefault(require("../scroll_view"));

var _tab_panel = _interopRequireDefault(require("../tab_panel"));

var _uiDiagram = _interopRequireDefault(require("./ui.diagram.floating_panel"));

var _diagram = _interopRequireDefault(require("./diagram.commands_manager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DIAGRAM_PROPERTIES_POPUP_WIDTH = 420;
var DIAGRAM_PROPERTIES_POPUP_HEIGHT = 340;
var DIAGRAM_PROPERTIES_POPUP_CLASS = 'dx-diagram-properties-popup';
var DIAGRAM_PROPERTIES_POPUP_NOTABS_CLASS = 'dx-diagram-properties-popup-notabs';
var DIAGRAM_PROPERTIES_PANEL_CLASS = 'dx-diagram-properties-panel';
var DIAGRAM_PROPERTIES_PANEL_GROUP_TITLE_CLASS = 'dx-diagram-properties-panel-group-title';
var DIAGRAM_PROPERTIES_PANEL_GROUP_TOOLBAR_CLASS = 'dx-diagram-properties-panel-group-toolbar';

var DiagramPropertiesPanel = /*#__PURE__*/function (_DiagramFloatingPanel) {
  _inheritsLoose(DiagramPropertiesPanel, _DiagramFloatingPanel);

  function DiagramPropertiesPanel() {
    return _DiagramFloatingPanel.apply(this, arguments) || this;
  }

  var _proto = DiagramPropertiesPanel.prototype;

  _proto._init = function _init() {
    _DiagramFloatingPanel.prototype._init.call(this);

    this._commandTabs = _diagram.default.getPropertyPanelCommandTabs(this.option('propertyTabs'));

    this._createOnCreateToolbar();

    this._createOnSelectedGroupChanged();
  };

  _proto._initMarkup = function _initMarkup() {
    this._toolbars = [];
    this._selectedToolbar = undefined;

    _DiagramFloatingPanel.prototype._initMarkup.call(this);
  };

  _proto._getPopupClass = function _getPopupClass() {
    var className = DIAGRAM_PROPERTIES_POPUP_CLASS;

    if (!this._hasTabPanel()) {
      className += ' ' + DIAGRAM_PROPERTIES_POPUP_NOTABS_CLASS;
    }

    return className;
  };

  _proto._getPopupWidth = function _getPopupWidth() {
    return this.isMobileView() ? '100%' : DIAGRAM_PROPERTIES_POPUP_WIDTH;
  };

  _proto._getPopupHeight = function _getPopupHeight() {
    return DIAGRAM_PROPERTIES_POPUP_HEIGHT;
  };

  _proto._getPopupPosition = function _getPopupPosition() {
    var $parent = this.option('offsetParent');

    if (this.isMobileView()) {
      return {
        my: 'left bottom',
        at: 'left bottom',
        of: $parent
      };
    }

    return {
      my: 'right bottom',
      at: 'right bottom',
      of: $parent,
      offset: '-' + this.option('offsetX') + ' -' + this.option('offsetY')
    };
  };

  _proto._getPopupAnimation = function _getPopupAnimation() {
    var $parent = this.option('offsetParent');

    if (this.isMobileView()) {
      return {
        hide: this._getPopupSlideAnimationObject({
          direction: 'bottom',
          from: {
            position: {
              my: 'left bottom',
              at: 'left bottom',
              of: $parent
            }
          },
          to: {
            position: {
              my: 'left top',
              at: 'left bottom',
              of: $parent
            }
          }
        }),
        show: this._getPopupSlideAnimationObject({
          direction: 'top',
          from: {
            position: {
              my: 'left top',
              at: 'left bottom',
              of: $parent
            }
          },
          to: {
            position: {
              my: 'left bottom',
              at: 'left bottom',
              of: $parent
            }
          }
        })
      };
    }

    return _DiagramFloatingPanel.prototype._getPopupAnimation.call(this);
  };

  _proto._getPopupOptions = function _getPopupOptions() {
    return (0, _extend.extend)(_DiagramFloatingPanel.prototype._getPopupOptions.call(this), {
      showTitle: this.isMobileView(),
      showCloseButton: this.isMobileView()
    });
  };

  _proto._renderPopupContent = function _renderPopupContent($parent) {
    if (!this._commandTabs.length) return;
    var $panel = (0, _renderer.default)('<div>').addClass(DIAGRAM_PROPERTIES_PANEL_CLASS).appendTo($parent);

    if (this._hasTabPanel()) {
      this._renderTabPanel($panel);
    } else {
      this._renderTabContent($panel, this._commandTabs[0], 0, true);
    }
  };

  _proto._hasTabPanel = function _hasTabPanel() {
    return this._commandTabs.length > 1;
  };

  _proto._renderTabPanel = function _renderTabPanel($parent) {
    var _this = this;

    var $tabPanel = (0, _renderer.default)('<div>').appendTo($parent);
    this._tabPanel = this._createComponent($tabPanel, _tab_panel.default, {
      focusStateEnabled: false,
      dataSource: this._commandTabs,
      itemTemplate: function itemTemplate(data, index, $element) {
        _this._renderTabContent($element, data, index);
      },
      onSelectionChanged: function onSelectionChanged(e) {
        _this._onSelectedGroupChangedAction();

        _this._onPointerUpAction();
      },
      onContentReady: function onContentReady(e) {
        _this._popup.option('height', (0, _size.getHeight)(e.component.$element()) + _this._getVerticalPaddingsAndBorders());

        if (_this._firstScrollView) {
          _this._scrollViewHeight = (0, _size.getOuterHeight)(_this._firstScrollView.$element());

          _this._firstScrollView.option('height', _this._scrollViewHeight);
        }
      }
    });
  };

  _proto._renderTabContent = function _renderTabContent($parent, tab, index, isSingleTab) {
    var $scrollViewWrapper = (0, _renderer.default)('<div>').appendTo($parent);

    var scrollView = this._createComponent($scrollViewWrapper, _scroll_view.default, {
      height: this._scrollViewHeight
    });

    this._renderTabInnerContent(scrollView.content(), tab, index);

    if (isSingleTab) {
      this._popup.option('height', (0, _size.getHeight)(scrollView.$element()) + this._getVerticalPaddingsAndBorders());
    } else {
      this._firstScrollView = this._firstScrollView || scrollView;
    }
  };

  _proto._renderTabInnerContent = function _renderTabInnerContent($parent, group, index) {
    var _this2 = this;

    if (group.groups) {
      group.groups.forEach(function (sg, si) {
        _this2._renderTabGroupContent($parent, index, sg.title, sg.commands);
      });
    } else if (group.commands) {
      this._renderTabGroupContent($parent, index, undefined, group.commands);
    }
  };

  _proto._renderTabGroupContent = function _renderTabGroupContent($parent, index, title, commands) {
    if (title) {
      (0, _renderer.default)('<div>').addClass(DIAGRAM_PROPERTIES_PANEL_GROUP_TITLE_CLASS).appendTo($parent).text(title);
    }

    var $toolbar = (0, _renderer.default)('<div>').addClass(DIAGRAM_PROPERTIES_PANEL_GROUP_TOOLBAR_CLASS).appendTo($parent);
    var args = {
      $parent: $toolbar,
      commands: commands
    };

    this._onCreateToolbarAction(args);

    if (!this._toolbars[index]) {
      this._toolbars[index] = [];
    }

    this._toolbars[index].push(args.toolbar);

    this._selectedToolbar = args.toolbar;
  };

  _proto.getActiveToolbars = function getActiveToolbars() {
    var index = this._tabPanel ? this._tabPanel.option('selectedIndex') : 0;
    return this._toolbars[index];
  };

  _proto._createOnCreateToolbar = function _createOnCreateToolbar() {
    this._onCreateToolbarAction = this._createActionByOption('onCreateToolbar');
  };

  _proto._createOnSelectedGroupChanged = function _createOnSelectedGroupChanged() {
    this._onSelectedGroupChangedAction = this._createActionByOption('onSelectedGroupChanged');
  };

  _proto._optionChanged = function _optionChanged(args) {
    switch (args.name) {
      case 'onCreateToolbar':
        this._createOnCreateToolbar();

        break;

      case 'onSelectedGroupChanged':
        this._createOnSelectedGroupChanged();

        break;

      case 'propertyTabs':
        this._invalidate();

        break;

      default:
        _DiagramFloatingPanel.prototype._optionChanged.call(this, args);

    }
  };

  return DiagramPropertiesPanel;
}(_uiDiagram.default);

var _default = DiagramPropertiesPanel;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
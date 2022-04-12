"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

exports.default = void 0;

var _size = require("../../core/utils/size");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _load_indicator = _interopRequireDefault(require("../load_indicator"));

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _extend = require("../../core/utils/extend");

var _type = require("../../core/utils/type");

var _data = require("../../core/utils/data");

var _position = _interopRequireDefault(require("../../animation/position"));

var _diagram = require("./diagram.importer");

var _window = require("../../core/utils/window");

var _element = require("../../core/element");

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _index = require("../../events/utils/index");

var _message = _interopRequireDefault(require("../../localization/message"));

var _number = _interopRequireDefault(require("../../localization/number"));

var zIndexPool = _interopRequireWildcard(require("../overlay/z_index"));

var _ui2 = _interopRequireDefault(require("../overlay/ui.overlay"));

var _uiDiagram = _interopRequireDefault(require("./ui.diagram.toolbar"));

var _uiDiagram2 = _interopRequireDefault(require("./ui.diagram.main_toolbar"));

var _uiDiagram3 = _interopRequireDefault(require("./ui.diagram.history_toolbar"));

var _uiDiagram4 = _interopRequireDefault(require("./ui.diagram.view_toolbar"));

var _uiDiagram5 = _interopRequireDefault(require("./ui.diagram.properties_toolbar"));

var _uiDiagram6 = _interopRequireDefault(require("./ui.diagram.context_menu"));

var _uiDiagram7 = _interopRequireDefault(require("./ui.diagram.context_toolbox"));

var _uiDiagram8 = _interopRequireDefault(require("./ui.diagram.dialogs"));

var _uiDiagram9 = _interopRequireDefault(require("./ui.diagram.scroll_view"));

var _diagram2 = _interopRequireDefault(require("./diagram.toolbox_manager"));

var _uiDiagram10 = _interopRequireDefault(require("./ui.diagram.toolbox"));

var _uiDiagram11 = _interopRequireDefault(require("./ui.diagram.properties_panel"));

var _diagram3 = _interopRequireDefault(require("./diagram.options_update"));

var _uiDiagram12 = _interopRequireDefault(require("./ui.diagram.dialog_manager"));

var _diagram4 = _interopRequireDefault(require("./diagram.commands_manager"));

var _diagram5 = _interopRequireDefault(require("./diagram.nodes_option"));

var _diagram6 = _interopRequireDefault(require("./diagram.edges_option"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// STYLE diagram
var DIAGRAM_CLASS = 'dx-diagram';
var DIAGRAM_FULLSCREEN_CLASS = 'dx-diagram-fullscreen';
var DIAGRAM_OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
var DIAGRAM_TOOLBAR_WRAPPER_CLASS = DIAGRAM_CLASS + '-toolbar-wrapper';
var DIAGRAM_CONTENT_WRAPPER_CLASS = DIAGRAM_CLASS + '-content-wrapper';
var DIAGRAM_CONTENT_CLASS = DIAGRAM_CLASS + '-content';
var DIAGRAM_SCROLL_VIEW_CLASS = DIAGRAM_CLASS + '-scroll-view';
var DIAGRAM_FLOATING_TOOLBAR_CONTAINER_CLASS = DIAGRAM_CLASS + '-floating-toolbar-container';
var DIAGRAM_PROPERTIES_PANEL_TOOLBAR_CONTAINER_CLASS = DIAGRAM_CLASS + '-properties-panel-toolbar-container';
var DIAGRAM_LOADING_INDICATOR_CLASS = DIAGRAM_CLASS + '-loading-indicator';
var DIAGRAM_FLOATING_PANEL_OFFSET = 12;
var DIAGRAM_DEFAULT_UNIT = 'in';
var DIAGRAM_DEFAULT_ZOOMLEVEL = 1;
var DIAGRAM_DEFAULT_AUTOZOOM_MODE = 'disabled';
var DIAGRAM_DEFAULT_PAGE_ORIENTATION = 'portrait';
var DIAGRAM_DEFAULT_PAGE_COLOR = '#ffffff';
var DIAGRAM_MAX_MOBILE_WINDOW_WIDTH = 576;
var DIAGRAM_TOOLBOX_SHAPE_SPACING = 12;
var DIAGRAM_TOOLBOX_SHAPES_PER_ROW = 3;
var DIAGRAM_CONTEXT_TOOLBOX_SHAPE_SPACING = 12;
var DIAGRAM_CONTEXT_TOOLBOX_SHAPES_PER_ROW = 4;
var DIAGRAM_CONTEXT_TOOLBOX_DEFAULT_WIDTH = 152;
var DIAGRAM_NAMESPACE = 'dxDiagramEvent';
var FULLSCREEN_CHANGE_EVENT_NAME = (0, _index.addNamespace)('fullscreenchange', DIAGRAM_NAMESPACE);
var IE_FULLSCREEN_CHANGE_EVENT_NAME = (0, _index.addNamespace)('msfullscreenchange', DIAGRAM_NAMESPACE);
var WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME = (0, _index.addNamespace)('webkitfullscreenchange', DIAGRAM_NAMESPACE);
var MOZ_FULLSCREEN_CHANGE_EVENT_NAME = (0, _index.addNamespace)('mozfullscreenchange', DIAGRAM_NAMESPACE);

var Diagram = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(Diagram, _Widget);

  function Diagram() {
    return _Widget.apply(this, arguments) || this;
  }

  var _proto = Diagram.prototype;

  _proto._init = function _init() {
    this._updateDiagramLockCount = 0;
    this.toggleFullscreenLock = 0;
    this._toolbars = [];

    _Widget.prototype._init.call(this);

    this._initDiagram();

    this._createCustomCommand();
  };

  _proto._initMarkup = function _initMarkup() {
    var _this = this;

    _Widget.prototype._initMarkup.call(this);

    this._toolbars = [];
    delete this._isMobileScreenSize;
    var isServerSide = !(0, _window.hasWindow)();
    this.$element().addClass(DIAGRAM_CLASS);
    delete this._mainToolbar;

    if (this.option('mainToolbar.visible')) {
      this._renderMainToolbar();
    }

    var $contentWrapper = (0, _renderer.default)('<div>').addClass(DIAGRAM_CONTENT_WRAPPER_CLASS).appendTo(this.$element());
    delete this._historyToolbar;
    delete this._historyToolbarResizeCallback;

    if (this._isHistoryToolbarVisible()) {
      this._renderHistoryToolbar($contentWrapper);
    }

    delete this._propertiesToolbar;
    delete this._propertiesToolbarResizeCallback;

    if (this._isPropertiesPanelEnabled()) {
      this._renderPropertiesToolbar($contentWrapper);
    }

    delete this._viewToolbar;
    delete this._viewToolbarResizeCallback;

    if (this.option('viewToolbar.visible')) {
      this._renderViewToolbar($contentWrapper);
    }

    delete this._toolbox;
    delete this._toolboxResizeCallback;

    if (this._isToolboxEnabled()) {
      this._renderToolbox($contentWrapper);
    }

    delete this._propertiesPanel;
    delete this._propertiesPanelResizeCallback;

    if (this._isPropertiesPanelEnabled()) {
      this._renderPropertiesPanel($contentWrapper);
    }

    this._$content = (0, _renderer.default)('<div>').addClass(DIAGRAM_CONTENT_CLASS).appendTo($contentWrapper);
    delete this._contextMenu;
    this._diagramInstance.settings.contextMenuEnabled = this.option('contextMenu.enabled');

    if (this._diagramInstance.settings.contextMenuEnabled) {
      this._renderContextMenu($contentWrapper);
    }

    delete this._contextToolbox;

    if (this.option('contextToolbox.enabled')) {
      this._renderContextToolbox($contentWrapper);
    }

    this._renderDialog($contentWrapper);

    if (!isServerSide) {
      var $scrollViewWrapper = (0, _renderer.default)('<div>').addClass(DIAGRAM_SCROLL_VIEW_CLASS).appendTo(this._$content);

      this._createComponent($scrollViewWrapper, _uiDiagram9.default, {
        useNativeScrolling: this.option('useNativeScrolling'),
        onCreateDiagram: function onCreateDiagram(e) {
          _this._diagramInstance.createDocument(e.$parent[0], e.scrollView, $contentWrapper[0]);
        }
      });
    }

    this._setCustomCommandChecked(_diagram4.default.SHOW_PROPERTIES_PANEL_COMMAND_NAME, this._isPropertiesPanelVisible());

    this._setCustomCommandChecked(_diagram4.default.SHOW_TOOLBOX_COMMAND_NAME, this._isToolboxVisible());

    this._createOptionsUpdateBar();
  };

  _proto._dimensionChanged = function _dimensionChanged() {
    this._isMobileScreenSize = undefined;

    this._processDiagramResize();
  };

  _proto._visibilityChanged = function _visibilityChanged(visible) {
    if (visible) {
      this._bindDiagramData();

      this.repaint();
    }
  };

  _proto._processDiagramResize = function _processDiagramResize() {
    this._diagramInstance.onDimensionChanged();

    if (this._historyToolbarResizeCallback) {
      this._historyToolbarResizeCallback.call(this);
    }

    if (this._propertiesToolbarResizeCallback) {
      this._propertiesToolbarResizeCallback.call(this);
    }

    if (this._propertiesPanelResizeCallback) {
      this._propertiesPanelResizeCallback.call(this);
    }

    if (this._viewToolbarResizeCallback) {
      this._viewToolbarResizeCallback.call(this);
    }

    if (this._toolboxResizeCallback) {
      this._toolboxResizeCallback.call(this);
    }
  };

  _proto.isMobileScreenSize = function isMobileScreenSize() {
    if (this._isMobileScreenSize === undefined) {
      this._isMobileScreenSize = (0, _window.hasWindow)() && (0, _size.getOuterWidth)(this.$element()) < DIAGRAM_MAX_MOBILE_WINDOW_WIDTH;
    }

    return this._isMobileScreenSize;
  };

  _proto._captureFocus = function _captureFocus() {
    if (this._diagramInstance) {
      this._diagramInstance.captureFocus();
    }
  };

  _proto._captureFocusOnTimeout = function _captureFocusOnTimeout() {
    var _this2 = this;

    this._captureFocusTimeout = setTimeout(function () {
      _this2._captureFocus();

      delete _this2._captureFocusTimeout;
    }, 100);
  };

  _proto._killCaptureFocusTimeout = function _killCaptureFocusTimeout() {
    if (this._captureFocusTimeout) {
      clearTimeout(this._captureFocusTimeout);
      delete this._captureFocusTimeout;
    }
  };

  _proto.notifyBarCommandExecuted = function notifyBarCommandExecuted() {
    this._captureFocusOnTimeout();
  };

  _proto._registerToolbar = function _registerToolbar(component) {
    this._registerBar(component);

    this._toolbars.push(component);
  };

  _proto._registerBar = function _registerBar(component) {
    component.bar.onChanged.add(this);

    this._diagramInstance.registerBar(component.bar);
  };

  _proto._getExcludeCommands = function _getExcludeCommands() {
    var excludeCommands = [];

    if (!this._isToolboxEnabled()) {
      excludeCommands.push(_diagram4.default.SHOW_TOOLBOX_COMMAND_NAME);
    }

    if (!this._isPropertiesPanelEnabled()) {
      excludeCommands.push(_diagram4.default.SHOW_PROPERTIES_PANEL_COMMAND_NAME);
    }

    return excludeCommands;
  };

  _proto._getToolbarBaseOptions = function _getToolbarBaseOptions() {
    var _this3 = this;

    return {
      onContentReady: function onContentReady(_ref) {
        var component = _ref.component;
        return _this3._registerToolbar(component);
      },
      onSubMenuVisibilityChanging: function onSubMenuVisibilityChanging(_ref2) {
        var component = _ref2.component;
        return _this3._diagramInstance.updateBarItemsState(component.bar);
      },
      onPointerUp: this._onPanelPointerUp.bind(this),
      export: this.option('export'),
      excludeCommands: this._getExcludeCommands(),
      onInternalCommand: this._onInternalCommand.bind(this),
      onCustomCommand: this._onCustomCommand.bind(this),
      isMobileView: this.isMobileScreenSize()
    };
  };

  _proto._onInternalCommand = function _onInternalCommand(e) {
    switch (e.command) {
      case _diagram4.default.SHOW_TOOLBOX_COMMAND_NAME:
        if (this._toolbox) {
          this._toolbox.toggle();
        }

        break;

      case _diagram4.default.SHOW_PROPERTIES_PANEL_COMMAND_NAME:
        if (this._propertiesPanel) {
          this._propertiesPanel.toggle();
        }

        break;
    }
  };

  _proto._onCustomCommand = function _onCustomCommand(e) {
    this._customCommandAction({
      name: e.name
    });
  };

  _proto._renderMainToolbar = function _renderMainToolbar() {
    var $toolbarWrapper = (0, _renderer.default)('<div>').addClass(DIAGRAM_TOOLBAR_WRAPPER_CLASS).appendTo(this.$element());
    this._mainToolbar = this._createComponent($toolbarWrapper, _uiDiagram2.default, (0, _extend.extend)(this._getToolbarBaseOptions(), {
      commands: this.option('mainToolbar.commands'),
      skipAdjustSize: true
    }));
  };

  _proto._isHistoryToolbarVisible = function _isHistoryToolbarVisible() {
    return this.option('historyToolbar.visible') && !this.isReadOnlyMode();
  };

  _proto._renderHistoryToolbar = function _renderHistoryToolbar($parent) {
    var _this4 = this;

    var $container = (0, _renderer.default)('<div>').addClass(DIAGRAM_FLOATING_TOOLBAR_CONTAINER_CLASS).appendTo($parent);
    this._historyToolbar = this._createComponent($container, _uiDiagram3.default, (0, _extend.extend)(this._getToolbarBaseOptions(), {
      commands: this.option('historyToolbar.commands'),
      locateInMenu: 'never'
    }));

    this._updateHistoryToolbarPosition();

    this._historyToolbarResizeCallback = function () {
      _this4._historyToolbar.option('isMobileView', _this4.isMobileScreenSize());
    };
  };

  _proto._updateHistoryToolbarPosition = function _updateHistoryToolbarPosition() {
    if (!(0, _window.hasWindow)()) return;

    _position.default.setup(this._historyToolbar.$element(), {
      my: 'left top',
      at: 'left top',
      of: this._historyToolbar.$element().parent(),
      offset: DIAGRAM_FLOATING_PANEL_OFFSET + ' ' + DIAGRAM_FLOATING_PANEL_OFFSET
    });
  };

  _proto._isToolboxEnabled = function _isToolboxEnabled() {
    return this.option('toolbox.visibility') !== 'disabled' && !this.isReadOnlyMode();
  };

  _proto._isToolboxVisible = function _isToolboxVisible() {
    return this.option('toolbox.visibility') === 'visible' || this.option('toolbox.visibility') === 'auto' && !this.isMobileScreenSize();
  };

  _proto._renderToolbox = function _renderToolbox($parent) {
    var _this5 = this;

    var isServerSide = !(0, _window.hasWindow)();
    var $toolBox = (0, _renderer.default)('<div>').appendTo($parent);

    var bounds = this._getToolboxBounds($parent, isServerSide);

    this._toolbox = this._createComponent($toolBox, _uiDiagram10.default, {
      isMobileView: this.isMobileScreenSize(),
      isVisible: this._isToolboxVisible(),
      container: this.$element(),
      height: bounds.height,
      offsetParent: $parent,
      offsetX: bounds.offsetX,
      offsetY: bounds.offsetY,
      showSearch: this.option('toolbox.showSearch'),
      toolboxGroups: this._getToolboxGroups(),
      toolboxWidth: this.option('toolbox.width'),
      onShapeCategoryRendered: function onShapeCategoryRendered(e) {
        if (isServerSide) return;

        _this5._diagramInstance.createToolbox(e.$element[0], e.displayMode === 'texts', e.shapes || e.category, {
          shapeIconSpacing: DIAGRAM_TOOLBOX_SHAPE_SPACING,
          shapeIconCountInRow: _this5.option('toolbox.shapeIconsPerRow'),
          shapeIconAttributes: {
            'data-toggle': e.dataToggle
          },
          toolboxClass: DIAGRAM_OVERLAY_CONTENT_CLASS
        });
      },
      onFilterChanged: function onFilterChanged(e) {
        if (isServerSide) return;

        _this5._diagramInstance.applyToolboxFilter(e.text, e.filteringToolboxes);
      },
      onVisibilityChanging: function onVisibilityChanging(e) {
        if (isServerSide) return;

        _this5._setCustomCommandChecked(_diagram4.default.SHOW_TOOLBOX_COMMAND_NAME, e.visible);

        if (_this5._propertiesPanel) {
          if (e.visible && _this5.isMobileScreenSize()) {
            _this5._propertiesPanel.hide();
          }
        }

        if (_this5._historyToolbar) {
          if (e.visible && _this5.isMobileScreenSize()) {
            _this5._historyToolbarZIndex = zIndexPool.create(_ui2.default.baseZIndex());

            _this5._historyToolbar.$element().css('zIndex', _this5._historyToolbarZIndex);

            _this5._historyToolbar.$element().css('boxShadow', 'none');
          }
        }

        if (_this5._viewToolbar) {
          _this5._viewToolbar.$element().css('opacity', e.visible && _this5.isMobileScreenSize() ? '0' : '1');

          _this5._viewToolbar.$element().css('pointerEvents', e.visible && _this5.isMobileScreenSize() ? 'none' : '');
        }
      },
      onVisibilityChanged: function onVisibilityChanged(e) {
        if (!e.visible && !_this5._textInputStarted) {
          _this5._captureFocus();
        }

        if (!isServerSide) {
          if (_this5._historyToolbar) {
            if (!e.visible && _this5.isMobileScreenSize() && _this5._historyToolbarZIndex) {
              zIndexPool.remove(_this5._historyToolbarZIndex);

              _this5._historyToolbar.$element().css('zIndex', '');

              _this5._historyToolbar.$element().css('boxShadow', '');

              _this5._historyToolbarZIndex = undefined;
            }
          }
        }
      },
      onPointerUp: this._onPanelPointerUp.bind(this)
    });

    this._toolbox._popup.option('propagateOutsideClick', !this.option('fullScreen'));

    this._toolboxResizeCallback = function () {
      var bounds = _this5._getToolboxBounds($parent, isServerSide);

      _this5._toolbox.option('height', bounds.height);

      var prevIsMobileView = _this5._toolbox.option('isMobileView');

      if (prevIsMobileView !== _this5.isMobileScreenSize()) {
        _this5._toolbox.option({
          isMobileView: _this5.isMobileScreenSize(),
          isVisible: _this5._isToolboxVisible()
        });

        _this5._setCustomCommandChecked(_diagram4.default.SHOW_TOOLBOX_COMMAND_NAME, _this5._isToolboxVisible());
      }

      _this5._toolbox.updateMaxHeight();
    };
  };

  _proto._getToolboxBounds = function _getToolboxBounds($parent, isServerSide) {
    var result = {
      offsetX: DIAGRAM_FLOATING_PANEL_OFFSET,
      offsetY: DIAGRAM_FLOATING_PANEL_OFFSET,
      height: !isServerSide ? (0, _size.getHeight)($parent) - 2 * DIAGRAM_FLOATING_PANEL_OFFSET : 0
    };

    if (this._historyToolbar && !isServerSide) {
      result.offsetY += (0, _size.getOuterHeight)(this._historyToolbar.$element()) + DIAGRAM_FLOATING_PANEL_OFFSET;
      result.height -= (0, _size.getOuterHeight)(this._historyToolbar.$element()) + DIAGRAM_FLOATING_PANEL_OFFSET;
    }

    if (this._viewToolbar && !isServerSide) {
      result.height -= (0, _size.getOuterHeight)(this._viewToolbar.$element()) + this._getViewToolbarYOffset(isServerSide);
    }

    return result;
  };

  _proto._renderViewToolbar = function _renderViewToolbar($parent) {
    var _this6 = this;

    var isServerSide = !(0, _window.hasWindow)();
    var $container = (0, _renderer.default)('<div>').addClass(DIAGRAM_FLOATING_TOOLBAR_CONTAINER_CLASS).appendTo($parent);
    this._viewToolbar = this._createComponent($container, _uiDiagram4.default, (0, _extend.extend)(this._getToolbarBaseOptions(), {
      commands: this.option('viewToolbar.commands'),
      locateInMenu: 'never'
    }));

    this._updateViewToolbarPosition($container, $parent, isServerSide);

    this._viewToolbarResizeCallback = function () {
      _this6._updateViewToolbarPosition($container, $parent, isServerSide);
    };
  };

  _proto._getViewToolbarYOffset = function _getViewToolbarYOffset(isServerSide) {
    if (isServerSide) return;
    var result = DIAGRAM_FLOATING_PANEL_OFFSET;

    if (this._viewToolbar && this._propertiesToolbar) {
      result += ((0, _size.getOuterHeight)(this._propertiesToolbar.$element()) - (0, _size.getOuterHeight)(this._viewToolbar.$element())) / 2;
    }

    return result;
  };

  _proto._updateViewToolbarPosition = function _updateViewToolbarPosition($container, $parent, isServerSide) {
    if (isServerSide) return;

    _position.default.setup($container, {
      my: 'left bottom',
      at: 'left bottom',
      of: $parent,
      offset: DIAGRAM_FLOATING_PANEL_OFFSET + ' -' + this._getViewToolbarYOffset(isServerSide)
    });
  };

  _proto._isPropertiesPanelEnabled = function _isPropertiesPanelEnabled() {
    return this.option('propertiesPanel.visibility') !== 'disabled' && !this.isReadOnlyMode();
  };

  _proto._isPropertiesPanelVisible = function _isPropertiesPanelVisible() {
    return this.option('propertiesPanel.visibility') === 'visible';
  };

  _proto._renderPropertiesToolbar = function _renderPropertiesToolbar($parent) {
    var _this7 = this;

    var isServerSide = !(0, _window.hasWindow)();
    var $container = (0, _renderer.default)('<div>').addClass(DIAGRAM_FLOATING_TOOLBAR_CONTAINER_CLASS).addClass(DIAGRAM_PROPERTIES_PANEL_TOOLBAR_CONTAINER_CLASS).appendTo($parent);
    this._propertiesToolbar = this._createComponent($container, _uiDiagram5.default, (0, _extend.extend)(this._getToolbarBaseOptions(), {
      buttonStylingMode: 'contained',
      buttonType: 'default',
      locateInMenu: 'never'
    }));

    this._updatePropertiesToolbarPosition($container, $parent, isServerSide);

    this._propertiesToolbarResizeCallback = function () {
      _this7._updatePropertiesToolbarPosition($container, $parent, isServerSide);
    };
  };

  _proto._updatePropertiesToolbarPosition = function _updatePropertiesToolbarPosition($container, $parent, isServerSide) {
    if (isServerSide) return;

    _position.default.setup($container, {
      my: 'right bottom',
      at: 'right bottom',
      of: $parent,
      offset: '-' + DIAGRAM_FLOATING_PANEL_OFFSET + ' -' + DIAGRAM_FLOATING_PANEL_OFFSET
    });
  };

  _proto._renderPropertiesPanel = function _renderPropertiesPanel($parent) {
    var _this8 = this;

    var isServerSide = !(0, _window.hasWindow)();
    var $propertiesPanel = (0, _renderer.default)('<div>').appendTo($parent);
    var offsetX = DIAGRAM_FLOATING_PANEL_OFFSET;
    var offsetY = 2 * DIAGRAM_FLOATING_PANEL_OFFSET + (!isServerSide ? (0, _size.getOuterHeight)(this._propertiesToolbar.$element()) : 0);
    this._propertiesPanel = this._createComponent($propertiesPanel, _uiDiagram11.default, {
      isMobileView: this.isMobileScreenSize(),
      isVisible: this._isPropertiesPanelVisible(),
      container: this.$element(),
      offsetParent: $parent,
      offsetX: offsetX,
      offsetY: offsetY,
      propertyTabs: this.option('propertiesPanel.tabs'),
      onCreateToolbar: function onCreateToolbar(e) {
        e.toolbar = _this8._createComponent(e.$parent, _uiDiagram.default, (0, _extend.extend)(_this8._getToolbarBaseOptions(), {
          commands: e.commands,
          locateInMenu: 'never',
          editorStylingMode: 'outlined'
        }));
      },
      onVisibilityChanging: function onVisibilityChanging(e) {
        if (isServerSide) return;

        _this8._updatePropertiesPanelGroupBars(e.component);

        _this8._setCustomCommandChecked(_diagram4.default.SHOW_PROPERTIES_PANEL_COMMAND_NAME, e.visible);

        if (_this8._toolbox) {
          if (e.visible && _this8.isMobileScreenSize()) {
            _this8._toolbox.hide();
          }
        }
      },
      onVisibilityChanged: function onVisibilityChanged(e) {
        if (!e.visible && !_this8._textInputStarted) {
          _this8._captureFocus();
        }
      },
      onSelectedGroupChanged: function onSelectedGroupChanged(_ref3) {
        var component = _ref3.component;
        return _this8._updatePropertiesPanelGroupBars(component);
      },
      onPointerUp: this._onPanelPointerUp.bind(this)
    });

    this._propertiesPanelResizeCallback = function () {
      var prevIsMobileView = _this8._propertiesPanel.option('isMobileView');

      if (prevIsMobileView !== _this8.isMobileScreenSize()) {
        _this8._propertiesPanel.option({
          isMobileView: _this8.isMobileScreenSize(),
          isVisible: _this8._isPropertiesPanelVisible()
        });

        _this8._setCustomCommandChecked(_diagram4.default.SHOW_PROPERTIES_PANEL_COMMAND_NAME, _this8._isPropertiesPanelVisible());
      }
    };
  };

  _proto._updatePropertiesPanelGroupBars = function _updatePropertiesPanelGroupBars(component) {
    var _this9 = this;

    component.getActiveToolbars().forEach(function (toolbar) {
      _this9._diagramInstance.updateBarItemsState(toolbar.bar);
    });
  };

  _proto._onPanelPointerUp = function _onPanelPointerUp() {
    this._captureFocusOnTimeout();
  };

  _proto._renderContextMenu = function _renderContextMenu($parent) {
    var _this10 = this;

    var $contextMenu = (0, _renderer.default)('<div>').appendTo($parent);
    this._contextMenu = this._createComponent($contextMenu, _uiDiagram6.default.DiagramContextMenuWrapper, {
      commands: this.option('contextMenu.commands'),
      onContentReady: function onContentReady(_ref4) {
        var component = _ref4.component;
        return _this10._registerBar(component);
      },
      onVisibilityChanging: function onVisibilityChanging(_ref5) {
        var component = _ref5.component;
        return _this10._diagramInstance.updateBarItemsState(component.bar);
      },
      onItemClick: function onItemClick(itemData) {
        return _this10._onBeforeCommandExecuted(itemData.command);
      },
      export: this.option('export'),
      excludeCommands: this._getExcludeCommands(),
      onInternalCommand: this._onInternalCommand.bind(this),
      onCustomCommand: this._onCustomCommand.bind(this)
    });
  };

  _proto._renderContextToolbox = function _renderContextToolbox($parent) {
    var _this11 = this;

    var isServerSide = !(0, _window.hasWindow)();
    var category = this.option('contextToolbox.category');
    var displayMode = this.option('contextToolbox.displayMode');
    var shapes = this.option('contextToolbox.shapes');
    var $contextToolbox = (0, _renderer.default)('<div>').appendTo($parent);
    this._contextToolbox = this._createComponent($contextToolbox, _uiDiagram7.default, {
      toolboxWidth: this.option('contextToolbox.width'),
      onShown: function onShown(e) {
        if (isServerSide) return;
        var $toolboxContainer = (0, _renderer.default)(e.$element);
        var isTextGroup = displayMode === 'texts';

        if (!shapes && !category && !isTextGroup) {
          var group = _this11._getToolboxGroups().filter(function (g) {
            return g.category === e.category;
          })[0];

          if (group) {
            isTextGroup = group.displayMode === 'texts';
          }
        }

        _this11._diagramInstance.createContextToolbox($toolboxContainer[0], isTextGroup, shapes || category || e.category, {
          shapeIconSpacing: DIAGRAM_CONTEXT_TOOLBOX_SHAPE_SPACING,
          shapeIconCountInRow: _this11.option('contextToolbox.shapeIconsPerRow')
        }, function (shapeType) {
          e.callback(shapeType);

          _this11._captureFocus();

          e.hide();
        });
      }
    });
  };

  _proto._setCustomCommandChecked = function _setCustomCommandChecked(command, checked) {
    this._toolbars.forEach(function (tb) {
      tb.setCommandChecked(command, checked);
    });
  };

  _proto._onBeforeCommandExecuted = function _onBeforeCommandExecuted(command) {
    var dialogParameters = _uiDiagram12.default.getDialogParameters(command);

    if (dialogParameters) {
      this._showDialog(dialogParameters);
    }

    return !!dialogParameters;
  };

  _proto._renderDialog = function _renderDialog($parent) {
    var $dialogElement = (0, _renderer.default)('<div>').appendTo($parent);
    this._dialogInstance = this._createComponent($dialogElement, _uiDiagram8.default, {});
  };

  _proto._showDialog = function _showDialog(dialogParameters) {
    if (this._dialogInstance) {
      this._dialogInstance.option('onGetContent', dialogParameters.onGetContent);

      this._dialogInstance.option('onHidden', function () {
        this._captureFocus();
      }.bind(this));

      this._dialogInstance.option('command', this._diagramInstance.getCommand(dialogParameters.command));

      this._dialogInstance.option('title', dialogParameters.title);

      this._dialogInstance._show();
    }
  };

  _proto._showLoadingIndicator = function _showLoadingIndicator() {
    this._loadingIndicator = (0, _renderer.default)('<div>').addClass(DIAGRAM_LOADING_INDICATOR_CLASS);

    this._createComponent(this._loadingIndicator, _load_indicator.default, {});

    var $parent = this._$content || this.$element();
    $parent.append(this._loadingIndicator);
  };

  _proto._hideLoadingIndicator = function _hideLoadingIndicator() {
    if (!this._loadingIndicator) return;

    this._loadingIndicator.remove();

    this._loadingIndicator = null;
  };

  _proto._initDiagram = function _initDiagram() {
    var _getDiagram = (0, _diagram.getDiagram)(),
        DiagramControl = _getDiagram.DiagramControl;

    this._diagramInstance = new DiagramControl();
    this._diagramInstance.onChanged = this._raiseDataChangeAction.bind(this);
    this._diagramInstance.onEdgeInserted = this._raiseEdgeInsertedAction.bind(this);
    this._diagramInstance.onEdgeUpdated = this._raiseEdgeUpdatedAction.bind(this);
    this._diagramInstance.onEdgeRemoved = this._raiseEdgeRemovedAction.bind(this);
    this._diagramInstance.onNodeInserted = this._raiseNodeInsertedAction.bind(this);
    this._diagramInstance.onNodeUpdated = this._raiseNodeUpdatedAction.bind(this);
    this._diagramInstance.onNodeRemoved = this._raiseNodeRemovedAction.bind(this);
    this._diagramInstance.onToolboxDragStart = this._raiseToolboxDragStart.bind(this);
    this._diagramInstance.onToolboxDragEnd = this._raiseToolboxDragEnd.bind(this);
    this._diagramInstance.onTextInputStart = this._raiseTextInputStart.bind(this);
    this._diagramInstance.onTextInputEnd = this._raiseTextInputEnd.bind(this);
    this._diagramInstance.onToggleFullscreen = this._onToggleFullScreen.bind(this);
    this._diagramInstance.onShowContextMenu = this._onShowContextMenu.bind(this);
    this._diagramInstance.onHideContextMenu = this._onHideContextMenu.bind(this);
    this._diagramInstance.onShowContextToolbox = this._onShowContextToolbox.bind(this);
    this._diagramInstance.onHideContextToolbox = this._onHideContextToolbox.bind(this);

    this._diagramInstance.onNativeAction.add({
      notifyItemClick: this._raiseItemClickAction.bind(this),
      notifyItemDblClick: this._raiseItemDblClickAction.bind(this),
      notifySelectionChanged: this._raiseSelectionChanged.bind(this)
    });

    this._diagramInstance.onRequestOperation = this._raiseRequestEditOperation.bind(this);

    this._updateEventSubscriptionMethods();

    this._updateDefaultItemProperties();

    this._updateEditingSettings();

    this._updateShapeTexts();

    this._updateUnitItems();

    this._updateFormatUnitsMethod();

    if (this.option('units') !== DIAGRAM_DEFAULT_UNIT) {
      this._updateUnitsState();
    }

    if (this.isReadOnlyMode()) {
      this._updateReadOnlyState();
    }

    if (this.option('pageSize')) {
      if (this.option('pageSize.items')) {
        this._updatePageSizeItemsState();
      }

      if (this.option('pageSize.width') && this.option('pageSize.height')) {
        this._updatePageSizeState();
      }
    }

    if (this.option('pageOrientation') !== DIAGRAM_DEFAULT_PAGE_ORIENTATION) {
      this._updatePageOrientationState();
    }

    if (this.option('pageColor') !== DIAGRAM_DEFAULT_PAGE_COLOR) {
      this._updatePageColorState();
    }

    if (this.option('viewUnits') !== DIAGRAM_DEFAULT_UNIT) {
      this._updateViewUnitsState();
    }

    if (!this.option('showGrid')) {
      this._updateShowGridState();
    }

    if (!this.option('snapToGrid')) {
      this._updateSnapToGridState();
    }

    if (this.option('gridSize')) {
      this._updateGridSizeState();
    }

    if (this.option('zoomLevel') !== DIAGRAM_DEFAULT_ZOOMLEVEL) {
      this._updateZoomLevelState();
    }

    if (this.option('simpleView')) {
      this._updateSimpleViewState();
    }

    if (this.option('autoZoomMode') !== DIAGRAM_DEFAULT_AUTOZOOM_MODE) {
      this._updateAutoZoomState();
    }

    if (this.option('fullScreen')) {
      var window = (0, _window.getWindow)();

      if (window && window.self !== window.top) {
        this.option('fullScreen', false);
      } else {
        this._updateFullscreenState();
      }
    }

    this._createOptionsUpdateBar();

    if ((0, _window.hasWindow)()) {
      // eslint-disable-next-line spellcheck/spell-checker
      this._diagramInstance.initMeasurer(this.$element()[0]);
    }

    this._updateCustomShapes(this._getCustomShapes());

    this._refreshDataSources();
  };

  _proto._createOptionsUpdateBar = function _createOptionsUpdateBar() {
    if (!this.optionsUpdateBar) {
      this.optionsUpdateBar = new _diagram3.default(this);

      this._diagramInstance.registerBar(this.optionsUpdateBar);
    }
  };

  _proto._deleteOptionsUpdateBar = function _deleteOptionsUpdateBar() {
    delete this.optionsUpdateBar;
  };

  _proto._clean = function _clean() {
    if (this._diagramInstance) {
      this._diagramInstance.cleanMarkup(function (element) {
        (0, _renderer.default)(element).empty();
      });

      this._deleteOptionsUpdateBar();
    }

    _Widget.prototype._clean.call(this);
  };

  _proto._dispose = function _dispose() {
    this._killCaptureFocusTimeout();

    _Widget.prototype._dispose.call(this);

    this._diagramInstance = undefined;
  };

  _proto._executeDiagramCommand = function _executeDiagramCommand(command, parameter) {
    this._diagramInstance.getCommand(command).execute(parameter);
  };

  _proto.getNodeDataSource = function getNodeDataSource() {
    return this._nodesOption && this._nodesOption.getDataSource();
  };

  _proto.getEdgeDataSource = function getEdgeDataSource() {
    return this._edgesOption && this._edgesOption.getDataSource();
  };

  _proto._refreshDataSources = function _refreshDataSources() {
    this._beginUpdateDiagram();

    this._refreshNodesDataSource();

    this._refreshEdgesDataSource();

    this._endUpdateDiagram();
  };

  _proto._refreshNodesDataSource = function _refreshNodesDataSource() {
    if (this._nodesOption) {
      this._nodesOption._disposeDataSource();

      delete this._nodesOption;
    }

    if (this.option('nodes.dataSource')) {
      this._nodesOption = new _diagram5.default(this);

      this._nodesOption.option('dataSource', this.option('nodes.dataSource'));

      this._nodesOption._refreshDataSource();
    }
  };

  _proto._refreshEdgesDataSource = function _refreshEdgesDataSource() {
    if (this._edgesOption) {
      this._edgesOption._disposeDataSource();

      delete this._edgesOption;
    }

    if (this.option('edges.dataSource')) {
      this._edgesOption = new _diagram6.default(this);

      this._edgesOption.option('dataSource', this.option('edges.dataSource'));

      this._edgesOption._refreshDataSource();
    }
  };

  _proto._getDiagramData = function _getDiagramData() {
    var value;

    var _getDiagram2 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram2.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.Export, function (data) {
      value = data;
    });

    return value;
  };

  _proto._setDiagramData = function _setDiagramData(data, keepExistingItems) {
    var _getDiagram3 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram3.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.Import, {
      data: data,
      keepExistingItems: keepExistingItems
    });
  };

  _proto.isReadOnlyMode = function isReadOnlyMode() {
    return this.option('readOnly') || this.option('disabled');
  };

  _proto._onDataSourceChanged = function _onDataSourceChanged() {
    this._bindDiagramData();
  };

  _proto._getChangesKeys = function _getChangesKeys(changes) {
    return changes.map(function (change) {
      if ((0, _type.isDefined)(change.internalKey)) {
        return change.internalKey;
      } else if ((0, _type.isDefined)(change.key)) {
        return change.key;
      } else {
        return null;
      }
    }).filter(function (key) {
      return (0, _type.isDefined)(key);
    });
  };

  _proto._createOptionGetter = function _createOptionGetter(optionName) {
    var expr = this.option(optionName);
    return expr && (0, _data.compileGetter)(expr);
  };

  _proto._onRequestUpdateLayout = function _onRequestUpdateLayout(changes) {
    if (!this._requestLayoutUpdateAction) {
      this._createRequestLayoutUpdateAction();
    }

    var eventArgs = {
      changes: changes,
      allowed: false
    };

    this._requestLayoutUpdateAction(eventArgs);

    return eventArgs.allowed;
  };

  _proto._createOptionSetter = function _createOptionSetter(optionName) {
    var expr = this.option(optionName);

    if ((0, _type.isFunction)(expr)) {
      return expr;
    }

    return expr && (0, _data.compileSetter)(expr);
  };

  _proto._bindDiagramData = function _bindDiagramData() {
    if (this._updateDiagramLockCount || !this._isBindingMode()) return;

    var _getDiagram4 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram4.DiagramCommand,
        ConnectorLineOption = _getDiagram4.ConnectorLineOption,
        ConnectorLineEnding = _getDiagram4.ConnectorLineEnding;

    var lineOptionGetter;
    var lineOptionSetter;
    var startLineEndingGetter;
    var startLineEndingSetter;
    var endLineEndingGetter;
    var endLineEndingSetter;
    var containerChildrenGetter;
    var containerChildrenSetter;
    var data = {
      nodeDataSource: this._nodesOption && this._nodesOption.getItems(),
      edgeDataSource: this._edgesOption && this._edgesOption.getItems(),
      nodeDataImporter: {
        getKey: this._createOptionGetter('nodes.keyExpr'),
        setKey: this._createOptionSetter('nodes.keyExpr'),
        getCustomData: this._createOptionGetter('nodes.customDataExpr'),
        setCustomData: this._createOptionSetter('nodes.customDataExpr'),
        getLocked: this._createOptionGetter('nodes.lockedExpr'),
        setLocked: this._createOptionSetter('nodes.lockedExpr'),
        getStyle: this._createOptionGetter('nodes.styleExpr'),
        setStyle: this._createOptionSetter('nodes.styleExpr'),
        getStyleText: this._createOptionGetter('nodes.textStyleExpr'),
        setStyleText: this._createOptionSetter('nodes.textStyleExpr'),
        getZIndex: this._createOptionGetter('nodes.zIndexExpr'),
        setZIndex: this._createOptionSetter('nodes.zIndexExpr'),
        getType: this._createOptionGetter('nodes.typeExpr'),
        setType: this._createOptionSetter('nodes.typeExpr'),
        getText: this._createOptionGetter('nodes.textExpr'),
        setText: this._createOptionSetter('nodes.textExpr'),
        getImage: this._createOptionGetter('nodes.imageUrlExpr'),
        setImage: this._createOptionSetter('nodes.imageUrlExpr'),
        getLeft: this._createOptionGetter('nodes.leftExpr'),
        setLeft: this._createOptionSetter('nodes.leftExpr'),
        getTop: this._createOptionGetter('nodes.topExpr'),
        setTop: this._createOptionSetter('nodes.topExpr'),
        getWidth: this._createOptionGetter('nodes.widthExpr'),
        setWidth: this._createOptionSetter('nodes.widthExpr'),
        getHeight: this._createOptionGetter('nodes.heightExpr'),
        setHeight: this._createOptionSetter('nodes.heightExpr'),
        getParentKey: this._createOptionGetter('nodes.parentKeyExpr'),
        setParentKey: this._createOptionSetter('nodes.parentKeyExpr'),
        getItems: this._createOptionGetter('nodes.itemsExpr'),
        setItems: this._createOptionSetter('nodes.itemsExpr'),
        getChildren: containerChildrenGetter = this._createOptionGetter('nodes.containerChildrenExpr'),
        setChildren: containerChildrenSetter = this._createOptionSetter('nodes.containerChildrenExpr'),
        getContainerKey: !containerChildrenGetter && !containerChildrenSetter && this._createOptionGetter('nodes.containerKeyExpr'),
        setContainerKey: !containerChildrenGetter && !containerChildrenSetter && this._createOptionSetter('nodes.containerKeyExpr')
      },
      edgeDataImporter: {
        getKey: this._createOptionGetter('edges.keyExpr'),
        setKey: this._createOptionSetter('edges.keyExpr'),
        getCustomData: this._createOptionGetter('edges.customDataExpr'),
        setCustomData: this._createOptionSetter('edges.customDataExpr'),
        getLocked: this._createOptionGetter('edges.lockedExpr'),
        setLocked: this._createOptionSetter('edges.lockedExpr'),
        getStyle: this._createOptionGetter('edges.styleExpr'),
        setStyle: this._createOptionSetter('edges.styleExpr'),
        getStyleText: this._createOptionGetter('edges.textStyleExpr'),
        setStyleText: this._createOptionSetter('edges.textStyleExpr'),
        getZIndex: this._createOptionGetter('edges.zIndexExpr'),
        setZIndex: this._createOptionSetter('edges.zIndexExpr'),
        getFrom: this._createOptionGetter('edges.fromExpr'),
        setFrom: this._createOptionSetter('edges.fromExpr'),
        getFromPointIndex: this._createOptionGetter('edges.fromPointIndexExpr'),
        setFromPointIndex: this._createOptionSetter('edges.fromPointIndexExpr'),
        getTo: this._createOptionGetter('edges.toExpr'),
        setTo: this._createOptionSetter('edges.toExpr'),
        getToPointIndex: this._createOptionGetter('edges.toPointIndexExpr'),
        setToPointIndex: this._createOptionSetter('edges.toPointIndexExpr'),
        getPoints: this._createOptionGetter('edges.pointsExpr'),
        setPoints: this._createOptionSetter('edges.pointsExpr'),
        getText: this._createOptionGetter('edges.textExpr'),
        setText: this._createOptionSetter('edges.textExpr'),
        getLineOption: (lineOptionGetter = this._createOptionGetter('edges.lineTypeExpr')) && function (obj) {
          var lineType = lineOptionGetter(obj);
          return this._getConnectorLineOption(lineType);
        }.bind(this),
        setLineOption: (lineOptionSetter = this._createOptionSetter('edges.lineTypeExpr')) && function (obj, value) {
          switch (value) {
            case ConnectorLineOption.Straight:
              value = 'straight';
              break;

            case ConnectorLineOption.Orthogonal:
              value = 'orthogonal';
              break;
          }

          lineOptionSetter(obj, value);
        }.bind(this),
        getStartLineEnding: (startLineEndingGetter = this._createOptionGetter('edges.fromLineEndExpr')) && function (obj) {
          var lineEnd = startLineEndingGetter(obj);
          return this._getConnectorLineEnding(lineEnd);
        }.bind(this),
        setStartLineEnding: (startLineEndingSetter = this._createOptionSetter('edges.fromLineEndExpr')) && function (obj, value) {
          switch (value) {
            case ConnectorLineEnding.Arrow:
              value = 'arrow';
              break;

            case ConnectorLineEnding.OutlinedTriangle:
              value = 'outlinedTriangle';
              break;

            case ConnectorLineEnding.FilledTriangle:
              value = 'filledTriangle';
              break;

            case ConnectorLineEnding.None:
              value = 'none';
              break;
          }

          startLineEndingSetter(obj, value);
        }.bind(this),
        getEndLineEnding: (endLineEndingGetter = this._createOptionGetter('edges.toLineEndExpr')) && function (obj) {
          var lineEnd = endLineEndingGetter(obj);
          return this._getConnectorLineEnding(lineEnd);
        }.bind(this),
        setEndLineEnding: (endLineEndingSetter = this._createOptionSetter('edges.toLineEndExpr')) && function (obj, value) {
          switch (value) {
            case ConnectorLineEnding.Arrow:
              value = 'arrow';
              break;

            case ConnectorLineEnding.OutlinedTriangle:
              value = 'outlinedTriangle';
              break;

            case ConnectorLineEnding.FilledTriangle:
              value = 'filledTriangle';
              break;

            case ConnectorLineEnding.None:
              value = 'none';
              break;
          }

          endLineEndingSetter(obj, value);
        }.bind(this)
      },
      layoutParameters: this._getDataBindingLayoutParameters()
    };

    this._executeDiagramCommand(DiagramCommand.BindDocument, data);
  };

  _proto._reloadContentByChanges = function _reloadContentByChanges(changes, isExternalChanges) {
    var keys = this._getChangesKeys(changes);

    var applyLayout = this._onRequestUpdateLayout(changes);

    this._reloadContent(keys, applyLayout, isExternalChanges);
  };

  _proto._reloadContent = function _reloadContent(itemKeys, applyLayout, isExternalChanges) {
    var _this12 = this;

    var getData = function getData() {
      var nodeDataSource;
      var edgeDataSource;

      if (_this12._nodesOption && isExternalChanges) {
        nodeDataSource = _this12._nodesOption.getItems();
      }

      if (_this12._edgesOption && isExternalChanges) {
        edgeDataSource = _this12._edgesOption.getItems();
      }

      return {
        nodeDataSource: nodeDataSource,
        edgeDataSource: edgeDataSource
      };
    };

    this._diagramInstance.reloadContent(itemKeys, getData, applyLayout && this._getDataBindingLayoutParameters(), isExternalChanges);
  };

  _proto._getConnectorLineOption = function _getConnectorLineOption(lineType) {
    var _getDiagram5 = (0, _diagram.getDiagram)(),
        ConnectorLineOption = _getDiagram5.ConnectorLineOption;

    switch (lineType) {
      case 'straight':
        return ConnectorLineOption.Straight;

      default:
        return ConnectorLineOption.Orthogonal;
    }
  };

  _proto._getConnectorLineEnding = function _getConnectorLineEnding(lineEnd) {
    var _getDiagram6 = (0, _diagram.getDiagram)(),
        ConnectorLineEnding = _getDiagram6.ConnectorLineEnding;

    switch (lineEnd) {
      case 'arrow':
        return ConnectorLineEnding.Arrow;

      case 'outlinedTriangle':
        return ConnectorLineEnding.OutlinedTriangle;

      case 'filledTriangle':
        return ConnectorLineEnding.FilledTriangle;

      default:
        return ConnectorLineEnding.None;
    }
  };

  _proto._getDataBindingLayoutParameters = function _getDataBindingLayoutParameters() {
    var _getDiagram7 = (0, _diagram.getDiagram)(),
        DataLayoutType = _getDiagram7.DataLayoutType,
        DataLayoutOrientation = _getDiagram7.DataLayoutOrientation;

    var layoutParametersOption = this.option('nodes.autoLayout') || 'off';
    var layoutType = layoutParametersOption.type || layoutParametersOption;
    var parameters = {};

    if (layoutType !== 'off' && (layoutType !== 'auto' || !this._hasNodePositionExprs())) {
      switch (layoutType) {
        case 'tree':
          parameters.type = DataLayoutType.Tree;
          break;

        default:
          parameters.type = DataLayoutType.Sugiyama;
          break;
      }

      switch (layoutParametersOption.orientation) {
        case 'vertical':
          parameters.orientation = DataLayoutOrientation.Vertical;
          break;

        case 'horizontal':
          parameters.orientation = DataLayoutOrientation.Horizontal;
          break;
      }

      if (this.option('edges.fromPointIndexExpr') || this.option('edges.toPointIndexExpr')) {
        parameters.skipPointIndices = true;
      }
    }

    parameters.autoSizeEnabled = !!this.option('nodes.autoSizeEnabled');
    return parameters;
  };

  _proto._hasNodePositionExprs = function _hasNodePositionExprs() {
    return this.option('nodes.topExpr') && this.option('nodes.leftExpr');
  };

  _proto._getAutoZoomValue = function _getAutoZoomValue(option) {
    var _getDiagram8 = (0, _diagram.getDiagram)(),
        AutoZoomMode = _getDiagram8.AutoZoomMode;

    switch (option) {
      case 'fitContent':
        return AutoZoomMode.FitContent;

      case 'fitWidth':
        return AutoZoomMode.FitToWidth;

      default:
        return AutoZoomMode.Disabled;
    }
  };

  _proto._isBindingMode = function _isBindingMode() {
    return this._nodesOption && this._nodesOption.hasItems() || this._edgesOption && this._edgesOption.hasItems();
  };

  _proto._beginUpdateDiagram = function _beginUpdateDiagram() {
    this._updateDiagramLockCount++;
  };

  _proto._endUpdateDiagram = function _endUpdateDiagram() {
    this._updateDiagramLockCount = Math.max(this._updateDiagramLockCount - 1, 0);

    if (!this._updateDiagramLockCount) {
      this._bindDiagramData();
    }
  };

  _proto._getCustomShapes = function _getCustomShapes() {
    return this.option('customShapes') || [];
  };

  _proto._getToolboxGroups = function _getToolboxGroups() {
    return _diagram2.default.getGroups(this.option('toolbox.groups'));
  };

  _proto._updateAllCustomShapes = function _updateAllCustomShapes() {
    this._diagramInstance.removeAllCustomShapes();

    this._updateCustomShapes(this._getCustomShapes());
  };

  _proto._updateCustomShapes = function _updateCustomShapes(customShapes, prevCustomShapes) {
    var _this13 = this;

    if (Array.isArray(prevCustomShapes)) {
      this._diagramInstance.removeCustomShapes(prevCustomShapes.map(function (s) {
        return s.type;
      }));
    }

    if (Array.isArray(customShapes)) {
      this._diagramInstance.addCustomShapes(customShapes.map(function (s) {
        var templateOption = s.template || _this13.option('customShapeTemplate');

        var template = templateOption && _this13._getTemplate(templateOption);

        var toolboxTemplateOption = s.toolboxTemplate || _this13.option('customShapeToolboxTemplate');

        var toolboxTemplate = toolboxTemplateOption && _this13._getTemplate(toolboxTemplateOption);

        return {
          category: s.category,
          type: s.type,
          baseType: s.baseType,
          title: s.title,
          svgUrl: s.backgroundImageUrl,
          svgToolboxUrl: s.backgroundImageToolboxUrl,
          svgLeft: s.backgroundImageLeft,
          svgTop: s.backgroundImageTop,
          svgWidth: s.backgroundImageWidth,
          svgHeight: s.backgroundImageHeight,
          defaultWidth: s.defaultWidth,
          defaultHeight: s.defaultHeight,
          toolboxWidthToHeightRatio: s.toolboxWidthToHeightRatio,
          minWidth: s.minWidth,
          minHeight: s.minHeight,
          maxWidth: s.maxWidth,
          maxHeight: s.maxHeight,
          allowResize: s.allowResize,
          defaultText: s.defaultText,
          allowEditText: s.allowEditText,
          textLeft: s.textLeft,
          textTop: s.textTop,
          textWidth: s.textWidth,
          textHeight: s.textHeight,
          defaultImageUrl: s.defaultImageUrl,
          allowEditImage: s.allowEditImage,
          imageLeft: s.imageLeft,
          imageTop: s.imageTop,
          imageWidth: s.imageWidth,
          imageHeight: s.imageHeight,
          connectionPoints: s.connectionPoints && s.connectionPoints.map(function (pt) {
            return {
              'x': pt.x,
              'y': pt.y
            };
          }),
          createTemplate: template && function (container, item) {
            template.render({
              model: _this13._nativeItemToDiagramItem(item),
              container: (0, _element.getPublicElement)((0, _renderer.default)(container))
            });
          },
          createToolboxTemplate: toolboxTemplate && function (container, item) {
            toolboxTemplate.render({
              model: _this13._nativeItemToDiagramItem(item),
              container: (0, _element.getPublicElement)((0, _renderer.default)(container))
            });
          },
          destroyTemplate: template && function (container) {
            (0, _renderer.default)(container).empty();
          },
          templateLeft: s.templateLeft,
          templateTop: s.templateTop,
          templateWidth: s.templateWidth,
          templateHeight: s.templateHeight,
          keepRatioOnAutoSize: s.keepRatioOnAutoSize
        };
      }));
    }
  };

  _proto._getViewport = function _getViewport() {
    var $viewPort = this.$element().closest('.dx-viewport');
    return $viewPort.length ? $viewPort : (0, _renderer.default)('body');
  };

  _proto._onToggleFullScreen = function _onToggleFullScreen(fullScreen) {
    if (this.toggleFullscreenLock > 0) return;

    this._changeNativeFullscreen(fullScreen);

    if (fullScreen) {
      this._prevParent = this.$element().parent();
      this._prevFullScreenZIndex = this.$element().css('zIndex');
      this._fullScreenZIndex = zIndexPool.create(_ui2.default.baseZIndex());
      this.$element().css('zIndex', this._fullScreenZIndex);
      this.$element().appendTo(this._getViewport());
    } else {
      this.$element().appendTo(this._prevParent);

      if (this._fullScreenZIndex) {
        zIndexPool.remove(this._fullScreenZIndex);
        this.$element().css('zIndex', this._prevFullScreenZIndex);
      }
    }

    this.$element().toggleClass(DIAGRAM_FULLSCREEN_CLASS, fullScreen);

    this._processDiagramResize();

    if (this._toolbox) {
      this._toolbox.repaint();

      this._toolbox._popup.option('propagateOutsideClick', !fullScreen);
    }

    if (this._propertiesPanel) {
      this._propertiesPanel.repaint();
    }

    if (this._historyToolbar) {
      this._updateHistoryToolbarPosition();
    }
  };

  _proto._changeNativeFullscreen = function _changeNativeFullscreen(setModeOn) {
    var window = (0, _window.getWindow)();
    if (window.self === window.top || setModeOn === this._inNativeFullscreen()) return;

    if (setModeOn) {
      this._subscribeFullscreenNativeChanged();
    } else {
      this._unsubscribeFullscreenNativeChanged();
    }

    this._setNativeFullscreen(setModeOn);
  };

  _proto._setNativeFullscreen = function _setNativeFullscreen(on) {
    var window = (0, _window.getWindow)();
    var document = window.self.document;
    var body = window.self.document.body;

    if (on) {
      if (body.requestFullscreen) {
        body.requestFullscreen();
      } else if (body.mozRequestFullscreen) {
        body.mozRequestFullscreen();
      } else if (body.webkitRequestFullscreen) {
        body.webkitRequestFullscreen();
      } else if (body.msRequestFullscreen) {
        body.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullscreen) {
        document.mozCancelFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  _proto._inNativeFullscreen = function _inNativeFullscreen() {
    var document = (0, _window.getWindow)().document;
    var fullscreenElement = document.fullscreenElement || document.msFullscreenElement || document.webkitFullscreenElement;
    var isInFullscreen = fullscreenElement === document.body || document.webkitIsFullscreen;
    return !!isInFullscreen;
  };

  _proto._subscribeFullscreenNativeChanged = function _subscribeFullscreenNativeChanged() {
    var document = (0, _window.getWindow)().document;

    var handler = this._onNativeFullscreenChangeHandler.bind(this);

    _events_engine.default.on(document, FULLSCREEN_CHANGE_EVENT_NAME, handler);

    _events_engine.default.on(document, IE_FULLSCREEN_CHANGE_EVENT_NAME, handler);

    _events_engine.default.on(document, WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME, handler);

    _events_engine.default.on(document, MOZ_FULLSCREEN_CHANGE_EVENT_NAME, handler);
  };

  _proto._unsubscribeFullscreenNativeChanged = function _unsubscribeFullscreenNativeChanged() {
    var document = (0, _window.getWindow)().document;

    _events_engine.default.off(document, FULLSCREEN_CHANGE_EVENT_NAME);

    _events_engine.default.off(document, IE_FULLSCREEN_CHANGE_EVENT_NAME);

    _events_engine.default.off(document, WEBKIT_FULLSCREEN_CHANGE_EVENT_NAME);

    _events_engine.default.off(document, MOZ_FULLSCREEN_CHANGE_EVENT_NAME);
  };

  _proto._onNativeFullscreenChangeHandler = function _onNativeFullscreenChangeHandler() {
    if (!this._inNativeFullscreen()) {
      this._unsubscribeFullscreenNativeChanged();

      this.option('fullScreen', false);
    }
  };

  _proto._executeDiagramFullscreenCommand = function _executeDiagramFullscreenCommand(fullscreen) {
    var _getDiagram9 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram9.DiagramCommand;

    this.toggleFullscreenLock++;

    this._executeDiagramCommand(DiagramCommand.Fullscreen, fullscreen);

    this.toggleFullscreenLock--;
  };

  _proto._onShowContextMenu = function _onShowContextMenu(x, y, isTouchMode, selection) {
    if (this._contextMenu) {
      this._contextMenu._isTouchMode = isTouchMode;

      this._contextMenu._show(x, y, selection);
    }
  };

  _proto._onHideContextMenu = function _onHideContextMenu() {
    if (this._contextMenu) {
      this._contextMenu._hide();
    }
  };

  _proto._onShowContextToolbox = function _onShowContextToolbox(x, y, side, category, callback) {
    if (this._contextToolbox) {
      this._contextToolbox._show(x, y, side, category, callback);
    }
  };

  _proto._onHideContextToolbox = function _onHideContextToolbox() {
    if (this._contextToolbox) {
      this._contextToolbox._hide();
    }
  };

  _proto._getDiagramUnitValue = function _getDiagramUnitValue(value) {
    var _getDiagram10 = (0, _diagram.getDiagram)(),
        DiagramUnit = _getDiagram10.DiagramUnit;

    switch (value) {
      case 'in':
        return DiagramUnit.In;

      case 'cm':
        return DiagramUnit.Cm;

      case 'px':
        return DiagramUnit.Px;

      default:
        return DiagramUnit.In;
    }
  };

  _proto._updateReadOnlyState = function _updateReadOnlyState() {
    var _getDiagram11 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram11.DiagramCommand;

    var readOnly = this.isReadOnlyMode();

    this._executeDiagramCommand(DiagramCommand.ToggleReadOnly, readOnly);
  };

  _proto._updateZoomLevelState = function _updateZoomLevelState() {
    if (this.option('zoomLevel.items')) {
      this._updateZoomLevelItemsState();

      var zoomLevel = this.option('zoomLevel.value');
      if (!zoomLevel) return;

      var _getDiagram12 = (0, _diagram.getDiagram)(),
          DiagramCommand = _getDiagram12.DiagramCommand;

      this._executeDiagramCommand(DiagramCommand.ZoomLevel, zoomLevel);
    } else {
      var _zoomLevel = this.option('zoomLevel.value') || this.option('zoomLevel');

      if (!_zoomLevel) return;

      var _getDiagram13 = (0, _diagram.getDiagram)(),
          _DiagramCommand = _getDiagram13.DiagramCommand;

      this._executeDiagramCommand(_DiagramCommand.ZoomLevel, _zoomLevel);
    }
  };

  _proto._updateZoomLevelItemsState = function _updateZoomLevelItemsState() {
    var zoomLevelItems = this.option('zoomLevel.items');
    if (!Array.isArray(zoomLevelItems)) return;

    var _getDiagram14 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram14.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.ZoomLevelItems, zoomLevelItems);
  };

  _proto._updateAutoZoomState = function _updateAutoZoomState() {
    var _getDiagram15 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram15.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.SwitchAutoZoom, this._getAutoZoomValue(this.option('autoZoomMode')));
  };

  _proto._updateSimpleViewState = function _updateSimpleViewState() {
    var _getDiagram16 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram16.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.ToggleSimpleView, this.option('simpleView'));
  };

  _proto._updateFullscreenState = function _updateFullscreenState() {
    var fullscreen = this.option('fullScreen');

    this._executeDiagramFullscreenCommand(fullscreen);

    this._onToggleFullScreen(fullscreen);
  };

  _proto._updateShowGridState = function _updateShowGridState() {
    var _getDiagram17 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram17.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.ShowGrid, this.option('showGrid'));
  };

  _proto._updateSnapToGridState = function _updateSnapToGridState() {
    var _getDiagram18 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram18.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.SnapToGrid, this.option('snapToGrid'));
  };

  _proto._updateGridSizeState = function _updateGridSizeState() {
    if (this.option('gridSize.items')) {
      this._updateGridSizeItemsState();

      var gridSize = this.option('gridSize.value');
      if (!gridSize) return;

      var _getDiagram19 = (0, _diagram.getDiagram)(),
          DiagramCommand = _getDiagram19.DiagramCommand;

      this._executeDiagramCommand(DiagramCommand.GridSize, gridSize);
    } else {
      var _gridSize = this.option('gridSize.value') || this.option('gridSize');

      if (!_gridSize) return;

      var _getDiagram20 = (0, _diagram.getDiagram)(),
          _DiagramCommand2 = _getDiagram20.DiagramCommand;

      this._executeDiagramCommand(_DiagramCommand2.GridSize, _gridSize);
    }
  };

  _proto._updateGridSizeItemsState = function _updateGridSizeItemsState() {
    var gridSizeItems = this.option('gridSize.items');
    if (!Array.isArray(gridSizeItems)) return;

    var _getDiagram21 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram21.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.GridSizeItems, gridSizeItems);
  };

  _proto._updateUnitItems = function _updateUnitItems() {
    var _getDiagram22 = (0, _diagram.getDiagram)(),
        DiagramLocalizationService = _getDiagram22.DiagramLocalizationService;

    var items = this._getUnitItems();

    if (this._unitItems !== items) {
      this._unitItems = items;
      DiagramLocalizationService.unitItems = items;
    }
  };

  _proto._getUnitItems = function _getUnitItems() {
    var _getDiagram23 = (0, _diagram.getDiagram)(),
        DiagramUnit = _getDiagram23.DiagramUnit;

    var items = {};
    items[DiagramUnit.In] = _message.default.format('dxDiagram-unitIn');
    items[DiagramUnit.Cm] = _message.default.format('dxDiagram-unitCm');
    items[DiagramUnit.Px] = _message.default.format('dxDiagram-unitPx');
    return items;
  };

  _proto._updateFormatUnitsMethod = function _updateFormatUnitsMethod() {
    var _getDiagram24 = (0, _diagram.getDiagram)(),
        DiagramLocalizationService = _getDiagram24.DiagramLocalizationService;

    DiagramLocalizationService.formatUnit = function (value) {
      return _number.default.format(value);
    };
  };

  _proto._updateViewUnitsState = function _updateViewUnitsState() {
    var _getDiagram25 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram25.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.ViewUnits, this._getDiagramUnitValue(this.option('viewUnits')));
  };

  _proto._updateUnitsState = function _updateUnitsState() {
    var _getDiagram26 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram26.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.Units, this._getDiagramUnitValue(this.option('units')));
  };

  _proto._updatePageSizeState = function _updatePageSizeState() {
    var pageSize = this.option('pageSize');
    if (!pageSize || !pageSize.width || !pageSize.height) return;

    var _getDiagram27 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram27.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.PageSize, pageSize);
  };

  _proto._updatePageSizeItemsState = function _updatePageSizeItemsState() {
    var pageSizeItems = this.option('pageSize.items');
    if (!Array.isArray(pageSizeItems)) return;

    var _getDiagram28 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram28.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.PageSizeItems, pageSizeItems);
  };

  _proto._updatePageOrientationState = function _updatePageOrientationState() {
    var _getDiagram29 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram29.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.PageLandscape, this.option('pageOrientation') === 'landscape');
  };

  _proto._updatePageColorState = function _updatePageColorState() {
    var _getDiagram30 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram30.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.PageColor, this.option('pageColor'));
  };

  _proto._updateShapeTexts = function _updateShapeTexts() {
    var _getDiagram31 = (0, _diagram.getDiagram)(),
        DiagramLocalizationService = _getDiagram31.DiagramLocalizationService;

    var texts = this._getShapeTexts();

    if (this._shapeTexts !== texts) {
      this._shapeTexts = texts;
      DiagramLocalizationService.shapeTexts = texts;
    }
  };

  _proto._getShapeTexts = function _getShapeTexts() {
    var _getDiagram32 = (0, _diagram.getDiagram)(),
        ShapeTypes = _getDiagram32.ShapeTypes;

    var texts = {}; // Standard

    texts[ShapeTypes.Text] = _message.default.format('dxDiagram-shapeText');
    texts[ShapeTypes.Rectangle] = _message.default.format('dxDiagram-shapeRectangle');
    texts[ShapeTypes.Ellipse] = _message.default.format('dxDiagram-shapeEllipse');
    texts[ShapeTypes.Cross] = _message.default.format('dxDiagram-shapeCross');
    texts[ShapeTypes.Triangle] = _message.default.format('dxDiagram-shapeTriangle');
    texts[ShapeTypes.Diamond] = _message.default.format('dxDiagram-shapeDiamond');
    texts[ShapeTypes.Heart] = _message.default.format('dxDiagram-shapeHeart');
    texts[ShapeTypes.Pentagon] = _message.default.format('dxDiagram-shapePentagon');
    texts[ShapeTypes.Hexagon] = _message.default.format('dxDiagram-shapeHexagon');
    texts[ShapeTypes.Octagon] = _message.default.format('dxDiagram-shapeOctagon');
    texts[ShapeTypes.Star] = _message.default.format('dxDiagram-shapeStar');
    texts[ShapeTypes.ArrowLeft] = _message.default.format('dxDiagram-shapeArrowLeft');
    texts[ShapeTypes.ArrowUp] = _message.default.format('dxDiagram-shapeArrowUp');
    texts[ShapeTypes.ArrowRight] = _message.default.format('dxDiagram-shapeArrowRight');
    texts[ShapeTypes.ArrowDown] = _message.default.format('dxDiagram-shapeArrowDown');
    texts[ShapeTypes.ArrowUpDown] = _message.default.format('dxDiagram-shapeArrowUpDown');
    texts[ShapeTypes.ArrowLeftRight] = _message.default.format('dxDiagram-shapeArrowLeftRight'); // Flowchart

    texts[ShapeTypes.Process] = _message.default.format('dxDiagram-shapeProcess');
    texts[ShapeTypes.Decision] = _message.default.format('dxDiagram-shapeDecision');
    texts[ShapeTypes.Terminator] = _message.default.format('dxDiagram-shapeTerminator');
    texts[ShapeTypes.PredefinedProcess] = _message.default.format('dxDiagram-shapePredefinedProcess');
    texts[ShapeTypes.Document] = _message.default.format('dxDiagram-shapeDocument');
    texts[ShapeTypes.MultipleDocuments] = _message.default.format('dxDiagram-shapeMultipleDocuments');
    texts[ShapeTypes.ManualInput] = _message.default.format('dxDiagram-shapeManualInput');
    texts[ShapeTypes.Preparation] = _message.default.format('dxDiagram-shapePreparation');
    texts[ShapeTypes.Data] = _message.default.format('dxDiagram-shapeData');
    texts[ShapeTypes.Database] = _message.default.format('dxDiagram-shapeDatabase');
    texts[ShapeTypes.HardDisk] = _message.default.format('dxDiagram-shapeHardDisk');
    texts[ShapeTypes.InternalStorage] = _message.default.format('dxDiagram-shapeInternalStorage');
    texts[ShapeTypes.PaperTape] = _message.default.format('dxDiagram-shapePaperTape');
    texts[ShapeTypes.ManualOperation] = _message.default.format('dxDiagram-shapeManualOperation');
    texts[ShapeTypes.Delay] = _message.default.format('dxDiagram-shapeDelay');
    texts[ShapeTypes.StoredData] = _message.default.format('dxDiagram-shapeStoredData');
    texts[ShapeTypes.Display] = _message.default.format('dxDiagram-shapeDisplay');
    texts[ShapeTypes.Merge] = _message.default.format('dxDiagram-shapeMerge');
    texts[ShapeTypes.Connector] = _message.default.format('dxDiagram-shapeConnector');
    texts[ShapeTypes.Or] = _message.default.format('dxDiagram-shapeOr');
    texts[ShapeTypes.SummingJunction] = _message.default.format('dxDiagram-shapeSummingJunction'); // Containers

    texts[ShapeTypes.Container] = _message.default.format('dxDiagram-shapeContainerDefaultText');
    texts[ShapeTypes.VerticalContainer] = _message.default.format('dxDiagram-shapeVerticalContainer');
    texts[ShapeTypes.HorizontalContainer] = _message.default.format('dxDiagram-shapeHorizontalContainer'); // Shapes with images

    texts[ShapeTypes.Card] = _message.default.format('dxDiagram-shapeCardDefaultText');
    texts[ShapeTypes.CardWithImageOnLeft] = _message.default.format('dxDiagram-shapeCardWithImageOnLeft');
    texts[ShapeTypes.CardWithImageOnTop] = _message.default.format('dxDiagram-shapeCardWithImageOnTop');
    texts[ShapeTypes.CardWithImageOnRight] = _message.default.format('dxDiagram-shapeCardWithImageOnRight');
    return texts;
  };

  _proto._updateEventSubscriptionMethods = function _updateEventSubscriptionMethods() {
    var _getDiagram33 = (0, _diagram.getDiagram)(),
        RenderHelper = _getDiagram33.RenderHelper;

    RenderHelper.addEventListener = function (element, eventName, handler) {
      _events_engine.default.on(element, eventName, handler);
    };

    RenderHelper.removeEventListener = function (element, eventName, handler) {
      _events_engine.default.off(element, eventName, handler);
    };
  };

  _proto._updateDefaultItemProperties = function _updateDefaultItemProperties() {
    if (this.option('defaultItemProperties.style')) {
      this._diagramInstance.setInitialStyleProperties(this.option('defaultItemProperties.style'));
    }

    if (this.option('defaultItemProperties.textStyle')) {
      this._diagramInstance.setInitialTextStyleProperties(this.option('defaultItemProperties.textStyle'));
    }

    this._diagramInstance.setInitialConnectorProperties({
      lineOption: this._getConnectorLineOption(this.option('defaultItemProperties.connectorLineType')),
      startLineEnding: this._getConnectorLineEnding(this.option('defaultItemProperties.connectorLineStart')),
      endLineEnding: this._getConnectorLineEnding(this.option('defaultItemProperties.connectorLineEnd'))
    });

    this._diagramInstance.applyShapeSizeSettings({
      shapeMinWidth: this.option('defaultItemProperties.shapeMinWidth'),
      shapeMaxWidth: this.option('defaultItemProperties.shapeMaxWidth'),
      shapeMinHeight: this.option('defaultItemProperties.shapeMinHeight'),
      shapeMaxHeight: this.option('defaultItemProperties.shapeMaxHeight')
    });
  };

  _proto._updateEditingSettings = function _updateEditingSettings() {
    this._diagramInstance.applyOperationSettings({
      addShape: this.option('editing.allowAddShape'),
      addShapeFromToolbox: this.option('editing.allowAddShape'),
      deleteShape: this.option('editing.allowDeleteShape'),
      deleteConnector: this.option('editing.allowDeleteConnector'),
      changeConnection: this.option('editing.allowChangeConnection'),
      changeConnectorPoints: this.option('editing.allowChangeConnectorPoints'),
      changeShapeText: this.option('editing.allowChangeShapeText'),
      changeConnectorText: this.option('editing.allowChangeConnectorText'),
      resizeShape: this.option('editing.allowResizeShape'),
      moveShape: this.option('editing.allowMoveShape')
    });
  };

  _proto.fitToContent = function fitToContent() {
    var _getDiagram34 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram34.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.FitToScreen);
  };

  _proto.fitToWidth = function fitToWidth() {
    var _getDiagram35 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram35.DiagramCommand;

    this._executeDiagramCommand(DiagramCommand.FitToWidth);
  };

  _proto.focus = function focus() {
    this._captureFocus();
  };

  _proto.export = function _export() {
    return this._getDiagramData();
  };

  _proto.exportTo = function exportTo(format, callback) {
    var command = this._getDiagramExportToCommand(format);

    this._executeDiagramCommand(command, callback);
  };

  _proto._getDiagramExportToCommand = function _getDiagramExportToCommand(format) {
    var _getDiagram36 = (0, _diagram.getDiagram)(),
        DiagramCommand = _getDiagram36.DiagramCommand;

    switch (format) {
      case 'png':
        return DiagramCommand.ExportPng;

      case 'jpg':
        return DiagramCommand.ExportJpg;

      default:
        return DiagramCommand.ExportSvg;
    }
  };

  _proto.import = function _import(data, updateExistingItemsOnly) {
    this._setDiagramData(data, updateExistingItemsOnly);

    this._raiseDataChangeAction();
  };

  _proto.updateToolbox = function updateToolbox() {
    this._diagramInstance && this._diagramInstance.refreshToolbox();

    if (this._toolbox) {
      this._toolbox.updateTooltips();

      this._toolbox.updateFilter();

      this._toolbox.updateMaxHeight();
    }
  };

  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      readOnly: false,
      zoomLevel: DIAGRAM_DEFAULT_ZOOMLEVEL,
      simpleView: false,
      autoZoomMode: DIAGRAM_DEFAULT_AUTOZOOM_MODE,
      fullScreen: false,
      showGrid: true,
      snapToGrid: true,
      units: DIAGRAM_DEFAULT_UNIT,
      viewUnits: DIAGRAM_DEFAULT_UNIT,
      pageOrientation: DIAGRAM_DEFAULT_PAGE_ORIENTATION,
      pageColor: DIAGRAM_DEFAULT_PAGE_COLOR,
      hasChanges: false,
      nodes: {
        dataSource: null,
        keyExpr: 'id',
        customDataExpr: undefined,
        lockedExpr: undefined,
        styleExpr: undefined,
        textStyleExpr: undefined,
        zIndexExpr: undefined,
        typeExpr: 'type',
        textExpr: 'text',
        imageUrlExpr: undefined,
        parentKeyExpr: undefined,
        itemsExpr: undefined,
        leftExpr: undefined,
        topExpr: undefined,
        widthExpr: undefined,
        heightExpr: undefined,
        containerKeyExpr: 'containerKey',
        containerChildrenExpr: undefined,
        autoLayout: 'auto',
        autoSizeEnabled: true
      },
      edges: {
        dataSource: null,
        keyExpr: 'id',
        customDataExpr: undefined,
        lockedExpr: undefined,
        styleExpr: undefined,
        textStyleExpr: undefined,
        zIndexExpr: undefined,
        fromExpr: 'from',
        fromPointIndexExpr: undefined,
        toExpr: 'to',
        toPointIndexExpr: undefined,
        pointsExpr: undefined,
        textExpr: undefined,
        lineTypeExpr: undefined,
        fromLineEndExpr: undefined,
        toLineEndExpr: undefined
      },
      customShapes: [],
      toolbox: {
        visibility: 'auto',
        shapeIconsPerRow: DIAGRAM_TOOLBOX_SHAPES_PER_ROW,
        showSearch: true
      },
      mainToolbar: {
        visible: false
      },
      historyToolbar: {
        visible: true
      },
      viewToolbar: {
        visible: true
      },
      contextMenu: {
        enabled: true
      },
      contextToolbox: {
        enabled: true,
        shapeIconsPerRow: DIAGRAM_CONTEXT_TOOLBOX_SHAPES_PER_ROW,
        width: DIAGRAM_CONTEXT_TOOLBOX_DEFAULT_WIDTH
      },
      propertiesPanel: {
        visibility: 'auto'
      },
      defaultItemProperties: {
        connectorLineType: 'orthogonal',
        connectorLineStart: 'none',
        connectorLineEnd: 'arrow'
      },
      editing: {
        allowAddShape: true,
        allowDeleteShape: true,
        allowDeleteConnector: true,
        allowChangeConnection: true,
        allowChangeConnectorPoints: true,
        allowChangeShapeText: true,
        allowChangeConnectorText: true,
        allowResizeShape: true,
        allowMoveShape: true
      },
      export: {
        fileName: 'Diagram',
        proxyUrl: undefined
      },
      onItemClick: null,
      onItemDblClick: null,
      onSelectionChanged: null,
      onRequestEditOperation: null,
      onRequestLayoutUpdate: null
      /**
       * @name dxDiagramOptions.accessKey
       * @hidden true
       */

      /**
       * @name dxDiagramOptions.activeStateEnabled
       * @hidden true
       */

      /**
       * @name dxDiagramOptions.focusStateEnabled
       * @hidden true
       */

      /**
       * @name dxDiagramOptions.hint
       * @hidden true
       */

      /**
       * @name dxDiagramOptions.hoverStateEnabled
       * @hidden true
       */

      /**
       * @name dxDiagramOptions.tabIndex
       * @hidden true
       */

      /**
       * @name dxDiagram.registerKeyHandler(key, handler)
       * @hidden true
       */

    });
  };

  _proto._raiseDataChangeAction = function _raiseDataChangeAction() {
    if (this._initialized) {
      this.option('hasChanges', true);
    }
  };

  _proto._raiseEdgeInsertedAction = function _raiseEdgeInsertedAction(data, callback, errorCallback) {
    if (this._edgesOption) {
      this._edgesOption.insert(data, callback, errorCallback);
    }
  };

  _proto._raiseEdgeUpdatedAction = function _raiseEdgeUpdatedAction(key, data, callback, errorCallback) {
    if (this._edgesOption) {
      this._edgesOption.update(key, data, callback, errorCallback);
    }
  };

  _proto._raiseEdgeRemovedAction = function _raiseEdgeRemovedAction(key, data, callback, errorCallback) {
    if (this._edgesOption) {
      this._edgesOption.remove(key, data, callback, errorCallback);
    }
  };

  _proto._raiseNodeInsertedAction = function _raiseNodeInsertedAction(data, callback, errorCallback) {
    if (this._nodesOption) {
      this._nodesOption.insert(data, callback, errorCallback);
    }
  };

  _proto._raiseNodeUpdatedAction = function _raiseNodeUpdatedAction(key, data, callback, errorCallback) {
    if (this._nodesOption) {
      this._nodesOption.update(key, data, callback, errorCallback);
    }
  };

  _proto._raiseNodeRemovedAction = function _raiseNodeRemovedAction(key, data, callback, errorCallback) {
    if (this._nodesOption) {
      this._nodesOption.remove(key, data, callback, errorCallback);
    }
  };

  _proto._raiseToolboxDragStart = function _raiseToolboxDragStart() {
    if (this._toolbox) {
      this._toolbox._raiseToolboxDragStart();

      if (this.isMobileScreenSize()) {
        this._toolbox.hide();

        this._toolboxDragHidden = true;
      }
    }
  };

  _proto._raiseToolboxDragEnd = function _raiseToolboxDragEnd() {
    if (this._toolbox) {
      this._toolbox._raiseToolboxDragEnd();

      if (this._toolboxDragHidden) {
        this._toolbox.show();

        delete this._toolboxDragHidden;
      }
    }
  };

  _proto._raiseTextInputStart = function _raiseTextInputStart() {
    this._textInputStarted = true;

    if (this._propertiesPanel) {
      if (this.isMobileScreenSize() && this._propertiesPanel.isVisible()) {
        this._propertiesPanel.hide();

        this._propertiesPanelTextInputHidden = true;
      }
    }

    if (this._toolbox) {
      if (this.isMobileScreenSize() && this._toolbox.isVisible()) {
        this._toolbox.hide();

        this._toolboxTextInputHidden = true;
      }
    }
  };

  _proto._raiseTextInputEnd = function _raiseTextInputEnd() {
    if (this._propertiesPanel) {
      if (this._propertiesPanelTextInputHidden) {
        this._propertiesPanel.show();

        delete this._propertiesPanelTextInputHidden;
      }
    }

    if (this._toolbox) {
      if (this._toolboxTextInputHidden) {
        this._toolbox.show();

        delete this._toolboxTextInputHidden;
      }
    }

    this._textInputStarted = false;
  };

  _proto._createItemClickAction = function _createItemClickAction() {
    this._itemClickAction = this._createActionByOption('onItemClick');
  };

  _proto._createItemDblClickAction = function _createItemDblClickAction() {
    this._itemDblClickAction = this._createActionByOption('onItemDblClick');
  };

  _proto._createSelectionChangedAction = function _createSelectionChangedAction() {
    this._selectionChangedAction = this._createActionByOption('onSelectionChanged');
  };

  _proto._createRequestEditOperationAction = function _createRequestEditOperationAction() {
    this._requestEditOperationAction = this._createActionByOption('onRequestEditOperation');
  };

  _proto._createRequestLayoutUpdateAction = function _createRequestLayoutUpdateAction() {
    this._requestLayoutUpdateAction = this._createActionByOption('onRequestLayoutUpdate');
  };

  _proto._createCustomCommand = function _createCustomCommand() {
    this._customCommandAction = this._createActionByOption('onCustomCommand');
  };

  _proto._raiseItemClickAction = function _raiseItemClickAction(nativeItem) {
    if (!this._itemClickAction) {
      this._createItemClickAction();
    }

    this._itemClickAction({
      item: this._nativeItemToDiagramItem(nativeItem)
    });
  };

  _proto._raiseItemDblClickAction = function _raiseItemDblClickAction(nativeItem) {
    if (!this._itemDblClickAction) {
      this._createItemDblClickAction();
    }

    this._itemDblClickAction({
      item: this._nativeItemToDiagramItem(nativeItem)
    });
  };

  _proto._raiseSelectionChanged = function _raiseSelectionChanged(nativeItems) {
    if (!this._selectionChangedAction) {
      this._createSelectionChangedAction();
    }

    this._selectionChangedAction({
      items: nativeItems.map(this._nativeItemToDiagramItem.bind(this))
    });
  };

  _proto._raiseRequestEditOperation = function _raiseRequestEditOperation(operation, args) {
    if (!this._requestEditOperationAction) {
      this._createRequestEditOperationAction();
    }

    var eventArgs = this._getRequestEditOperationEventArgs(operation, args);

    this._requestEditOperationAction(eventArgs);

    args.allowed = eventArgs.allowed;
  };

  _proto._getModelOperation = function _getModelOperation(operation) {
    var _getDiagram37 = (0, _diagram.getDiagram)(),
        DiagramModelOperation = _getDiagram37.DiagramModelOperation;

    switch (operation) {
      case DiagramModelOperation.AddShape:
        return 'addShape';

      case DiagramModelOperation.AddShapeFromToolbox:
        return 'addShapeFromToolbox';

      case DiagramModelOperation.DeleteShape:
        return 'deleteShape';

      case DiagramModelOperation.DeleteConnector:
        return 'deleteConnector';

      case DiagramModelOperation.ChangeConnection:
        return 'changeConnection';

      case DiagramModelOperation.ChangeConnectorPoints:
        return 'changeConnectorPoints';

      case DiagramModelOperation.BeforeChangeShapeText:
        return 'beforeChangeShapeText';

      case DiagramModelOperation.ChangeShapeText:
        return 'changeShapeText';

      case DiagramModelOperation.BeforeChangeConnectorText:
        return 'beforeChangeConnectorText';

      case DiagramModelOperation.ChangeConnectorText:
        return 'changeConnectorText';

      case DiagramModelOperation.ResizeShape:
        return 'resizeShape';

      case DiagramModelOperation.MoveShape:
        return 'moveShape';
    }
  };

  _proto._getRequestEditOperationEventArgs = function _getRequestEditOperationEventArgs(operation, args) {
    var _getDiagram38 = (0, _diagram.getDiagram)(),
        DiagramModelOperation = _getDiagram38.DiagramModelOperation,
        ConnectorPosition = _getDiagram38.ConnectorPosition;

    var eventArgs = {
      operation: this._getModelOperation(operation),
      allowed: args.allowed,
      updateUI: args.updateUI,
      // obsolete
      reason: args.updateUI ? 'checkUIElementAvailability' : 'modelModification'
    };

    switch (operation) {
      case DiagramModelOperation.AddShape:
        eventArgs.args = {
          shape: args.shape && this._nativeItemToDiagramItem(args.shape),
          position: args.position && {
            x: args.position.x,
            y: args.position.y
          }
        };
        break;

      case DiagramModelOperation.AddShapeFromToolbox:
        eventArgs.args = {
          shapeType: args.shapeType
        };
        break;

      case DiagramModelOperation.DeleteShape:
        eventArgs.args = {
          shape: args.shape && this._nativeItemToDiagramItem(args.shape)
        };
        break;

      case DiagramModelOperation.DeleteConnector:
        eventArgs.args = {
          connector: args.connector && this._nativeItemToDiagramItem(args.connector)
        };
        break;

      case DiagramModelOperation.ChangeConnection:
        eventArgs.args = {
          newShape: args.shape && this._nativeItemToDiagramItem(args.shape),
          oldShape: args.oldShape && this._nativeItemToDiagramItem(args.oldShape),
          connector: args.connector && this._nativeItemToDiagramItem(args.connector),
          connectionPointIndex: args.connectionPointIndex,
          connectorPosition: args.position === ConnectorPosition.Begin ? 'start' : 'end'
        };
        break;

      case DiagramModelOperation.ChangeConnectorPoints:
        eventArgs.args = {
          connector: args.connector && this._nativeItemToDiagramItem(args.connector),
          newPoints: args.points && args.points.map(function (pt) {
            return {
              x: pt.x,
              y: pt.y
            };
          }),
          oldPoints: args.oldPoints && args.oldPoints.map(function (pt) {
            return {
              x: pt.x,
              y: pt.y
            };
          })
        };
        break;

      case DiagramModelOperation.BeforeChangeShapeText:
        eventArgs.args = {
          shape: args.shape && this._nativeItemToDiagramItem(args.shape)
        };
        break;

      case DiagramModelOperation.ChangeShapeText:
        eventArgs.args = {
          shape: args.shape && this._nativeItemToDiagramItem(args.shape),
          text: args.text
        };
        break;

      case DiagramModelOperation.BeforeChangeConnectorText:
        eventArgs.args = {
          connector: args.connector && this._nativeItemToDiagramItem(args.connector),
          index: args.index
        };
        break;

      case DiagramModelOperation.ChangeConnectorText:
        eventArgs.args = {
          connector: args.connector && this._nativeItemToDiagramItem(args.connector),
          index: args.index,
          text: args.text
        };
        break;

      case DiagramModelOperation.ResizeShape:
        eventArgs.args = {
          shape: args.shape && this._nativeItemToDiagramItem(args.shape),
          newSize: args.size && {
            width: args.size.width,
            height: args.size.height
          },
          oldSize: args.oldSize && {
            width: args.oldSize.width,
            height: args.oldSize.height
          }
        };
        break;

      case DiagramModelOperation.MoveShape:
        eventArgs.args = {
          shape: args.shape && this._nativeItemToDiagramItem(args.shape),
          newPosition: args.position && {
            x: args.position.x,
            y: args.position.y
          },
          oldPosition: args.oldPosition && {
            x: args.oldPosition.x,
            y: args.oldPosition.y
          }
        };
        break;
    }

    return eventArgs;
  };

  _proto._nativeItemToDiagramItem = function _nativeItemToDiagramItem(nativeItem) {
    var _getDiagram39 = (0, _diagram.getDiagram)(),
        NativeShape = _getDiagram39.NativeShape;

    var createMethod = nativeItem instanceof NativeShape ? this._nativeShapeToDiagramShape.bind(this) : this._nativeConnectorToDiagramConnector.bind(this);
    return (0, _extend.extend)({
      id: nativeItem.id,
      key: nativeItem.key,
      dataItem: undefined
    }, createMethod(nativeItem));
  };

  _proto._nativeShapeToDiagramShape = function _nativeShapeToDiagramShape(nativeShape) {
    return {
      dataItem: this._nodesOption && this._nodesOption.findItem(nativeShape.key),
      itemType: 'shape',
      text: nativeShape.text,
      type: nativeShape.type,
      position: {
        x: nativeShape.position.x,
        y: nativeShape.position.y
      },
      size: {
        width: nativeShape.size.width,
        height: nativeShape.size.height
      },
      attachedConnectorIds: nativeShape.attachedConnectorIds,
      containerId: nativeShape.containerId,
      containerChildItemIds: nativeShape.containerChildItemIds,
      containerExpanded: nativeShape.containerExpanded
    };
  };

  _proto._nativeConnectorToDiagramConnector = function _nativeConnectorToDiagramConnector(nativeConnector) {
    return {
      dataItem: this._edgesOption && this._edgesOption.findItem(nativeConnector.key),
      itemType: 'connector',
      texts: nativeConnector.texts,
      fromKey: nativeConnector.fromKey,
      toKey: nativeConnector.toKey,
      fromId: nativeConnector.fromId,
      fromPointIndex: nativeConnector.fromPointIndex,
      toId: nativeConnector.toId,
      toPointIndex: nativeConnector.toPointIndex,
      points: nativeConnector.points.map(function (pt) {
        return {
          x: pt.x,
          y: pt.y
        };
      })
    };
  };

  _proto.getItemByKey = function getItemByKey(key) {
    var nativeItem = this._diagramInstance && this._diagramInstance.getNativeItemByDataKey(key);

    return nativeItem && this._nativeItemToDiagramItem(nativeItem);
  };

  _proto.getItemById = function getItemById(id) {
    var nativeItem = this._diagramInstance && this._diagramInstance.getNativeItemByKey(id);

    return nativeItem && this._nativeItemToDiagramItem(nativeItem);
  };

  _proto.getItems = function getItems() {
    var _this14 = this;

    return this._diagramInstance.getNativeItems().map(function (nativeItem) {
      return nativeItem && _this14._nativeItemToDiagramItem(nativeItem);
    });
  };

  _proto.getSelectedItems = function getSelectedItems() {
    var _this15 = this;

    return this._diagramInstance.getNativeSelectedItems().map(function (nativeItem) {
      return nativeItem && _this15._nativeItemToDiagramItem(nativeItem);
    });
  };

  _proto.setSelectedItems = function setSelectedItems(items) {
    return this._diagramInstance.setSelectedItems(items.map(function (item) {
      return item.id;
    }));
  };

  _proto.scrollToItem = function scrollToItem(item) {
    return this._diagramInstance.scrollToItems([item.id]);
  };

  _proto._invalidateContextMenuCommands = function _invalidateContextMenuCommands() {
    if (this._contextMenu) {
      this._contextMenu.option({
        commands: this.option('contextMenu.commands')
      });
    }
  };

  _proto._invalidateMainToolbarCommands = function _invalidateMainToolbarCommands() {
    if (this._mainToolbar) {
      this._mainToolbar.option({
        commands: this.option('mainToolbar.commands')
      });
    }
  };

  _proto._invalidateHistoryToolbarCommands = function _invalidateHistoryToolbarCommands() {
    if (this._historyToolbar) {
      this._historyToolbar.option({
        commands: this.option('historyToolbar.commands')
      });
    }
  };

  _proto._invalidateViewToolbarCommands = function _invalidateViewToolbarCommands() {
    if (this._viewToolbar) {
      this._viewToolbar.option({
        commands: this.option('viewToolbar.commands')
      });
    }
  };

  _proto._invalidateToolboxGroups = function _invalidateToolboxGroups() {
    if (this._toolbox) {
      this._toolbox.option({
        toolboxGroups: this._getToolboxGroups()
      });
    }
  };

  _proto._optionChanged = function _optionChanged(args) {
    if (this.optionsUpdateBar.isUpdateLocked()) return;
    this.optionsUpdateBar.beginUpdate();

    try {
      this._optionChangedCore(args);
    } finally {
      this.optionsUpdateBar.endUpdate();
    }
  };

  _proto._optionChangedCore = function _optionChangedCore(args) {
    var _this16 = this;

    switch (args.name) {
      case 'readOnly':
      case 'disabled':
        this._updateReadOnlyState();

        this._invalidate();

        break;

      case 'zoomLevel':
        if (args.fullName === 'zoomLevel' || args.fullName === 'zoomLevel.items' || args.fullName === 'zoomLevel.value') {
          this._updateZoomLevelState();
        }

        break;

      case 'autoZoomMode':
        this._updateAutoZoomState();

        break;

      case 'simpleView':
        this._updateSimpleViewState();

        break;

      case 'useNativeScrolling':
        this._invalidate();

        break;

      case 'fullScreen':
        this._updateFullscreenState();

        break;

      case 'showGrid':
        this._updateShowGridState();

        break;

      case 'snapToGrid':
        this._updateSnapToGridState();

        break;

      case 'gridSize':
        if (args.fullName === 'gridSize' || args.fullName === 'gridSize.items' || args.fullName === 'gridSize.value') {
          this._updateGridSizeState();
        }

        break;

      case 'viewUnits':
        this._updateViewUnitsState();

        break;

      case 'units':
        this._updateUnitsState();

        break;

      case 'pageSize':
        if (args.fullName === 'pageSize' || args.fullName === 'pageSize.items') {
          this._updatePageSizeItemsState();
        }

        if (args.fullName === 'pageSize' || args.fullName === 'pageSize.width' || args.fullName === 'pageSize.height') {
          this._updatePageSizeState();
        }

        break;

      case 'pageOrientation':
        this._updatePageOrientationState();

        break;

      case 'pageColor':
        this._updatePageColorState();

        break;

      case 'nodes':
        if (args.fullName.indexOf('nodes.autoLayout') === 0) {
          this._refreshDataSources();
        } else {
          this._refreshNodesDataSource();
        }

        break;

      case 'edges':
        this._refreshEdgesDataSource();

        break;

      case 'customShapes':
        if (args.fullName !== args.name) {
          // customShapes[i].<property>
          this._updateAllCustomShapes();
        } else {
          this._updateCustomShapes(args.value, args.previousValue);
        }

        this._invalidate();

        break;

      case 'contextMenu':
        if (args.fullName === 'contextMenu.commands') {
          this._invalidateContextMenuCommands();
        } else {
          this._invalidate();
        }

        break;

      case 'contextToolbox':
        this._invalidate();

        break;

      case 'propertiesPanel':
        this._invalidate();

        break;

      case 'toolbox':
        if (args.fullName === 'toolbox.groups') {
          this._invalidateToolboxGroups();
        } else {
          this._invalidate();
        }

        break;

      case 'mainToolbar':
        if (args.fullName === 'mainToolbar.commands') {
          this._invalidateMainToolbarCommands();
        } else {
          this._invalidate();
        }

        break;

      case 'historyToolbar':
        if (args.fullName === 'historyToolbar.commands') {
          this._invalidateHistoryToolbarCommands();
        } else {
          this._invalidate();
        }

        break;

      case 'viewToolbar':
        if (args.fullName === 'viewToolbar.commands') {
          this._invalidateViewToolbarCommands();
        } else {
          this._invalidate();
        }

        break;

      case 'onItemClick':
        this._createItemClickAction();

        break;

      case 'onItemDblClick':
        this._createItemDblClickAction();

        break;

      case 'onSelectionChanged':
        this._createSelectionChangedAction();

        break;

      case 'onRequestEditOperation':
        this._createRequestEditOperationAction();

        break;

      case 'onRequestLayoutUpdate':
        this._createRequestLayoutUpdateAction();

        break;

      case 'onCustomCommand':
        this._createCustomCommand();

        break;

      case 'defaultItemProperties':
        this._updateDefaultItemProperties();

        break;

      case 'editing':
        this._updateEditingSettings();

        break;

      case 'export':
        this._toolbars.forEach(function (toolbar) {
          toolbar.option('export', _this16.option('export'));
        });

        if (this._contextMenu) {
          this._contextMenu.option('export', this.option('export'));
        }

        break;

      case 'hasChanges':
        break;

      default:
        _Widget.prototype._optionChanged.call(this, args);

    }
  };

  return Diagram;
}(_ui.default);

(0, _component_registrator.default)('dxDiagram', Diagram);
var _default = Diagram;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
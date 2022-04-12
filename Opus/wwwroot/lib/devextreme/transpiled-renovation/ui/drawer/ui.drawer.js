"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _type = require("../../core/utils/type");

var _element = require("../../core/element");

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _extend = require("../../core/utils/extend");

var _position = require("../../core/utils/position");

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _empty_template = require("../../core/templates/empty_template");

var _window = require("../../core/utils/window");

var _uiDrawerRenderingStrategy = _interopRequireDefault(require("./ui.drawer.rendering.strategy.push"));

var _uiDrawerRenderingStrategy2 = _interopRequireDefault(require("./ui.drawer.rendering.strategy.shrink"));

var _uiDrawerRenderingStrategy3 = _interopRequireDefault(require("./ui.drawer.rendering.strategy.overlap"));

var _uiDrawer = require("./ui.drawer.animation");

var _click = require("../../events/click");

var _fx = _interopRequireDefault(require("../../animation/fx"));

var _deferred = require("../../core/utils/deferred");

var _visibility_change = require("../../events/visibility_change");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// STYLE drawer
var DRAWER_CLASS = 'dx-drawer';
var DRAWER_WRAPPER_CLASS = 'dx-drawer-wrapper';
var DRAWER_PANEL_CONTENT_CLASS = 'dx-drawer-panel-content';
var DRAWER_VIEW_CONTENT_CLASS = 'dx-drawer-content';
var DRAWER_SHADER_CLASS = 'dx-drawer-shader';
var INVISIBLE_STATE_CLASS = 'dx-state-invisible';
var OPENED_STATE_CLASS = 'dx-drawer-opened';
var ANONYMOUS_TEMPLATE_NAME = 'content';
var PANEL_TEMPLATE_NAME = 'panel';

var Drawer = _ui.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      position: 'left',
      opened: false,
      minSize: null,
      maxSize: null,
      shading: false,
      template: PANEL_TEMPLATE_NAME,
      openedStateMode: 'shrink',
      revealMode: 'slide',
      animationEnabled: true,
      animationDuration: 400,
      closeOnOutsideClick: false,

      /**
      * @name dxDrawerOptions.contentTemplate
      * @type_function_param1 contentElement:DxElement
      * @type template|function
      * @hidden
      * @default "content"
      */
      contentTemplate: ANONYMOUS_TEMPLATE_NAME,
      target: undefined
      /**
      * @name dxDrawerOptions.onContentReady
      * @hidden true
      * @action
      */

      /**
      * @name dxDrawerOptions.focusStateEnabled
      * @hidden
      */

      /**
      * @name dxDrawerOptions.accessKey
      * @hidden
      */

      /**
      * @name dxDrawerOptions.tabIndex
      * @hidden
      */

    });
  },
  _setDeprecatedOptions: function _setDeprecatedOptions() {
    this.callBase();
    (0, _extend.extend)(this._deprecatedOptions, {
      'target': {
        since: '20.1',
        message: 'Functionality associated with this option is not intended for the Drawer widget.'
      }
    });
  },
  _init: function _init() {
    this.callBase();

    this._initStrategy();

    this.$element().addClass(DRAWER_CLASS);
    this._whenAnimationCompleted = undefined;
    this._whenPanelContentRendered = undefined;
    this._whenPanelContentRefreshed = undefined;
    this._$wrapper = (0, _renderer.default)('<div>').addClass(DRAWER_WRAPPER_CLASS);
    this._$viewContentWrapper = (0, _renderer.default)('<div>').addClass(DRAWER_VIEW_CONTENT_CLASS);

    this._$wrapper.append(this._$viewContentWrapper);

    this.$element().append(this._$wrapper);
  },
  _initStrategy: function _initStrategy() {
    switch (this.option('openedStateMode')) {
      case 'push':
        this._strategy = new _uiDrawerRenderingStrategy.default(this);
        break;

      case 'shrink':
        this._strategy = new _uiDrawerRenderingStrategy2.default(this);
        break;

      case 'overlap':
        this._strategy = new _uiDrawerRenderingStrategy3.default(this);
        break;

      default:
        this._strategy = new _uiDrawerRenderingStrategy.default(this);
    }
  },
  _getAnonymousTemplateName: function _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },
  _initTemplates: function _initTemplates() {
    var defaultTemplates = {};
    defaultTemplates[PANEL_TEMPLATE_NAME] = new _empty_template.EmptyTemplate();
    defaultTemplates[ANONYMOUS_TEMPLATE_NAME] = new _empty_template.EmptyTemplate();

    this._templateManager.addDefaultTemplates(defaultTemplates);

    this.callBase();
  },
  _viewContentWrapperClickHandler: function _viewContentWrapperClickHandler(e) {
    var closeOnOutsideClick = this.option('closeOnOutsideClick');

    if ((0, _type.isFunction)(closeOnOutsideClick)) {
      closeOnOutsideClick = closeOnOutsideClick(e);
    }

    if (closeOnOutsideClick && this.option('opened')) {
      this.stopAnimations();

      if (this.option('shading')) {
        e.preventDefault();
      }

      this.hide();
    }
  },
  _initMarkup: function _initMarkup() {
    this.callBase();

    this._toggleOpenedStateClass(this.option('opened'));

    this._renderPanelContentWrapper();

    this._refreshOpenedStateModeClass();

    this._refreshRevealModeClass();

    this._renderShader();

    this._whenPanelContentRendered = new _deferred.Deferred();

    this._strategy.renderPanelContent(this._whenPanelContentRendered);

    this._strategy.onPanelContentRendered();

    this._renderViewContent();

    _events_engine.default.off(this._$viewContentWrapper, _click.name);

    _events_engine.default.on(this._$viewContentWrapper, _click.name, this._viewContentWrapperClickHandler.bind(this));

    this._refreshPositionClass();

    this._refreshWrapperChildrenOrder();
  },
  _render: function _render() {
    var _this = this;

    this._initMinMaxSize();

    this.callBase();

    this._whenPanelContentRendered.always(function () {
      ///#DEBUG
      if (_this.option('__debugWhenPanelContentRendered')) {
        _this.option('__debugWhenPanelContentRendered')({
          drawer: _this
        });
      } ///#ENDDEBUG


      _this._initMinMaxSize();

      _this._strategy.refreshPanelElementSize(_this.option('revealMode') === 'slide' || !_this.isHorizontalDirection());

      _this._renderPosition(_this.option('opened'), true);

      _this._removePanelManualPosition();
    });
  },
  _removePanelManualPosition: function _removePanelManualPosition() {
    if (this._$panelContentWrapper.attr('manualposition')) {
      this._$panelContentWrapper.removeAttr('manualPosition');

      this._$panelContentWrapper.css({
        position: '',
        top: '',
        left: '',
        right: '',
        bottom: ''
      });
    }
  },
  _renderPanelContentWrapper: function _renderPanelContentWrapper() {
    this._$panelContentWrapper = (0, _renderer.default)('<div>').addClass(DRAWER_PANEL_CONTENT_CLASS);
    var position = this.calcTargetPosition();

    if (this.option('openedStateMode') === 'push' && ['top', 'bottom'].indexOf(position) > -1) {
      this._$panelContentWrapper.addClass(DRAWER_PANEL_CONTENT_CLASS + '-push-top-or-bottom');
    }

    if (this.option('openedStateMode') !== 'overlap' && !this.option('opened') && !this.option('minSize')) {
      this._$panelContentWrapper.attr('manualposition', true);

      this._$panelContentWrapper.css({
        position: 'absolute',
        top: '-10000px',
        left: '-10000px',
        right: 'auto',
        bottom: 'auto'
      });
    }

    this._$wrapper.append(this._$panelContentWrapper);
  },
  _refreshOpenedStateModeClass: function _refreshOpenedStateModeClass(prevOpenedStateMode) {
    if (prevOpenedStateMode) {
      this.$element().removeClass(DRAWER_CLASS + '-' + prevOpenedStateMode);
    }

    this.$element().addClass(DRAWER_CLASS + '-' + this.option('openedStateMode'));
  },
  _refreshPositionClass: function _refreshPositionClass(prevPosition) {
    if (prevPosition) {
      this.$element().removeClass(DRAWER_CLASS + '-' + prevPosition);
    }

    this.$element().addClass(DRAWER_CLASS + '-' + this.calcTargetPosition());
  },
  _refreshWrapperChildrenOrder: function _refreshWrapperChildrenOrder() {
    var position = this.calcTargetPosition();

    if (this._strategy.isViewContentFirst(position, this.option('rtlEnabled'))) {
      this._$wrapper.prepend(this._$viewContentWrapper);
    } else {
      this._$wrapper.prepend(this._$panelContentWrapper);
    }
  },
  _refreshRevealModeClass: function _refreshRevealModeClass(prevRevealMode) {
    if (prevRevealMode) {
      this.$element().removeClass(DRAWER_CLASS + '-' + prevRevealMode);
    }

    this.$element().addClass(DRAWER_CLASS + '-' + this.option('revealMode'));
  },
  _renderViewContent: function _renderViewContent() {
    var contentTemplateOption = this.option('contentTemplate');

    var contentTemplate = this._getTemplate(contentTemplateOption);

    if (contentTemplate) {
      var $viewTemplate = contentTemplate.render({
        container: this.viewContent(),
        noModel: true,
        transclude: this._templateManager.anonymousTemplateName === contentTemplateOption
      });

      if ($viewTemplate.hasClass('ng-scope')) {
        // T864419
        (0, _renderer.default)(this._$viewContentWrapper).children().not(".".concat(DRAWER_SHADER_CLASS)).replaceWith($viewTemplate);
      }
    }
  },
  _renderShader: function _renderShader() {
    this._$shader = this._$shader || (0, _renderer.default)('<div>').addClass(DRAWER_SHADER_CLASS);

    this._$shader.appendTo(this.viewContent());

    this._toggleShaderVisibility(this.option('opened'));
  },
  _initSize: function _initSize() {
    // TODO: keep for ui.file_manager.adaptivity.js
    this._initMinMaxSize();
  },
  _initMinMaxSize: function _initMinMaxSize() {
    var realPanelSize = this.isHorizontalDirection() ? this.getRealPanelWidth() : this.getRealPanelHeight();
    this._maxSize = this.option('maxSize') || realPanelSize;
    this._minSize = this.option('minSize') || 0;
  },
  calcTargetPosition: function calcTargetPosition() {
    var position = this.option('position');
    var rtl = this.option('rtlEnabled');
    var result = position;

    if (position === 'before') {
      result = rtl ? 'right' : 'left';
    } else if (position === 'after') {
      result = rtl ? 'left' : 'right';
    }

    return result;
  },
  getOverlayTarget: function getOverlayTarget() {
    return this._options.silent('target') || this._$wrapper;
  },
  getOverlay: function getOverlay() {
    return this._overlay;
  },
  getMaxSize: function getMaxSize() {
    return this._maxSize;
  },
  getMinSize: function getMinSize() {
    return this._minSize;
  },
  getRealPanelWidth: function getRealPanelWidth() {
    if ((0, _window.hasWindow)()) {
      if ((0, _type.isDefined)(this.option('templateSize'))) {
        return this.option('templateSize'); // number is expected
      } else {
        return (0, _position.getBoundingRect)(this._getPanelTemplateElement()).width;
      }
    } else {
      return 0;
    }
  },
  getRealPanelHeight: function getRealPanelHeight() {
    if ((0, _window.hasWindow)()) {
      if ((0, _type.isDefined)(this.option('templateSize'))) {
        return this.option('templateSize'); // number is expected
      } else {
        return (0, _position.getBoundingRect)(this._getPanelTemplateElement()).height;
      }
    } else {
      return 0;
    }
  },
  _getPanelTemplateElement: function _getPanelTemplateElement() {
    var $panelContent = this._strategy.getPanelContent();

    var $result = $panelContent;

    if ($panelContent.children().length) {
      $result = $panelContent.children().eq(0);

      if ($panelContent.hasClass('dx-overlay-content') && $result.hasClass('dx-template-wrapper') && $result.children().length) {
        // T948509, T956751
        $result = $result.children().eq(0);
      }
    }

    return $result.get(0);
  },
  getElementHeight: function getElementHeight($element) {
    var $children = $element.children();
    return $children.length ? (0, _position.getBoundingRect)($children.eq(0).get(0)).height : (0, _position.getBoundingRect)($element.get(0)).height;
  },
  isHorizontalDirection: function isHorizontalDirection() {
    var position = this.calcTargetPosition();
    return position === 'left' || position === 'right';
  },
  stopAnimations: function stopAnimations(jumpToEnd) {
    _fx.default.stop(this._$shader, jumpToEnd);

    _fx.default.stop((0, _renderer.default)(this.content()), jumpToEnd);

    _fx.default.stop((0, _renderer.default)(this.viewContent()), jumpToEnd);

    var overlay = this.getOverlay();

    if (overlay) {
      _fx.default.stop((0, _renderer.default)(overlay.$content()), jumpToEnd);
    }
  },
  setZIndex: function setZIndex(zIndex) {
    this._$shader.css('zIndex', zIndex - 1);

    this._$panelContentWrapper.css('zIndex', zIndex);
  },
  resizeContent: function resizeContent() {
    // TODO: keep for ui.file_manager.adaptivity.js
    this.resizeViewContent;
  },
  resizeViewContent: function resizeViewContent() {
    (0, _visibility_change.triggerResizeEvent)(this.viewContent());
  },
  _isInvertedPosition: function _isInvertedPosition() {
    var position = this.calcTargetPosition();
    return position === 'right' || position === 'bottom';
  },
  _renderPosition: function _renderPosition(isDrawerOpened, disableAnimation, jumpToEnd) {
    this.stopAnimations(jumpToEnd);

    if (!(0, _window.hasWindow)()) {
      return;
    } // Clear possible settings from strategies:


    (0, _renderer.default)(this.viewContent()).css('paddingLeft', 0);
    (0, _renderer.default)(this.viewContent()).css('paddingRight', 0);
    (0, _renderer.default)(this.viewContent()).css('paddingTop', 0);
    (0, _renderer.default)(this.viewContent()).css('paddingBottom', 0);
    var animationEnabled = this.option('animationEnabled');

    if (disableAnimation === true) {
      animationEnabled = false;
    }

    if (isDrawerOpened) {
      this._toggleShaderVisibility(isDrawerOpened);
    }

    this._strategy.renderPosition(animationEnabled, this.option('animationDuration'));
  },
  _animationCompleteHandler: function _animationCompleteHandler() {
    this.resizeViewContent();

    if (this._whenAnimationCompleted) {
      this._whenAnimationCompleted.resolve();
    }
  },
  _getPositionCorrection: function _getPositionCorrection() {
    return this._isInvertedPosition() ? -1 : 1;
  },
  _dispose: function _dispose() {
    _uiDrawer.animation.complete((0, _renderer.default)(this.viewContent()));

    this.callBase();
  },
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      this._dimensionChanged();
    }
  },
  _dimensionChanged: function _dimensionChanged() {
    this._initMinMaxSize();

    this._strategy.refreshPanelElementSize(this.option('revealMode') === 'slide');

    this._renderPosition(this.option('opened'), true);
  },
  _toggleShaderVisibility: function _toggleShaderVisibility(visible) {
    if (this.option('shading')) {
      this._$shader.toggleClass(INVISIBLE_STATE_CLASS, !visible);

      this._$shader.css('visibility', visible ? 'visible' : 'hidden');
    } else {
      this._$shader.toggleClass(INVISIBLE_STATE_CLASS, true);
    }
  },
  _toggleOpenedStateClass: function _toggleOpenedStateClass(opened) {
    this.$element().toggleClass(OPENED_STATE_CLASS, opened);
  },
  _refreshPanel: function _refreshPanel() {
    var _this2 = this;

    (0, _renderer.default)(this.viewContent()).css('left', 0); // can affect animation

    (0, _renderer.default)(this.viewContent()).css('transform', 'translate(0px, 0px)'); // can affect animation

    (0, _renderer.default)(this.viewContent()).removeClass('dx-theme-background-color');

    this._removePanelContentWrapper();

    this._removeOverlay();

    this._renderPanelContentWrapper();

    this._refreshWrapperChildrenOrder();

    this._whenPanelContentRefreshed = new _deferred.Deferred();

    this._strategy.renderPanelContent(this._whenPanelContentRefreshed);

    this._strategy.onPanelContentRendered();

    if ((0, _window.hasWindow)()) {
      this._whenPanelContentRefreshed.always(function () {
        _this2._strategy.refreshPanelElementSize(_this2.option('revealMode') === 'slide');

        _this2._renderPosition(_this2.option('opened'), true, true);

        _this2._removePanelManualPosition();
      });
    }
  },
  _clean: function _clean() {
    this._cleanFocusState();

    this._removePanelContentWrapper();

    this._removeOverlay();
  },
  _removePanelContentWrapper: function _removePanelContentWrapper() {
    if (this._$panelContentWrapper) {
      this._$panelContentWrapper.remove();
    }
  },
  _removeOverlay: function _removeOverlay() {
    if (this._overlay) {
      this._overlay.dispose();

      delete this._overlay;
      delete this._$panelContentWrapper; // TODO: move to _removePanelContentWrapper?
    }
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'width':
        this.callBase(args);

        this._dimensionChanged();

        break;

      case 'opened':
        this._renderPosition(this.option('opened'));

        this._toggleOpenedStateClass(args.value);

        break;

      case 'position':
        this._refreshPositionClass(args.previousValue);

        this._refreshWrapperChildrenOrder();

        this._invalidate();

        break;

      case 'contentTemplate':
      case 'template':
        this._invalidate();

        break;

      case 'openedStateMode':
      case 'target':
        this._initStrategy();

        this._refreshOpenedStateModeClass(args.previousValue);

        this._refreshPanel();

        break;

      case 'minSize':
      case 'maxSize':
        this._initMinMaxSize();

        this._renderPosition(this.option('opened'), true);

        break;

      case 'revealMode':
        this._refreshRevealModeClass(args.previousValue);

        this._refreshPanel();

        break;

      case 'shading':
        this._toggleShaderVisibility(this.option('opened'));

        break;

      case 'animationEnabled':
      case 'animationDuration':
      case 'closeOnOutsideClick':
        break;

      default:
        this.callBase(args);
    }
  },
  content: function content() {
    return (0, _element.getPublicElement)(this._$panelContentWrapper);
  },

  /**
  * @name dxDrawer.viewContent
  * @publicName viewContent()
  * @return DxElement
  * @hidden
  */
  viewContent: function viewContent() {
    return (0, _element.getPublicElement)(this._$viewContentWrapper);
  },
  show: function show() {
    return this.toggle(true);
  },
  hide: function hide() {
    return this.toggle(false);
  },
  toggle: function toggle(opened) {
    var targetOpened = opened === undefined ? !this.option('opened') : opened;
    this._whenAnimationCompleted = new _deferred.Deferred();
    this.option('opened', targetOpened);
    return this._whenAnimationCompleted.promise();
  }
  /**
  * @name dxDrawer.registerKeyHandler
  * @publicName registerKeyHandler(key, handler)
  * @hidden
  */

  /**
  * @name dxDrawer.focus
  * @publicName focus()
  * @hidden
  */

});

(0, _component_registrator.default)('dxDrawer', Drawer);
var _default = Drawer;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
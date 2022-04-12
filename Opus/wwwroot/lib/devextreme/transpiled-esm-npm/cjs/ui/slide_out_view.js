"use strict";

exports.default = void 0;

var _size = require("../core/utils/size");

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));

var _common = require("../core/utils/common");

var _click = require("../events/click");

var _translator = require("../animation/translator");

var _element = require("../core/element");

var _hide_callback = require("../mobile/hide_callback");

var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));

var _extend = require("../core/utils/extend");

var _ui = _interopRequireDefault(require("./widget/ui.widget"));

var _swipeable = _interopRequireDefault(require("../events/gesture/swipeable"));

var _empty_template = require("../core/templates/empty_template");

var _deferred = require("../core/utils/deferred");

var _window = require("../core/utils/window");

var _uiSlide_out_view = require("./slide_out_view/ui.slide_out_view.animation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// STYLE slideOutView
var SLIDEOUTVIEW_CLASS = 'dx-slideoutview';
var SLIDEOUTVIEW_WRAPPER_CLASS = 'dx-slideoutview-wrapper';
var SLIDEOUTVIEW_MENU_CONTENT_CLASS = 'dx-slideoutview-menu-content';
var SLIDEOUTVIEW_CONTENT_CLASS = 'dx-slideoutview-content';
var SLIDEOUTVIEW_SHIELD_CLASS = 'dx-slideoutview-shield';
var INVISIBLE_STATE_CLASS = 'dx-state-invisible';
var ANONYMOUS_TEMPLATE_NAME = 'content';

var SlideOutView = _ui.default.inherit({
  ctor: function ctor(element, options) {
    this.callBase(element, options);

    this._logDeprecatedComponentWarning('20.1', 'dxDrawer');
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      menuPosition: 'normal',
      menuVisible: false,
      swipeEnabled: true,
      menuTemplate: 'menu',
      contentTemplate: 'content',

      /**
      * @name dxSlideOutViewOptions.contentOffset
      * @hidden
      */
      contentOffset: 45
      /**
      * @name dxSlideOutViewOptions.onContentReady
      * @hidden true
      * @action
      */

      /**
      * @name dxSlideOutViewOptions.focusStateEnabled
      * @hidden
      */

      /**
      * @name dxSlideOutViewOptions.accessKey
      * @hidden
      */

      /**
      * @name dxSlideOutViewOptions.tabIndex
      * @hidden
      */

    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: {
        android: true
      },
      options: {
        contentOffset: 54
      }
    }, {
      device: function device(_device) {
        return _device.platform === 'generic' && _device.deviceType !== 'desktop';
      },
      options: {
        contentOffset: 56
      }
    }, {
      device: {
        win: true,
        phone: false
      },
      options: {
        contentOffset: 76
      }
    }]);
  },
  _init: function _init() {
    this.callBase();
    this.$element().addClass(SLIDEOUTVIEW_CLASS);
    this._whenAnimationComplete = undefined;
    this._whenMenuRendered = undefined;

    this._initHideTopOverlayHandler();
  },
  _initHideTopOverlayHandler: function _initHideTopOverlayHandler() {
    this._hideMenuHandler = this.hideMenu.bind(this);
  },
  _getAnonymousTemplateName: function _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },
  _initTemplates: function _initTemplates() {
    this._templateManager.addDefaultTemplates({
      menu: new _empty_template.EmptyTemplate(),
      content: new _empty_template.EmptyTemplate()
    });

    this.callBase();
  },
  _initMarkup: function _initMarkup() {
    var _this = this;

    this.callBase();

    this._renderMarkup();

    this._whenMenuRendered = new _deferred.Deferred();

    var menuTemplate = this._getTemplate(this.option('menuTemplate'));

    menuTemplate && menuTemplate.render({
      container: this.menuContent(),
      onRendered: function onRendered() {
        _this._whenMenuRendered.resolve();
      }
    });
    var contentTemplateOption = this.option('contentTemplate');

    var contentTemplate = this._getTemplate(contentTemplateOption);

    var transclude = this._templateManager.anonymousTemplateName === contentTemplateOption;
    contentTemplate && contentTemplate.render({
      container: this.content(),
      noModel: true,
      transclude: transclude
    });

    this._renderShield();

    this._toggleMenuPositionClass();
  },
  _render: function _render() {
    var _this2 = this;

    this.callBase();

    this._whenMenuRendered.always(function () {
      _this2._initSwipeHandlers();

      _this2._dimensionChanged();
    });
  },
  _renderMarkup: function _renderMarkup() {
    var $wrapper = (0, _renderer.default)('<div>').addClass(SLIDEOUTVIEW_WRAPPER_CLASS);
    this._$menu = (0, _renderer.default)('<div>').addClass(SLIDEOUTVIEW_MENU_CONTENT_CLASS);
    this._$container = (0, _renderer.default)('<div>').addClass(SLIDEOUTVIEW_CONTENT_CLASS);
    $wrapper.append(this._$menu);
    $wrapper.append(this._$container);
    this.$element().append($wrapper); // NOTE: B251455

    _events_engine.default.on(this._$container, 'MSPointerDown', _common.noop);
  },
  _renderShield: function _renderShield() {
    this._$shield = this._$shield || (0, _renderer.default)('<div>').addClass(SLIDEOUTVIEW_SHIELD_CLASS);

    this._$shield.appendTo(this.content());

    _events_engine.default.off(this._$shield, _click.name);

    _events_engine.default.on(this._$shield, _click.name, this.hideMenu.bind(this));

    this._toggleShieldVisibility(this.option('menuVisible'));
  },
  _initSwipeHandlers: function _initSwipeHandlers() {
    this._createComponent((0, _renderer.default)(this.content()), _swipeable.default, {
      disabled: !this.option('swipeEnabled'),
      elastic: false,
      itemSizeFunc: this._getMenuWidth.bind(this),
      onStart: this._swipeStartHandler.bind(this),
      onUpdated: this._swipeUpdateHandler.bind(this),
      onEnd: this._swipeEndHandler.bind(this)
    });
  },
  _isRightMenuPosition: function _isRightMenuPosition() {
    var invertedPosition = this.option('menuPosition') === 'inverted';
    var rtl = this.option('rtlEnabled');
    return rtl && !invertedPosition || !rtl && invertedPosition;
  },
  _swipeStartHandler: function _swipeStartHandler(e) {
    _uiSlide_out_view.animation.complete((0, _renderer.default)(this.content()));

    var event = e.event;
    var menuVisible = this.option('menuVisible');

    var rtl = this._isRightMenuPosition();

    event.maxLeftOffset = +(rtl ? !menuVisible : menuVisible);
    event.maxRightOffset = +(rtl ? menuVisible : !menuVisible);

    this._toggleShieldVisibility(true);
  },
  _swipeUpdateHandler: function _swipeUpdateHandler(e) {
    var event = e.event;
    var offset = this.option('menuVisible') ? event.offset + 1 * this._getRTLSignCorrection() : event.offset;
    offset *= this._getRTLSignCorrection();

    this._renderPosition(offset, false);
  },
  _swipeEndHandler: function _swipeEndHandler(e) {
    var targetOffset = e.event.targetOffset * this._getRTLSignCorrection() + this.option('menuVisible');
    var menuVisible = targetOffset !== 0;

    if (this.option('menuVisible') === menuVisible) {
      this._renderPosition(this.option('menuVisible'), true);
    } else {
      this.option('menuVisible', menuVisible);
    }
  },
  _toggleMenuPositionClass: function _toggleMenuPositionClass() {
    var left = SLIDEOUTVIEW_CLASS + '-left';
    var right = SLIDEOUTVIEW_CLASS + '-right';
    var menuPosition = this._isRightMenuPosition() ? 'right' : 'left';

    this._$menu.removeClass(left + ' ' + right);

    this._$menu.addClass(SLIDEOUTVIEW_CLASS + '-' + menuPosition);
  },
  _renderPosition: function _renderPosition(offset, animate) {
    if (!(0, _window.hasWindow)()) return;

    var pos = this._calculatePixelOffset(offset) * this._getRTLSignCorrection();

    this._toggleHideMenuCallback(offset);

    if (animate) {
      this._toggleShieldVisibility(true);

      _uiSlide_out_view.animation.moveTo((0, _renderer.default)(this.content()), pos, this._animationCompleteHandler.bind(this));
    } else {
      (0, _translator.move)((0, _renderer.default)(this.content()), {
        left: pos
      });
    }
  },
  _calculatePixelOffset: function _calculatePixelOffset(offset) {
    offset = offset || 0;
    return offset * this._getMenuWidth();
  },
  _getMenuWidth: function _getMenuWidth() {
    if (!this._menuWidth) {
      var maxMenuWidth = (0, _size.getWidth)(this.$element()) - this.option('contentOffset');
      var menuContent = (0, _renderer.default)(this.menuContent());
      menuContent.css('maxWidth', maxMenuWidth < 0 ? 0 : maxMenuWidth);
      var currentMenuWidth = (0, _size.getWidth)(menuContent);
      this._menuWidth = Math.min(currentMenuWidth, maxMenuWidth);
    }

    return this._menuWidth;
  },
  _animationCompleteHandler: function _animationCompleteHandler() {
    this._toggleShieldVisibility(this.option('menuVisible'));

    if (this._whenAnimationComplete) {
      this._whenAnimationComplete.resolveWith(this);
    }
  },
  _toggleHideMenuCallback: function _toggleHideMenuCallback(subscribe) {
    if (subscribe) {
      _hide_callback.hideCallback.add(this._hideMenuHandler);
    } else {
      _hide_callback.hideCallback.remove(this._hideMenuHandler);
    }
  },
  _getRTLSignCorrection: function _getRTLSignCorrection() {
    return this._isRightMenuPosition() ? -1 : 1;
  },
  _dispose: function _dispose() {
    _uiSlide_out_view.animation.complete((0, _renderer.default)(this.content()));

    this._toggleHideMenuCallback(false);

    this.callBase();
  },
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      this._dimensionChanged();
    }
  },
  _dimensionChanged: function _dimensionChanged() {
    delete this._menuWidth;

    this._renderPosition(this.option('menuVisible'), false);
  },
  _toggleShieldVisibility: function _toggleShieldVisibility(visible) {
    this._$shield.toggleClass(INVISIBLE_STATE_CLASS, !visible);
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'width':
        this.callBase(args);

        this._dimensionChanged();

        break;

      case 'contentOffset':
        this._dimensionChanged();

        break;

      case 'menuVisible':
        this._renderPosition(args.value, true);

        break;

      case 'menuPosition':
        this._renderPosition(this.option('menuVisible'), true);

        this._toggleMenuPositionClass();

        break;

      case 'swipeEnabled':
        this._initSwipeHandlers();

        break;

      case 'contentTemplate':
      case 'menuTemplate':
        this._invalidate();

        break;

      default:
        this.callBase(args);
    }
  },
  menuContent: function menuContent() {
    return (0, _element.getPublicElement)(this._$menu);
  },
  content: function content() {
    return (0, _element.getPublicElement)(this._$container);
  },
  showMenu: function showMenu() {
    return this.toggleMenuVisibility(true);
  },
  hideMenu: function hideMenu() {
    return this.toggleMenuVisibility(false);
  },
  toggleMenuVisibility: function toggleMenuVisibility(showing) {
    showing = showing === undefined ? !this.option('menuVisible') : showing;
    this._whenAnimationComplete = new _deferred.Deferred();
    this.option('menuVisible', showing);
    return this._whenAnimationComplete.promise();
  }
  /**
  * @name dxSlideOutView.registerKeyHandler
  * @publicName registerKeyHandler(key, handler)
  * @hidden
  */

  /**
  * @name dxSlideOutView.focus
  * @publicName focus()
  * @hidden
  */

});

(0, _component_registrator.default)('dxSlideOutView', SlideOutView);
var _default = SlideOutView;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
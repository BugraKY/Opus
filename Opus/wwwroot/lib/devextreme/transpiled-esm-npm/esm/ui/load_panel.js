import $ from '../core/renderer';
import { noop } from '../core/utils/common';
import messageLocalization from '../localization/message';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import LoadIndicator from './load_indicator';
import Overlay from './overlay/ui.overlay';
import { Deferred } from '../core/utils/deferred';
import { isMaterial } from './themes'; // STYLE loadPanel

var LOADPANEL_CLASS = 'dx-loadpanel';
var LOADPANEL_WRAPPER_CLASS = 'dx-loadpanel-wrapper';
var LOADPANEL_INDICATOR_CLASS = 'dx-loadpanel-indicator';
var LOADPANEL_MESSAGE_CLASS = 'dx-loadpanel-message';
var LOADPANEL_CONTENT_CLASS = 'dx-loadpanel-content';
var LOADPANEL_CONTENT_WRAPPER_CLASS = 'dx-loadpanel-content-wrapper';
var LOADPANEL_PANE_HIDDEN_CLASS = 'dx-loadpanel-pane-hidden';
var LoadPanel = Overlay.inherit({
  _supportedKeys: function _supportedKeys() {
    return extend(this.callBase(), {
      escape: noop
    });
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      message: messageLocalization.format('Loading'),
      width: 222,
      height: 90,
      animation: null,

      /**
      * @name dxLoadPanelOptions.disabled
      * @hidden
      */
      showIndicator: true,
      indicatorSrc: '',
      showPane: true,
      delay: 0,
      templatesRenderAsynchronously: false,
      hideTopOverlayHandler: null,

      /**
      * @name dxLoadPanelOptions.resizeEnabled
      * @hidden
      */
      resizeEnabled: false,
      focusStateEnabled: false
      /**
      * @name dxLoadPanelOptions.dragEnabled
      * @hidden
      */

      /**
      * @name dxLoadPanelOptions.dragOutsideBoundary
      * @hidden
      */

      /**
      * @name dxLoadPanelOptions.dragAndResizeArea
      * @hidden
      */

      /**
      * @name dxLoadPanelOptions.contentTemplate
      * @hidden
      */

      /**
      * @name dxLoadPanelOptions.accessKey
      * @hidden
      */

      /**
      * @name dxLoadPanelOptions.tabIndex
      * @hidden
      */

    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: {
        platform: 'generic'
      },
      options: {
        shadingColor: 'transparent'
      }
    }, {
      device: function device() {
        return isMaterial();
      },
      options: {
        message: '',
        width: 60,
        height: 60,
        maxHeight: 60,
        maxWidth: 60
      }
    }]);
  },
  _init: function _init() {
    this.callBase.apply(this, arguments);
  },
  _render: function _render() {
    this.callBase();
    this.$element().addClass(LOADPANEL_CLASS);
    this.$wrapper().addClass(LOADPANEL_WRAPPER_CLASS);
  },
  _renderContentImpl: function _renderContentImpl() {
    this.callBase();
    this.$content().addClass(LOADPANEL_CONTENT_CLASS);
    this._$loadPanelContentWrapper = $('<div>').addClass(LOADPANEL_CONTENT_WRAPPER_CLASS);

    this._$loadPanelContentWrapper.appendTo(this.$content());

    this._togglePaneVisible();

    this._cleanPreviousContent();

    this._renderLoadIndicator();

    this._renderMessage();
  },
  _show: function _show() {
    var delay = this.option('delay');

    if (!delay) {
      return this.callBase();
    }

    var deferred = new Deferred();
    var callBase = this.callBase.bind(this);

    this._clearShowTimeout();

    this._showTimeout = setTimeout(function () {
      callBase().done(function () {
        deferred.resolve();
      });
    }, delay);
    return deferred.promise();
  },
  _hide: function _hide() {
    this._clearShowTimeout();

    return this.callBase();
  },
  _clearShowTimeout: function _clearShowTimeout() {
    clearTimeout(this._showTimeout);
  },
  _renderMessage: function _renderMessage() {
    if (!this._$loadPanelContentWrapper) {
      return;
    }

    var message = this.option('message');
    if (!message) return;
    var $message = $('<div>').addClass(LOADPANEL_MESSAGE_CLASS).text(message);

    this._$loadPanelContentWrapper.append($message);
  },
  _renderLoadIndicator: function _renderLoadIndicator() {
    if (!this._$loadPanelContentWrapper || !this.option('showIndicator')) {
      return;
    }

    if (!this._$indicator) {
      this._$indicator = $('<div>').addClass(LOADPANEL_INDICATOR_CLASS).appendTo(this._$loadPanelContentWrapper);
    }

    this._createComponent(this._$indicator, LoadIndicator, {
      indicatorSrc: this.option('indicatorSrc')
    });
  },
  _cleanPreviousContent: function _cleanPreviousContent() {
    this.$content().find('.' + LOADPANEL_MESSAGE_CLASS).remove();
    this.$content().find('.' + LOADPANEL_INDICATOR_CLASS).remove();
    delete this._$indicator;
  },
  _togglePaneVisible: function _togglePaneVisible() {
    this.$content().toggleClass(LOADPANEL_PANE_HIDDEN_CLASS, !this.option('showPane'));
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'delay':
        break;

      case 'message':
      case 'showIndicator':
        this._cleanPreviousContent();

        this._renderLoadIndicator();

        this._renderMessage();

        break;

      case 'showPane':
        this._togglePaneVisible();

        break;

      case 'indicatorSrc':
        this._renderLoadIndicator();

        break;

      default:
        this.callBase(args);
    }
  },
  _dispose: function _dispose() {
    this._clearShowTimeout();

    this.callBase();
  }
  /**
  * @name dxLoadPanel.registerKeyHandler
  * @publicName registerKeyHandler(key, handler)
  * @hidden
  */

  /**
  * @name dxLoadPanel.focus
  * @publicName focus()
  * @hidden
  */

});
registerComponent('dxLoadPanel', LoadPanel);
export default LoadPanel;
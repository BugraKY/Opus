import { TransitionExecutor } from '../animation/transition_executor/transition_executor';
import registerComponent from '../core/component_registrator';
import domAdapter from '../core/dom_adapter';
import $ from '../core/renderer';
import { noop, executeAsync } from '../core/utils/common';
import { Deferred, fromPromise } from '../core/utils/deferred';
import { extend } from '../core/utils/extend';
import { each } from '../core/utils/iterator';
import { isPromise } from '../core/utils/type';
import { getWindow, hasWindow } from '../core/utils/window';
import eventsEngine from '../events/core/events_engine';
import { triggerShownEvent } from '../events/visibility_change';
import LoadIndicator from './load_indicator';
import Widget from './widget/ui.widget';
import { getBoundingRect } from '../core/utils/position'; // STYLE deferRendering

var window = getWindow();
var WIDGET_CLASS = 'dx-widget';
var DEFER_RENDERING_CLASS = 'dx-deferrendering';
var PENDING_RENDERING_CLASS = 'dx-pending-rendering';
var PENDING_RENDERING_MANUAL_CLASS = 'dx-pending-rendering-manual';
var PENDING_RENDERING_ACTIVE_CLASS = 'dx-pending-rendering-active';
var VISIBLE_WHILE_PENDING_RENDERING_CLASS = 'dx-visible-while-pending-rendering';
var INVISIBLE_WHILE_PENDING_RENDERING_CLASS = 'dx-invisible-while-pending-rendering';
var LOADINDICATOR_CONTAINER_CLASS = 'dx-loadindicator-container';
var DEFER_RENDERING_LOADINDICATOR_CONTAINER_CLASS = 'dx-deferrendering-loadindicator-container';
var DEFER_DEFER_RENDERING_LOAD_INDICATOR = 'dx-deferrendering-load-indicator';
var ANONYMOUS_TEMPLATE_NAME = 'content';
var ACTIONS = ['onRendered', 'onShown'];
var DeferRendering = Widget.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      showLoadIndicator: false,
      renderWhen: undefined,
      animation: undefined,
      staggerItemSelector: undefined,
      onRendered: null,
      onShown: null
    });
  },
  _getAnonymousTemplateName: function _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },
  _init: function _init() {
    this.transitionExecutor = new TransitionExecutor();

    this._initElement();

    this._initRender();

    this._$initialContent = this.$element().clone().contents();

    this._initActions();

    this.callBase();
  },
  _initElement: function _initElement() {
    this.$element().addClass(DEFER_RENDERING_CLASS);
  },
  _initRender: function _initRender() {
    var that = this;
    var $element = this.$element();
    var renderWhen = this.option('renderWhen');

    var doRender = () => {
      return that._renderDeferredContent();
    };

    if (isPromise(renderWhen)) {
      fromPromise(renderWhen).done(doRender);
    } else {
      $element.data('dx-render-delegate', doRender);

      if (renderWhen === undefined) {
        $element.addClass(PENDING_RENDERING_MANUAL_CLASS);
      }
    }
  },
  _initActions: function _initActions() {
    this._actions = {};
    each(ACTIONS, (_, action) => {
      this._actions[action] = this._createActionByOption(action) || noop;
    });
  },
  _initMarkup: function _initMarkup() {
    this.callBase();

    if (!this._initContent) {
      this._initContent = this._renderContent;

      this._renderContent = () => {};
    }

    this._initContent();
  },
  _renderContentImpl: function _renderContentImpl() {
    this.$element().removeClass(WIDGET_CLASS);
    this.$element().append(this._$initialContent);

    this._setLoadingState();
  },
  _renderDeferredContent: function _renderDeferredContent() {
    var that = this;
    var $element = this.$element();
    var result = new Deferred();
    $element.removeClass(PENDING_RENDERING_MANUAL_CLASS);
    $element.addClass(PENDING_RENDERING_ACTIVE_CLASS);

    this._abortRenderTask();

    this._renderTask = executeAsync(() => {
      that._renderImpl().done(() => {
        var shownArgs = {
          element: $element
        };

        that._actions.onShown([shownArgs]);

        result.resolve(shownArgs);
      }).fail(function () {
        result.rejectWith(result, arguments);
      });
    });
    return result.promise();
  },
  _isElementInViewport: function _isElementInViewport(element) {
    var rect = getBoundingRect(element);
    return rect.bottom >= 0 && rect.right >= 0 && rect.top <= (window.innerHeight || domAdapter.getDocumentElement().clientHeight) && rect.left <= (window.innerWidth || domAdapter.getDocumentElement().clientWidth);
  },
  _animate: function _animate() {
    var that = this;
    var $element = this.$element();
    var animation = hasWindow() && this.option('animation');
    var staggerItemSelector = this.option('staggerItemSelector');
    var animatePromise;
    that.transitionExecutor.stop();

    if (animation) {
      if (staggerItemSelector) {
        $element.find(staggerItemSelector).each(function () {
          if (that._isElementInViewport(this)) {
            that.transitionExecutor.enter($(this), animation);
          }
        });
      } else {
        that.transitionExecutor.enter($element, animation);
      }

      animatePromise = that.transitionExecutor.start();
    } else {
      animatePromise = new Deferred().resolve().promise();
    }

    return animatePromise;
  },
  _renderImpl: function _renderImpl() {
    var $element = this.$element();
    var renderedArgs = {
      element: $element
    };

    var contentTemplate = this._getTemplate(this._templateManager.anonymousTemplateName);

    if (contentTemplate) {
      contentTemplate.render({
        container: $element.empty(),
        noModel: true
      });
    }

    this._setRenderedState($element);

    eventsEngine.trigger($element, 'dxcontentrendered');

    this._actions.onRendered([renderedArgs]);

    this._isRendered = true;
    return this._animate();
  },
  _setLoadingState: function _setLoadingState() {
    var $element = this.$element();
    var hasCustomLoadIndicator = !!$element.find('.' + VISIBLE_WHILE_PENDING_RENDERING_CLASS).length;
    $element.addClass(PENDING_RENDERING_CLASS);

    if (!hasCustomLoadIndicator) {
      $element.children().addClass(INVISIBLE_WHILE_PENDING_RENDERING_CLASS);
    }

    if (this.option('showLoadIndicator')) {
      this._showLoadIndicator($element);
    }
  },
  _showLoadIndicator: function _showLoadIndicator($container) {
    this._$loadIndicator = new LoadIndicator($('<div>'), {
      visible: true
    }).$element().addClass(DEFER_DEFER_RENDERING_LOAD_INDICATOR);
    $('<div>').addClass(LOADINDICATOR_CONTAINER_CLASS).addClass(DEFER_RENDERING_LOADINDICATOR_CONTAINER_CLASS).append(this._$loadIndicator).appendTo($container);
  },
  _setRenderedState: function _setRenderedState() {
    var $element = this.$element();

    if (this._$loadIndicator) {
      this._$loadIndicator.remove();
    }

    $element.removeClass(PENDING_RENDERING_CLASS);
    $element.removeClass(PENDING_RENDERING_ACTIVE_CLASS);
    triggerShownEvent($element.children());
  },
  _optionChanged: function _optionChanged(args) {
    var value = args.value;
    var previousValue = args.previousValue;

    switch (args.name) {
      case 'renderWhen':
        if (previousValue === false && value === true) {
          this._renderOrAnimate();
        } else if (previousValue === true && value === false) {
          this.transitionExecutor.stop();

          this._setLoadingState();
        }

        break;

      case 'showLoadIndicator':
      case 'onRendered':
      case 'onShown':
        break;

      default:
        this.callBase(args);
    }
  },
  _renderOrAnimate: function _renderOrAnimate() {
    var result;

    if (this._isRendered) {
      this._setRenderedState();

      result = this._animate();
    } else {
      result = this._renderDeferredContent();
    }

    return result;
  },
  renderContent: function renderContent() {
    return this._renderOrAnimate();
  },
  _abortRenderTask: function _abortRenderTask() {
    if (this._renderTask) {
      this._renderTask.abort();

      this._renderTask = undefined;
    }
  },
  _dispose: function _dispose() {
    this.transitionExecutor.stop(true);

    this._abortRenderTask();

    this._actions = undefined;
    this._$initialContent = undefined;
    this.callBase();
  }
});
registerComponent('dxDeferRendering', DeferRendering);
export default DeferRendering;
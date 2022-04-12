import { getWidth, setWidth, getHeight, setHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { hasWindow } from '../../core/utils/window';
import { getPublicElement } from '../../core/element';
import domAdapter from '../../core/dom_adapter';
import eventsEngine from '../../events/core/events_engine';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import { move } from '../../animation/translator';
import positionUtils from '../../animation/position';
import { isObject, isString } from '../../core/utils/type';
import { fitIntoRange } from '../../core/utils/math';
import { addNamespace } from '../../events/utils/index';
import errors from '../widget/ui.errors';
import Popup from '../popup';
import { getBoundingRect } from '../../core/utils/position';
import { PopoverPositionController, POPOVER_POSITION_ALIASES } from './popover_position_controller'; // STYLE popover

var POPOVER_CLASS = 'dx-popover';
var POPOVER_WRAPPER_CLASS = 'dx-popover-wrapper';
var POPOVER_ARROW_CLASS = 'dx-popover-arrow';
var POPOVER_WITHOUT_TITLE_CLASS = 'dx-popover-without-title';
var POSITION_FLIP_MAP = {
  'left': 'right',
  'top': 'bottom',
  'right': 'left',
  'bottom': 'top',
  'center': 'center'
};

var getEventNameByOption = function getEventNameByOption(optionValue) {
  return isObject(optionValue) ? optionValue.name : optionValue;
};

var getEventName = function getEventName(that, optionName) {
  var optionValue = that.option(optionName);
  return getEventNameByOption(optionValue);
};

var getEventDelay = function getEventDelay(that, optionName) {
  var optionValue = that.option(optionName);
  return isObject(optionValue) && optionValue.delay;
};

var attachEvent = function attachEvent(that, name) {
  var {
    target,
    shading,
    disabled,
    hideEvent
  } = that.option();
  var isSelector = isString(target);
  var shouldIgnoreHideEvent = shading && name === 'hide';
  var event = shouldIgnoreHideEvent ? null : getEventName(that, "".concat(name, "Event"));

  if (shouldIgnoreHideEvent && hideEvent) {
    errors.log('W1020');
  }

  if (!event || disabled) {
    return;
  }

  var eventName = addNamespace(event, that.NAME);

  var action = that._createAction(function () {
    var delay = getEventDelay(that, name + 'Event');

    this._clearEventsTimeouts();

    if (delay) {
      this._timeouts[name] = setTimeout(function () {
        that[name]();
      }, delay);
    } else {
      that[name]();
    }
  }.bind(that), {
    validatingTargetName: 'target'
  });

  var handler = function handler(e) {
    action({
      event: e,
      target: $(e.currentTarget)
    });
  };

  var EVENT_HANDLER_NAME = '_' + name + 'EventHandler';

  if (isSelector) {
    that[EVENT_HANDLER_NAME] = handler;
    eventsEngine.on(domAdapter.getDocument(), eventName, target, handler);
  } else {
    var targetElement = getPublicElement($(target));
    that[EVENT_HANDLER_NAME] = undefined;
    eventsEngine.on(targetElement, eventName, handler);
  }
};

var detachEvent = function detachEvent(that, target, name, event) {
  var eventName = event || getEventName(that, name + 'Event');

  if (!eventName) {
    return;
  }

  eventName = addNamespace(eventName, that.NAME);
  var EVENT_HANDLER_NAME = '_' + name + 'EventHandler';

  if (that[EVENT_HANDLER_NAME]) {
    eventsEngine.off(domAdapter.getDocument(), eventName, target, that[EVENT_HANDLER_NAME]);
  } else {
    eventsEngine.off(getPublicElement($(target)), eventName);
  }
};

var Popover = Popup.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      target: undefined,
      shading: false,
      position: extend({}, POPOVER_POSITION_ALIASES.bottom),
      closeOnOutsideClick: true,
      animation: {
        show: {
          type: 'fade',
          from: 0,
          to: 1
        },
        hide: {
          type: 'fade',
          to: 0
        }
      },
      showTitle: false,
      width: 'auto',
      height: 'auto',

      /**
       * @name dxPopoverOptions.dragEnabled
       * @hidden
       */
      dragEnabled: false,

      /**
      * @name dxPopoverOptions.dragOutsideBoundary
      * @hidden
      */

      /**
      * @name dxPopoverOptions.dragAndResizeArea
      * @hidden
      */

      /**
      * @name dxPopoverOptions.resizeEnabled
      * @hidden
      */
      resizeEnabled: false,

      /**
      * @name dxPopoverOptions.restorePosition
      * @hidden
      */

      /**
      * @section Utils
      * @type function
      * @default null
      * @type_function_param1 e:object
      * @type_function_param1_field1 component:this
      * @type_function_param1_field2 element:DxElement
      * @type_function_param1_field3 model:object
      * @name dxPopoverOptions.onResizeStart
      * @action
      * @hidden
      */

      /**
      * @section Utils
      * @type function
      * @default null
      * @type_function_param1 e:object
      * @type_function_param1_field1 component:this
      * @type_function_param1_field2 element:DxElement
      * @type_function_param1_field3 model:object
      * @name dxPopoverOptions.onResize
      * @action
      * @hidden
      */

      /**
      * @section Utils
      * @type function
      * @default null
      * @type_function_param1 e:object
      * @type_function_param1_field1 component:this
      * @type_function_param1_field2 element:DxElement
      * @type_function_param1_field3 model:object
      * @name dxPopoverOptions.onResizeEnd
      * @action
      * @hidden
      */

      /**
      * @name dxPopoverOptions.fullScreen
      * @hidden
      */
      fullScreen: false,
      hideOnParentScroll: true,
      arrowPosition: '',
      arrowOffset: 0,
      _fixWrapperPosition: true
      /**
      * @name dxPopoverOptions.focusStateEnabled
      * @hidden
      */

      /**
      * @name dxPopoverOptions.accessKey
      * @hidden
      */

      /**
      * @name dxPopoverOptions.tabIndex
      * @hidden
      */

    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return [{
      device: {
        platform: 'ios'
      },
      options: {
        arrowPosition: {
          boundaryOffset: {
            h: 20,
            v: -10
          },
          collision: 'fit'
        }
      }
    }, {
      device: function device() {
        return !hasWindow();
      },
      options: {
        animation: null
      }
    }];
  },
  _init: function _init() {
    this.callBase();

    this._renderArrow();

    this._timeouts = {};
    this.$element().addClass(POPOVER_CLASS);
    this.$wrapper().addClass(POPOVER_WRAPPER_CLASS);
  },
  _render: function _render() {
    this.callBase.apply(this, arguments);

    this._detachEvents(this.option('target'));

    this._attachEvents();
  },
  _detachEvents: function _detachEvents(target) {
    detachEvent(this, target, 'show');
    detachEvent(this, target, 'hide');
  },
  _attachEvents: function _attachEvents() {
    attachEvent(this, 'show');
    attachEvent(this, 'hide');
  },
  _renderArrow: function _renderArrow() {
    this._$arrow = $('<div>').addClass(POPOVER_ARROW_CLASS).prependTo(this.$overlayContent());
  },
  _documentDownHandler: function _documentDownHandler(e) {
    if (this._isOutsideClick(e)) {
      return this.callBase(e);
    }

    return true;
  },
  _isOutsideClick: function _isOutsideClick(e) {
    return !$(e.target).closest(this.option('target')).length;
  },
  _animate: function _animate(animation) {
    if (animation && animation.to && typeof animation.to === 'object') {
      extend(animation.to, {
        position: this._getContainerPosition()
      });
    }

    this.callBase.apply(this, arguments);
  },
  _stopAnimation: function _stopAnimation() {
    this.callBase.apply(this, arguments);
  },
  _renderTitle: function _renderTitle() {
    this.$wrapper().toggleClass(POPOVER_WITHOUT_TITLE_CLASS, !this.option('showTitle'));
    this.callBase();
  },
  _renderPosition: function _renderPosition() {
    this.callBase();

    this._renderOverlayPosition();

    this._actions.onPositioned();
  },
  _renderOverlayPosition: function _renderOverlayPosition() {
    this._resetOverlayPosition();

    this._updateContentSize();

    var contentPosition = this._getContainerPosition();

    var resultLocation = positionUtils.setup(this.$overlayContent(), contentPosition);

    var positionSide = this._getSideByLocation(resultLocation);

    this._togglePositionClass('dx-position-' + positionSide);

    this._toggleFlippedClass(resultLocation.h.flip, resultLocation.v.flip);

    var isArrowVisible = this._isHorizontalSide() || this._isVerticalSide();

    if (isArrowVisible) {
      this._renderArrowPosition(positionSide);
    }
  },
  _resetOverlayPosition: function _resetOverlayPosition() {
    this._setContentHeight(true);

    this._togglePositionClass('dx-position-' + this._positionController._positionSide);

    move(this.$overlayContent(), {
      left: 0,
      top: 0
    });

    this._$arrow.css({
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    });
  },
  _updateContentSize: function _updateContentSize() {
    if (!this.$content()) {
      return;
    }

    var containerLocation = positionUtils.calculate(this.$overlayContent(), this._getContainerPosition());

    if (containerLocation.h.oversize > 0 && this._isHorizontalSide() && !containerLocation.h.fit) {
      var newContainerWidth = getWidth(this.$overlayContent()) - containerLocation.h.oversize;
      setWidth(this.$overlayContent(), newContainerWidth);
    }

    if (containerLocation.v.oversize > 0 && this._isVerticalSide() && !containerLocation.v.fit) {
      var newOverlayContentHeight = getHeight(this.$overlayContent()) - containerLocation.v.oversize;
      var newPopupContentHeight = getHeight(this.$content()) - containerLocation.v.oversize;
      setHeight(this.$overlayContent(), newOverlayContentHeight);
      setHeight(this.$content(), newPopupContentHeight);
    }
  },
  _getContainerPosition: function _getContainerPosition() {
    return this._positionController._getContainerPosition();
  },
  _getSideByLocation: function _getSideByLocation(location) {
    var isFlippedByVertical = location.v.flip;
    var isFlippedByHorizontal = location.h.flip;
    return this._isVerticalSide() && isFlippedByVertical || this._isHorizontalSide() && isFlippedByHorizontal || this._isPopoverInside() ? POSITION_FLIP_MAP[this._positionController._positionSide] : this._positionController._positionSide;
  },
  _togglePositionClass: function _togglePositionClass(positionClass) {
    this.$wrapper().removeClass('dx-position-left dx-position-right dx-position-top dx-position-bottom').addClass(positionClass);
  },
  _toggleFlippedClass: function _toggleFlippedClass(isFlippedHorizontal, isFlippedVertical) {
    this.$wrapper().toggleClass('dx-popover-flipped-horizontal', isFlippedHorizontal).toggleClass('dx-popover-flipped-vertical', isFlippedVertical);
  },
  _renderArrowPosition: function _renderArrowPosition(side) {
    var arrowRect = getBoundingRect(this._$arrow.get(0));
    var arrowFlip = -(this._isVerticalSide(side) ? arrowRect.height : arrowRect.width);

    this._$arrow.css(POSITION_FLIP_MAP[side], arrowFlip);

    var axis = this._isVerticalSide(side) ? 'left' : 'top';
    var sizeProperty = this._isVerticalSide(side) ? 'width' : 'height';
    var $target = $(this._positionController._position.of);
    var targetOffset = positionUtils.offset($target) || {
      top: 0,
      left: 0
    };
    var contentOffset = positionUtils.offset(this.$overlayContent());
    var arrowSize = arrowRect[sizeProperty];
    var contentLocation = contentOffset[axis];
    var contentSize = getBoundingRect(this.$overlayContent().get(0))[sizeProperty];
    var targetLocation = targetOffset[axis];
    var targetElement = $target.get(0);
    var targetSize = targetElement && !targetElement.preventDefault ? getBoundingRect(targetElement)[sizeProperty] : 0;
    var min = Math.max(contentLocation, targetLocation);
    var max = Math.min(contentLocation + contentSize, targetLocation + targetSize);
    var arrowLocation;

    if (this.option('arrowPosition') === 'start') {
      arrowLocation = min - contentLocation;
    } else if (this.option('arrowPosition') === 'end') {
      arrowLocation = max - contentLocation - arrowSize;
    } else {
      arrowLocation = (min + max) / 2 - contentLocation - arrowSize / 2;
    }

    var borderWidth = this._positionController._getContentBorderWidth(side);

    var finalArrowLocation = fitIntoRange(arrowLocation - borderWidth + this.option('arrowOffset'), borderWidth, contentSize - arrowSize - borderWidth * 2);

    this._$arrow.css(axis, finalArrowLocation);
  },
  _isPopoverInside: function _isPopoverInside() {
    return this._positionController._isPopoverInside();
  },
  _setContentHeight: function _setContentHeight(fullUpdate) {
    if (fullUpdate) {
      this.callBase();
    }
  },

  _getPositionControllerConfig() {
    var {
      shading
    } = this.option();
    return extend({}, this.callBase(), {
      shading,
      $arrow: this._$arrow
    });
  },

  _initPositionController() {
    this._positionController = new PopoverPositionController(this._getPositionControllerConfig());
  },

  _renderWrapperDimensions: function _renderWrapperDimensions() {
    if (this.option('shading')) {
      this.$wrapper().css({
        width: '100%',
        height: '100%'
      });
    }
  },
  _isVerticalSide: function _isVerticalSide(side) {
    return this._positionController._isVerticalSide(side);
  },
  _isHorizontalSide: function _isHorizontalSide(side) {
    return this._positionController._isHorizontalSide(side);
  },
  _clearEventTimeout: function _clearEventTimeout(name) {
    clearTimeout(this._timeouts[name]);
  },
  _clearEventsTimeouts: function _clearEventsTimeouts() {
    this._clearEventTimeout('show');

    this._clearEventTimeout('hide');
  },
  _clean: function _clean() {
    this._detachEvents(this.option('target'));

    this.callBase.apply(this, arguments);
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'arrowPosition':
      case 'arrowOffset':
        this._renderGeometry();

        break;

      case 'fullScreen':
        if (args.value) {
          this.option('fullScreen', false);
        }

        break;

      case 'target':
        args.previousValue && this._detachEvents(args.previousValue);
        this.callBase(args);
        break;

      case 'showEvent':
      case 'hideEvent':
        {
          var name = args.name.substring(0, 4);
          var event = getEventNameByOption(args.previousValue);
          this.hide();
          detachEvent(this, this.option('target'), name, event);
          attachEvent(this, name);
          break;
        }

      case 'visible':
        this._clearEventTimeout(args.value ? 'show' : 'hide');

        this.callBase(args);
        break;

      default:
        this.callBase(args);
    }
  },
  show: function show(target) {
    if (target) {
      this.option('target', target);
    }

    return this.callBase();
  }
  /**
  * @name dxPopover.registerKeyHandler
  * @publicName registerKeyHandler(key, handler)
  * @hidden
  */

  /**
  * @name dxPopover.focus
  * @publicName focus()
  * @hidden
  */

});
registerComponent('dxPopover', Popover);
export default Popover;
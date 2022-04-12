"use strict";

exports.OverlayPositionController = exports.OVERLAY_POSITION_ALIASES = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _type = require("../../core/utils/type");

var _extend = require("../../core/utils/extend");

var _position = _interopRequireDefault(require("../../animation/position"));

var _translator = require("../../animation/translator");

var _window = require("../../core/utils/window");

var _view_port = require("../../core/utils/view_port");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var window = (0, _window.getWindow)();
var OVERLAY_POSITION_ALIASES = {
  'top': {
    my: 'top center',
    at: 'top center'
  },
  'bottom': {
    my: 'bottom center',
    at: 'bottom center'
  },
  'right': {
    my: 'right center',
    at: 'right center'
  },
  'left': {
    my: 'left center',
    at: 'left center'
  },
  'center': {
    my: 'center',
    at: 'center'
  },
  'right bottom': {
    my: 'right bottom',
    at: 'right bottom'
  },
  'right top': {
    my: 'right top',
    at: 'right top'
  },
  'left bottom': {
    my: 'left bottom',
    at: 'left bottom'
  },
  'left top': {
    my: 'left top',
    at: 'left top'
  }
};
exports.OVERLAY_POSITION_ALIASES = OVERLAY_POSITION_ALIASES;
var OVERLAY_DEFAULT_BOUNDARY_OFFSET = {
  h: 0,
  v: 0
};

var OverlayPositionController = /*#__PURE__*/function () {
  function OverlayPositionController(_ref) {
    var position = _ref.position,
        target = _ref.target,
        container = _ref.container,
        $root = _ref.$root,
        $content = _ref.$content,
        $wrapper = _ref.$wrapper,
        onPositioned = _ref.onPositioned,
        onVisualPositionChanged = _ref.onVisualPositionChanged,
        dragOutsideBoundary = _ref.dragOutsideBoundary,
        dragAndResizeArea = _ref.dragAndResizeArea,
        outsideDragFactor = _ref.outsideDragFactor,
        restorePosition = _ref.restorePosition,
        _fixWrapperPosition = _ref._fixWrapperPosition;
    this._props = {
      position: position,
      target: target,
      container: container,
      dragOutsideBoundary: dragOutsideBoundary,
      dragAndResizeArea: dragAndResizeArea,
      outsideDragFactor: outsideDragFactor,
      restorePosition: restorePosition,
      onPositioned: onPositioned,
      onVisualPositionChanged: onVisualPositionChanged,
      _fixWrapperPosition: _fixWrapperPosition
    };
    this._$root = $root;
    this._$content = $content;
    this._$wrapper = $wrapper;
    this._$markupContainer = undefined;
    this._$wrapperCoveredElement = undefined;
    this._shouldRenderContentInitialPosition = true;
    this._visualPosition = undefined;
    this._initialPosition = undefined;
    this._previousVisualPosition = undefined;
    this._$dragResizeContainer = undefined;
    this._outsideDragFactor = undefined;
    this.updateContainer(container);
    this.updatePosition(position, target);

    this._updateDragResizeContainer();

    this._updateOutsideDragFactor();
  }

  var _proto = OverlayPositionController.prototype;

  _proto.restorePositionOnNextRender = function restorePositionOnNextRender(value) {
    // NOTE: no visual position means it's a first render
    this._shouldRenderContentInitialPosition = value || !this._visualPosition;
  };

  _proto.openingHandled = function openingHandled() {
    var shouldRestorePosition = this._props.restorePosition;
    this.restorePositionOnNextRender(shouldRestorePosition);
  };

  _proto.dragHandled = function dragHandled() {
    this.restorePositionOnNextRender(false);
  };

  _proto.resizeHandled = function resizeHandled() {
    this.restorePositionOnNextRender(false);
  };

  _proto.updateTarget = function updateTarget(target) {
    this._props.target = target;
    this.updatePosition(this._props.position, target);
  };

  _proto.updatePosition = function updatePosition(positionProp) {
    var targetProp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._props.target;
    this._props.position = positionProp;
    this._position = this._normalizePosition(positionProp, targetProp);

    this._updateWrapperCoveredElement();
  };

  _proto.updateContainer = function updateContainer(containerProp) {
    this._props.container = containerProp;
    var container = containerProp !== null && containerProp !== void 0 ? containerProp : (0, _view_port.value)();

    var $container = this._$root.closest(container);

    if (!$container.length) {
      $container = (0, _renderer.default)(container).first();
    }

    this._$markupContainer = $container.length ? $container : this._$root.parent();

    this._updateWrapperCoveredElement();

    this._updateDragResizeContainer();
  };

  _proto.detectVisualPositionChange = function detectVisualPositionChange(event) {
    this._updateVisualPositionValue();

    this._raisePositionedEvents(event);
  };

  _proto.positionContent = function positionContent() {
    if (this._shouldRenderContentInitialPosition) {
      this._renderContentInitialPosition();
    } else {
      (0, _translator.move)(this._$content, this._visualPosition);
      this.detectVisualPositionChange();
    }
  };

  _proto.positionWrapper = function positionWrapper() {
    if (this._$wrapperCoveredElement) {
      _position.default.setup(this._$wrapper, {
        my: 'top left',
        at: 'top left',
        of: this._$wrapperCoveredElement
      });
    }
  };

  _proto.isAllWindowCoveredByWrapper = function isAllWindowCoveredByWrapper() {
    return !this._$wrapperCoveredElement || (0, _type.isWindow)(this._$wrapperCoveredElement.get(0));
  };

  _proto.styleWrapperPosition = function styleWrapperPosition() {
    var useFixed = this.isAllWindowCoveredByWrapper() || this._props._fixWrapperPosition;

    var positionStyle = useFixed ? 'fixed' : 'absolute';

    this._$wrapper.css('position', positionStyle);
  };

  _proto._updateVisualPositionValue = function _updateVisualPositionValue() {
    this._previousVisualPosition = this._visualPosition;
    this._visualPosition = (0, _translator.locate)(this._$content);
  };

  _proto._renderContentInitialPosition = function _renderContentInitialPosition() {
    this._renderBoundaryOffset();

    (0, _translator.resetPosition)(this._$content);

    var wrapperOverflow = this._$wrapper.css('overflow');

    this._$wrapper.css('overflow', 'hidden');

    var resultPosition = _position.default.setup(this._$content, this._position);

    this._$wrapper.css('overflow', wrapperOverflow);

    this._initialPosition = resultPosition;
    this.detectVisualPositionChange();
  };

  _proto._raisePositionedEvents = function _raisePositionedEvents(event) {
    var previousPosition = this._previousVisualPosition;
    var newPosition = this._visualPosition;
    var isVisualPositionChanged = (previousPosition === null || previousPosition === void 0 ? void 0 : previousPosition.top) !== newPosition.top || (previousPosition === null || previousPosition === void 0 ? void 0 : previousPosition.left) !== newPosition.left;

    if (isVisualPositionChanged) {
      this._props.onVisualPositionChanged({
        previousPosition: previousPosition,
        position: newPosition,
        event: event
      });
    }

    this._props.onPositioned({
      position: this._initialPosition
    });
  };

  _proto._updateOutsideDragFactor = function _updateOutsideDragFactor() {
    this._outsideDragFactor = this._getOutsideDragFactor();
  };

  _proto._getOutsideDragFactor = function _getOutsideDragFactor() {
    if (this._props.dragOutsideBoundary) {
      return 1;
    }

    return this._props.outsideDragFactor;
  };

  _proto._updateDragResizeContainer = function _updateDragResizeContainer() {
    this._$dragResizeContainer = this._getDragResizeContainer();
  };

  _proto._getDragResizeContainer = function _getDragResizeContainer() {
    if (this._props.dragOutsideBoundary) {
      return (0, _renderer.default)(window);
    }

    if (this._props.dragAndResizeArea) {
      return (0, _renderer.default)(this._props.dragAndResizeArea);
    }

    var isContainerDefined = (0, _view_port.originalViewPort)().get(0) || this._props.container;

    return isContainerDefined ? this._$markupContainer : (0, _renderer.default)(window);
  };

  _proto._updateWrapperCoveredElement = function _updateWrapperCoveredElement() {
    this._$wrapperCoveredElement = this._getWrapperCoveredElement();
  };

  _proto._renderBoundaryOffset = function _renderBoundaryOffset() {
    var _this$_position;

    var boundaryOffset = (_this$_position = this._position) !== null && _this$_position !== void 0 ? _this$_position : {
      boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
    };

    this._$content.css('margin', "".concat(boundaryOffset.v, "px ").concat(boundaryOffset.h, "px"));
  };

  _proto._getWrapperCoveredElement = function _getWrapperCoveredElement() {
    var containerProp = this._props.container;

    if (containerProp) {
      return (0, _renderer.default)(containerProp);
    }

    if (this._position) {
      return (0, _renderer.default)((0, _type.isEvent)(this._position.of) ? window : this._position.of || window);
    }
  };

  _proto._normalizePosition = function _normalizePosition(positionProp, targetProp) {
    var defaultPositionConfig = {
      of: targetProp,
      boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
    };

    if ((0, _type.isDefined)(positionProp)) {
      return (0, _extend.extend)(true, {}, defaultPositionConfig, this._positionToObject(positionProp));
    } else {
      return defaultPositionConfig;
    }
  };

  _proto._positionToObject = function _positionToObject(position) {
    if ((0, _type.isString)(position)) {
      return (0, _extend.extend)({}, OVERLAY_POSITION_ALIASES[position]);
    }

    return position;
  };

  _createClass(OverlayPositionController, [{
    key: "$container",
    get: function get() {
      return this._$markupContainer;
    }
  }, {
    key: "$dragResizeContainer",
    get: function get() {
      return this._$dragResizeContainer;
    }
  }, {
    key: "outsideDragFactor",
    get: function get() {
      return this._outsideDragFactor;
    },
    set: function set(outsideDragFactor) {
      this._props.outsideDragFactor = outsideDragFactor;

      this._updateOutsideDragFactor();
    }
  }, {
    key: "fixWrapperPosition",
    set: function set(fixWrapperPosition) {
      this._props._fixWrapperPosition = fixWrapperPosition;
      this.styleWrapperPosition();
    }
  }, {
    key: "dragAndResizeArea",
    set: function set(dragAndResizeArea) {
      this._props.dragAndResizeArea = dragAndResizeArea;

      this._updateDragResizeContainer();
    }
  }, {
    key: "dragOutsideBoundary",
    set: function set(dragOutsideBoundary) {
      this._props.dragOutsideBoundary = dragOutsideBoundary;

      this._updateDragResizeContainer();

      this._updateOutsideDragFactor();
    }
  }, {
    key: "restorePosition",
    set: function set(restorePosition) {
      this._props.restorePosition = restorePosition;
    }
  }]);

  return OverlayPositionController;
}();

exports.OverlayPositionController = OverlayPositionController;
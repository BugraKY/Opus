"use strict";

exports.default = void 0;

var _size = require("../../core/utils/size");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _uiDrawer = require("./ui.drawer.animation");

var _deferred = require("../../core/utils/deferred");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawerStrategy = /*#__PURE__*/function () {
  function DrawerStrategy(drawer) {
    this._drawer = drawer;
  }

  var _proto = DrawerStrategy.prototype;

  _proto.getDrawerInstance = function getDrawerInstance() {
    return this._drawer;
  };

  _proto.renderPanelContent = function renderPanelContent(whenPanelContentRendered) {
    var drawer = this.getDrawerInstance();

    var template = drawer._getTemplate(drawer.option('template'));

    if (template) {
      template.render({
        container: drawer.content(),
        onRendered: function onRendered() {
          whenPanelContentRendered.resolve();
        }
      });
    }
  };

  _proto.renderPosition = function renderPosition(changePositionUsingFxAnimation, animationDuration) {
    var whenPositionAnimationCompleted = new _deferred.Deferred();
    var whenShaderAnimationCompleted = new _deferred.Deferred();
    var drawer = this.getDrawerInstance();

    if (changePositionUsingFxAnimation) {
      _deferred.when.apply(_renderer.default, [whenPositionAnimationCompleted, whenShaderAnimationCompleted]).done(function () {
        drawer._animationCompleteHandler();
      });
    }

    this._internalRenderPosition(changePositionUsingFxAnimation, whenPositionAnimationCompleted);

    if (!changePositionUsingFxAnimation) {
      drawer.resizeViewContent();
    }

    this.renderShaderVisibility(changePositionUsingFxAnimation, animationDuration, whenShaderAnimationCompleted);
  };

  _proto._getPanelOffset = function _getPanelOffset(isDrawerOpened) {
    var drawer = this.getDrawerInstance();
    var size = drawer.isHorizontalDirection() ? drawer.getRealPanelWidth() : drawer.getRealPanelHeight();

    if (isDrawerOpened) {
      return -(size - drawer.getMaxSize());
    } else {
      return -(size - drawer.getMinSize());
    }
  };

  _proto._getPanelSize = function _getPanelSize(isDrawerOpened) {
    return isDrawerOpened ? this.getDrawerInstance().getMaxSize() : this.getDrawerInstance().getMinSize();
  };

  _proto.renderShaderVisibility = function renderShaderVisibility(changePositionUsingFxAnimation, duration, whenAnimationCompleted) {
    var _this = this;

    var drawer = this.getDrawerInstance();
    var isShaderVisible = drawer.option('opened');
    var fadeConfig = isShaderVisible ? {
      from: 0,
      to: 1
    } : {
      from: 1,
      to: 0
    };

    if (changePositionUsingFxAnimation) {
      _uiDrawer.animation.fade((0, _renderer.default)(drawer._$shader), fadeConfig, duration, function () {
        _this._drawer._toggleShaderVisibility(isShaderVisible);

        whenAnimationCompleted.resolve();
      });
    } else {
      drawer._toggleShaderVisibility(isShaderVisible);

      drawer._$shader.css('opacity', fadeConfig.to);
    }
  };

  _proto.getPanelContent = function getPanelContent() {
    return (0, _renderer.default)(this.getDrawerInstance().content());
  };

  _proto.setPanelSize = function setPanelSize(calcFromRealPanelSize) {
    // TODO: keep for ui.file_manager.adaptivity.js
    this.refreshPanelElementSize(calcFromRealPanelSize);
  };

  _proto.refreshPanelElementSize = function refreshPanelElementSize(calcFromRealPanelSize) {
    var drawer = this.getDrawerInstance();

    var panelSize = this._getPanelSize(drawer.option('opened'));

    if (drawer.isHorizontalDirection()) {
      (0, _size.setWidth)((0, _renderer.default)(drawer.content()), calcFromRealPanelSize ? drawer.getRealPanelWidth() : panelSize);
    } else {
      (0, _size.setHeight)((0, _renderer.default)(drawer.content()), calcFromRealPanelSize ? drawer.getRealPanelHeight() : panelSize);
    }
  };

  _proto.isViewContentFirst = function isViewContentFirst() {
    return false;
  };

  _proto.onPanelContentRendered = function onPanelContentRendered() {};

  return DrawerStrategy;
}();

var _default = DrawerStrategy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
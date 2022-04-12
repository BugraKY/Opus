"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../../core/renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextEditorButton = /*#__PURE__*/function () {
  function TextEditorButton(name, editor, options) {
    this.instance = null;
    this.$container = null;
    this.$placeMarker = null;
    this.editor = editor;
    this.name = name;
    this.options = options || {};
  }

  var _proto = TextEditorButton.prototype;

  _proto._addPlaceMarker = function _addPlaceMarker($container) {
    this.$placeMarker = (0, _renderer.default)('<div>').appendTo($container);
  };

  _proto._addToContainer = function _addToContainer($element) {
    var $placeMarker = this.$placeMarker,
        $container = this.$container;
    $placeMarker ? $placeMarker.replaceWith($element) : $element.appendTo($container);
  };

  _proto._attachEvents = function
    /* instance, $element */
  _attachEvents() {
    throw 'Not implemented';
  };

  _proto._create = function _create() {
    throw 'Not implemented';
  };

  _proto._isRendered = function _isRendered() {
    return !!this.instance;
  };

  _proto._isVisible = function _isVisible() {
    var editor = this.editor,
        options = this.options;
    return options.visible || !editor.option('readOnly');
  };

  _proto._isDisabled = function _isDisabled() {
    throw 'Not implemented';
  };

  _proto._shouldRender = function _shouldRender() {
    return this._isVisible() && !this._isRendered();
  };

  _proto.dispose = function dispose() {
    var instance = this.instance,
        $placeMarker = this.$placeMarker;

    if (instance) {
      // TODO: instance.dispose()
      instance.dispose ? instance.dispose() : instance.remove();
      this.instance = null;
    }

    $placeMarker && $placeMarker.remove();
  };

  _proto.render = function render() {
    var $container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$container;
    this.$container = $container;

    if (this._isVisible()) {
      var _this$_create = this._create(),
          instance = _this$_create.instance,
          $element = _this$_create.$element;

      this.instance = instance;

      this._attachEvents(instance, $element);
    } else {
      this._addPlaceMarker($container);
    }
  };

  _proto.update = function update() {
    if (this._shouldRender()) {
      this.render();
    }

    return !!this.instance;
  };

  return TextEditorButton;
}();

exports.default = TextEditorButton;
module.exports = exports.default;
module.exports.default = exports.default;
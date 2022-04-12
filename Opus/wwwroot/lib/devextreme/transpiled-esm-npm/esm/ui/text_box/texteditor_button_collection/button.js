import $ from '../../../core/renderer';
export default class TextEditorButton {
  constructor(name, editor, options) {
    this.instance = null;
    this.$container = null;
    this.$placeMarker = null;
    this.editor = editor;
    this.name = name;
    this.options = options || {};
  }

  _addPlaceMarker($container) {
    this.$placeMarker = $('<div>').appendTo($container);
  }

  _addToContainer($element) {
    var {
      $placeMarker,
      $container
    } = this;
    $placeMarker ? $placeMarker.replaceWith($element) : $element.appendTo($container);
  }

  _attachEvents() {
    throw 'Not implemented';
  }

  _create() {
    throw 'Not implemented';
  }

  _isRendered() {
    return !!this.instance;
  }

  _isVisible() {
    var {
      editor,
      options
    } = this;
    return options.visible || !editor.option('readOnly');
  }

  _isDisabled() {
    throw 'Not implemented';
  }

  _shouldRender() {
    return this._isVisible() && !this._isRendered();
  }

  dispose() {
    var {
      instance,
      $placeMarker
    } = this;

    if (instance) {
      // TODO: instance.dispose()
      instance.dispose ? instance.dispose() : instance.remove();
      this.instance = null;
    }

    $placeMarker && $placeMarker.remove();
  }

  render() {
    var $container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.$container;
    this.$container = $container;

    if (this._isVisible()) {
      var {
        instance,
        $element
      } = this._create();

      this.instance = instance;

      this._attachEvents(instance, $element);
    } else {
      this._addPlaceMarker($container);
    }
  }

  update() {
    if (this._shouldRender()) {
      this.render();
    }

    return !!this.instance;
  }

}
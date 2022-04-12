import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import eventsEngine from '../../events/core/events_engine';
import messageLocalization from '../../localization/message';
import TextEditorButton from '../text_box/texteditor_button_collection/button';
import Button from '../button';
var DROP_DOWN_EDITOR_BUTTON_CLASS = 'dx-dropdowneditor-button';
var DROP_DOWN_EDITOR_BUTTON_VISIBLE = 'dx-dropdowneditor-button-visible';
var BUTTON_MESSAGE = 'dxDropDownEditor-selectLabel';
export default class DropDownButton extends TextEditorButton {
  constructor(name, editor, options) {
    super(name, editor, options);
    this.currentTemplate = null;
  }

  _attachEvents(instance) {
    var {
      editor
    } = this;
    instance.option('onClick', e => {
      !editor.option('openOnFieldClick') && editor._openHandler(e);
    });
    eventsEngine.on(instance.$element(), 'mousedown', e => {
      if (editor.$element().is('.dx-state-focused')) {
        e.preventDefault();
      }
    });
  }

  _create() {
    var {
      editor
    } = this;
    var $element = $('<div>');

    var options = this._getOptions();

    this._addToContainer($element);

    var instance = editor._createComponent($element, Button, extend({}, options, {
      elementAttr: {
        'aria-label': messageLocalization.format(BUTTON_MESSAGE)
      }
    }));

    this._legacyRender(editor.$element(), $element, options.visible);

    return {
      $element,
      instance
    };
  }

  _getOptions() {
    var {
      editor
    } = this;

    var visible = this._isVisible();

    var isReadOnly = editor.option('readOnly');
    var options = {
      focusStateEnabled: false,
      hoverStateEnabled: false,
      activeStateEnabled: false,
      useInkRipple: false,
      disabled: isReadOnly,
      visible
    };

    this._addTemplate(options);

    return options;
  }

  _isVisible() {
    var {
      editor
    } = this;
    return super._isVisible() && editor.option('showDropDownButton');
  } // TODO: get rid of it


  _legacyRender($editor, $element, isVisible) {
    $editor.toggleClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE, isVisible);

    if ($element) {
      $element.removeClass('dx-button').addClass(DROP_DOWN_EDITOR_BUTTON_CLASS);
    }
  }

  _isSameTemplate() {
    return this.editor.option('dropDownButtonTemplate') === this.currentTemplate;
  }

  _addTemplate(options) {
    if (!this._isSameTemplate()) {
      options.template = this.editor._getTemplateByOption('dropDownButtonTemplate');
      this.currentTemplate = this.editor.option('dropDownButtonTemplate');
    }
  }

  update() {
    var shouldUpdate = super.update();

    if (shouldUpdate) {
      var {
        editor,
        instance
      } = this;
      var $editor = editor.$element();

      var options = this._getOptions();

      instance === null || instance === void 0 ? void 0 : instance.option(options);

      this._legacyRender($editor, instance === null || instance === void 0 ? void 0 : instance.$element(), options.visible);
    }
  }

}
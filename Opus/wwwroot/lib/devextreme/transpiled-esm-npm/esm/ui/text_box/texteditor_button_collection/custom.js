import $ from '../../../core/renderer';
import TextEditorButton from './button';
import Button from '../../button';
import { extend } from '../../../core/utils/extend';
import eventsEngine from '../../../events/core/events_engine';
import { start, end } from '../../../events/hover';
import { name as clickEventName } from '../../../events/click';
var CUSTOM_BUTTON_HOVERED_CLASS = 'dx-custom-button-hovered';
export default class CustomButton extends TextEditorButton {
  _attachEvents(instance, $element) {
    var {
      editor
    } = this;
    eventsEngine.on($element, start, () => {
      editor.$element().addClass(CUSTOM_BUTTON_HOVERED_CLASS);
    });
    eventsEngine.on($element, end, () => {
      editor.$element().removeClass(CUSTOM_BUTTON_HOVERED_CLASS);
    });
    eventsEngine.on($element, clickEventName, e => {
      e.stopPropagation();
    });
  }

  _create() {
    var {
      editor
    } = this;
    var $element = $('<div>');

    this._addToContainer($element);

    var instance = editor._createComponent($element, Button, extend({}, this.options, {
      ignoreParentReadOnly: true,
      disabled: this._isDisabled(),
      integrationOptions: this._prepareIntegrationOptions(editor)
    }));

    return {
      $element,
      instance
    };
  }

  _prepareIntegrationOptions(editor) {
    return extend({}, editor.option('integrationOptions'), {
      skipTemplates: ['content']
    });
  }

  update() {
    var isUpdated = super.update();

    if (this.instance) {
      this.instance.option('disabled', this._isDisabled());
    }

    return isUpdated;
  }

  _isVisible() {
    var {
      editor
    } = this;
    return editor.option('visible');
  }

  _isDisabled() {
    var isDefinedByUser = this.options.disabled !== undefined;

    if (isDefinedByUser) {
      return this.instance ? this.instance.option('disabled') : this.options.disabled;
    } else {
      return this.editor.option('readOnly');
    }
  }

}
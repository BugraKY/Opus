import $ from '../../../core/renderer';
import CustomButton from './custom';
import { extend } from '../../../core/utils/extend';
import { find } from '../../../core/utils/array';
import errors from '../../widget/ui.errors';
var TEXTEDITOR_BUTTONS_CONTAINER_CLASS = 'dx-texteditor-buttons-container';

function checkButtonInfo(buttonInfo) {
  var checkButtonType = () => {
    if (!buttonInfo || typeof buttonInfo !== 'object' || Array.isArray(buttonInfo)) {
      throw errors.Error('E1053');
    }
  };

  var checkLocation = () => {
    var {
      location
    } = buttonInfo;

    if ('location' in buttonInfo && location !== 'after' && location !== 'before') {
      buttonInfo.location = 'after';
    }
  };

  var checkNameIsDefined = () => {
    if (!('name' in buttonInfo)) {
      throw errors.Error('E1054');
    }
  };

  var checkNameIsString = () => {
    var {
      name
    } = buttonInfo;

    if (typeof name !== 'string') {
      throw errors.Error('E1055');
    }
  };

  checkButtonType();
  checkNameIsDefined();
  checkNameIsString();
  checkLocation();
}

function checkNamesUniqueness(existingNames, newName) {
  if (existingNames.indexOf(newName) !== -1) {
    throw errors.Error('E1055', newName);
  }

  existingNames.push(newName);
}

function isPredefinedButtonName(name, predefinedButtonsInfo) {
  return !!find(predefinedButtonsInfo, info => info.name === name);
}

export default class TextEditorButtonCollection {
  constructor(editor, defaultButtonsInfo) {
    this.buttons = [];
    this.defaultButtonsInfo = defaultButtonsInfo;
    this.editor = editor;
  }

  _compileButtonInfo(buttons) {
    var names = [];
    return buttons.map(button => {
      var isStringButton = typeof button === 'string';

      if (!isStringButton) {
        checkButtonInfo(button);
      }

      var isDefaultButton = isStringButton || isPredefinedButtonName(button.name, this.defaultButtonsInfo);

      if (isDefaultButton) {
        var defaultButtonInfo = find(this.defaultButtonsInfo, _ref => {
          var {
            name
          } = _ref;
          return name === button || name === button.name;
        });

        if (!defaultButtonInfo) {
          throw errors.Error('E1056', this.editor.NAME, button);
        }

        checkNamesUniqueness(names, button);
        return defaultButtonInfo;
      } else {
        var {
          name
        } = button;
        checkNamesUniqueness(names, name);
        return extend(button, {
          Ctor: CustomButton
        });
      }
    });
  }

  _createButton(buttonsInfo) {
    var {
      Ctor,
      options,
      name
    } = buttonsInfo;
    var button = new Ctor(name, this.editor, options);
    this.buttons.push(button);
    return button;
  }

  _renderButtons(buttons, $container, targetLocation) {
    var $buttonsContainer = null;
    var buttonsInfo = buttons ? this._compileButtonInfo(buttons) : this.defaultButtonsInfo;

    var getButtonsContainer = () => {
      $buttonsContainer = $buttonsContainer || $('<div>').addClass(TEXTEDITOR_BUTTONS_CONTAINER_CLASS);
      targetLocation === 'before' ? $container.prepend($buttonsContainer) : $container.append($buttonsContainer);
      return $buttonsContainer;
    };

    buttonsInfo.forEach(buttonsInfo => {
      var {
        location = 'after'
      } = buttonsInfo;

      if (location === targetLocation) {
        this._createButton(buttonsInfo).render(getButtonsContainer());
      }
    });
    return $buttonsContainer;
  }

  clean() {
    this.buttons.forEach(button => button.dispose());
    this.buttons = [];
  }

  getButton(buttonName) {
    var button = find(this.buttons, _ref2 => {
      var {
        name
      } = _ref2;
      return name === buttonName;
    });
    return button && button.instance;
  }

  renderAfterButtons(buttons, $container) {
    return this._renderButtons(buttons, $container, 'after');
  }

  renderBeforeButtons(buttons, $container) {
    return this._renderButtons(buttons, $container, 'before');
  }

  updateButtons(names) {
    this.buttons.forEach(button => {
      if (!names || names.indexOf(button.name) !== -1) {
        button.update();
      }
    });
  }

}
import { getHeight, setHeight } from '../core/utils/size';
import $ from '../core/renderer';
import { getWindow } from '../core/utils/window';
var window = getWindow();
import devices from '../core/devices';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import Widget from './widget/ui.widget';
import Button from './button';
import Popover from './popover';
import DataHelperMixin from '../data_helper';
import List from './list_light';
import { isMaterial } from './themes';
import { ChildDefaultTemplate } from '../core/templates/child_default_template';
import { toggleItemFocusableElementTabIndex } from './toolbar/ui.toolbar.utils';
var DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';
var DROP_DOWN_MENU_POPUP_CLASS = 'dx-dropdownmenu-popup';
var DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = 'dx-dropdownmenu-popup-wrapper';
var DROP_DOWN_MENU_LIST_CLASS = 'dx-dropdownmenu-list';
var DROP_DOWN_MENU_BUTTON_CLASS = 'dx-dropdownmenu-button';
var POPUP_OPTION_MAP = {
  'popupWidth': 'width',
  'popupHeight': 'height',
  'popupMaxHeight': 'maxHeight',
  'popupAutoResizeEnabled': 'autoResizeEnabled'
};
var BUTTON_OPTION_MAP = {
  'buttonIcon': 'icon',
  'buttonText': 'text',
  'buttonWidth': 'width',
  'buttonHeight': 'height',
  'buttonTemplate': 'template'
};
var DropDownMenu = Widget.inherit({
  _supportedKeys: function _supportedKeys() {
    var extension = {};

    if (!this.option('opened') || !this._list.option('focusedElement')) {
      extension = this._button._supportedKeys();
    }

    return extend(this.callBase(), extension, {
      tab: function tab() {
        this._popup && this._popup.hide();
      }
    });
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      items: [],
      onItemClick: null,
      dataSource: null,
      itemTemplate: 'item',
      buttonText: '',
      buttonIcon: 'overflow',
      buttonWidth: undefined,
      buttonHeight: undefined,
      buttonTemplate: 'content',
      onButtonClick: null,
      usePopover: false,
      popupWidth: 'auto',
      popupHeight: 'auto',
      activeStateEnabled: true,
      hoverStateEnabled: true,
      opened: false,
      selectionMode: 'none',
      selectedItemKeys: [],
      deferRendering: false,
      popupPosition: {
        my: 'top center',
        at: 'bottom center',
        collision: 'fit flip',
        offset: {
          v: 1
        }
      },
      popupAnimation: undefined,
      onItemRendered: null,
      menuWidget: List,
      popupMaxHeight: undefined,
      closeOnClick: true,
      useInkRipple: false,
      container: undefined,
      popupAutoResizeEnabled: false
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: {
        platform: 'ios'
      },
      options: {
        usePopover: true
      }
    }, {
      device: {
        platform: 'generic'
      },
      options: {
        popupPosition: {
          offset: {
            v: 4
          }
        }
      }
    }, {
      device: function device() {
        return devices.real().deviceType === 'desktop' && !devices.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device: {
        platform: 'android'
      },
      options: {
        popupPosition: {
          my: 'top ' + (this.option('rtlEnabled') ? 'left' : 'right'),
          at: 'top ' + (this.option('rtlEnabled') ? 'left' : 'right'),
          collision: 'flipfit'
        },
        popupAnimation: {
          show: {
            type: 'pop',
            duration: 200,
            from: {
              scale: 0
            },
            to: {
              scale: 1
            }
          },
          hide: {
            type: 'pop',
            duration: 200,
            from: {
              scale: 1
            },
            to: {
              scale: 0
            }
          }
        }
      }
    }, {
      device: function device() {
        return isMaterial();
      },
      options: {
        useInkRipple: true
      }
    }]);
  },
  _initOptions: function _initOptions(options) {
    if (devices.current().platform === 'android') {
      if (!options.popupPosition) {
        options.popupPosition = {
          at: (options.usePopover ? 'bottom ' : 'top ') + (options.rtlEnabled ? 'left' : 'right')
        };
      }
    }

    this.callBase(options);
  },
  _dataSourceOptions: function _dataSourceOptions() {
    return {
      paginate: false
    };
  },
  _init: function _init() {
    this.callBase();
    this.$element().addClass(DROP_DOWN_MENU_CLASS);

    this._initDataSource();

    this._initItemClickAction();

    this._initButtonClickAction();
  },
  _initItemClickAction: function _initItemClickAction() {
    this._itemClickAction = this._createActionByOption('onItemClick');
  },
  _initButtonClickAction: function _initButtonClickAction() {
    this._buttonClickAction = this._createActionByOption('onButtonClick');
  },
  _initTemplates: function _initTemplates() {
    this._templateManager.addDefaultTemplates({
      content: new ChildDefaultTemplate('content')
    });

    this.callBase();
  },
  _initMarkup: function _initMarkup() {
    this._renderButton();

    this.callBase();
  },
  _render: function _render() {
    this.callBase();
    this.setAria({
      'role': 'menubar',
      'haspopup': true,
      'expanded': this.option('opened')
    });
  },
  _renderContentImpl: function _renderContentImpl() {
    if (this.option('opened')) {
      this._renderPopup();
    }
  },
  _clean: function _clean() {
    this._cleanFocusState();

    if (this._popup) {
      this._popup.$element().remove();

      delete this._$popup;
    }
  },
  _renderButton: function _renderButton() {
    var $button = this.$element().addClass(DROP_DOWN_MENU_BUTTON_CLASS);

    var config = this._buttonOptions();

    this._button = this._createComponent($button, Button, config);
  },
  _toggleActiveState: function _toggleActiveState($element, value, e) {
    this._button._toggleActiveState($element, value, e);
  },
  _buttonOptions: function _buttonOptions() {
    return {
      text: this.option('buttonText'),
      icon: this.option('buttonIcon'),
      width: this.option('buttonWidth'),
      height: this.option('buttonHeight'),
      useInkRipple: this.option('useInkRipple'),
      template: this.option('buttonTemplate'),
      hoverStateEnabled: false,
      focusStateEnabled: false,
      onClick: function (e) {
        this.option('opened', !this.option('opened'));

        this._buttonClickAction(e);
      }.bind(this)
    };
  },
  _toggleMenuVisibility: function _toggleMenuVisibility(opened) {
    var state = opened === undefined ? !this._popup.option('visible') : opened;

    if (opened) {
      this._renderPopup();
    }

    this._popup.toggle(state);

    this.setAria('expanded', state);
  },
  _renderPopup: function _renderPopup() {
    if (this._$popup) {
      return;
    }

    var $popup = this._$popup = $('<div>').appendTo(this.$element());

    var config = this._popupOptions();

    this._popup = this._createComponent($popup, Popover, config); // TODO: Circular dep
  },
  _popupOptions: function _popupOptions() {
    var usePopup = !this.option('usePopover');
    return {
      onInitialized: function onInitialized(args) {
        args.component.$wrapper().addClass(DROP_DOWN_MENU_POPUP_WRAPPER_CLASS).toggleClass(DROP_DOWN_MENU_POPUP_CLASS, usePopup);
      },
      visible: this.option('opened'),
      deferRendering: false,
      contentTemplate: function (contentElement) {
        this._renderList(contentElement);
      }.bind(this),
      position: this.option('popupPosition'),
      animation: this.option('popupAnimation'),
      onOptionChanged: function (args) {
        if (args.name === 'visible') {
          this.option('opened', args.value);
        }
      }.bind(this),
      target: this.$element(),
      height: this.option('popupHeight'),
      width: this.option('popupWidth'),
      maxHeight: this.option('popupMaxHeight'),
      container: this.option('container'),
      autoResizeEnabled: this.option('popupAutoResizeEnabled')
    };
  },
  _renderList: function _renderList(contentElement) {
    var $content = $(contentElement);

    var listConfig = this._listOptions();

    $content.addClass(DROP_DOWN_MENU_LIST_CLASS);
    this._list = this._createComponent($content, this.option('menuWidget'), listConfig); // todo: replace with option

    this._list._getAriaTarget = function () {
      return this.$element();
    }.bind(this);

    this._setListDataSource();

    var listMaxHeight = getHeight(window) * 0.5;

    if (getHeight($content) > listMaxHeight) {
      setHeight($content, listMaxHeight);
    }
  },
  _itemOptionChanged: function _itemOptionChanged(item, property, value) {
    var _this$_list;

    (_this$_list = this._list) === null || _this$_list === void 0 ? void 0 : _this$_list._itemOptionChanged(item, property, value);
    toggleItemFocusableElementTabIndex(this._list, item);
  },
  _listOptions: function _listOptions() {
    return {
      pageLoadMode: 'scrollBottom',
      indicateLoading: false,
      noDataText: '',
      selectionMode: this.option('selectionMode'),
      selectedItemKeys: this.option('selectedItemKeys'),
      itemTemplate: this.option('itemTemplate'),
      onItemClick: function (e) {
        if (this.option('closeOnClick')) {
          this.option('opened', false);
        }

        this._itemClickAction(e);
      }.bind(this),
      tabIndex: -1,
      focusStateEnabled: this.option('focusStateEnabled'),
      activeStateEnabled: this.option('activeStateEnabled'),
      onItemRendered: this.option('onItemRendered'),
      _itemAttributes: {
        role: 'menuitem'
      }
    };
  },
  _setListDataSource: function _setListDataSource() {
    if (this._list) {
      this._list.option('dataSource', this._dataSource || this.option('items'));
    }

    delete this._deferRendering;
  },

  _getKeyboardListeners() {
    return this.callBase().concat([this._list]);
  },

  _toggleVisibility: function _toggleVisibility(visible) {
    this.callBase(visible);

    this._button.option('visible', visible);
  },
  _optionChanged: function _optionChanged(args) {
    var name = args.name;
    var value = args.value;

    switch (name) {
      case 'items':
      case 'dataSource':
        if (this.option('deferRendering') && !this.option('opened')) {
          this._deferRendering = true;
        } else {
          this._refreshDataSource();

          this._setListDataSource();
        }

        break;

      case 'itemTemplate':
        if (this._list) {
          this._list.option(name, this._getTemplate(value));
        }

        break;

      case 'onItemClick':
        this._initItemClickAction();

        break;

      case 'onButtonClick':
        this._buttonClickAction();

        break;

      case 'buttonIcon':
      case 'buttonText':
      case 'buttonWidth':
      case 'buttonHeight':
      case 'buttonTemplate':
        this._button.option(BUTTON_OPTION_MAP[name], value);

        this._renderPopup();

        break;

      case 'popupWidth':
      case 'popupHeight':
      case 'popupMaxHeight':
      case 'popupAutoResizeEnabled':
        this._popup.option(POPUP_OPTION_MAP[name], value);

        break;

      case 'usePopover':
      case 'menuWidget':
      case 'useInkRipple':
        this._invalidate();

        break;

      case 'focusStateEnabled':
      case 'activeStateEnabled':
        if (this._list) {
          this._list.option(name, value);
        }

        this.callBase(args);
        break;

      case 'selectionMode':
      case 'selectedItemKeys':
      case 'onItemRendered':
        if (this._list) {
          this._list.option(name, value);
        }

        break;

      case 'opened':
        if (this._deferRendering) {
          this._refreshDataSource();

          this._setListDataSource();
        }

        this._toggleMenuVisibility(value);

        this._updateFocusableItemsTabIndex();

        break;

      case 'deferRendering':
      case 'popupPosition':
      case 'closeOnClick':
        break;

      case 'container':
        this._popup && this._popup.option(args.name, args.value);
        break;

      case 'disabled':
        if (this._list) {
          this._updateFocusableItemsTabIndex();
        }

        break;

      default:
        this.callBase(args);
    }
  },

  _updateFocusableItemsTabIndex() {
    this.option('items').forEach(item => toggleItemFocusableElementTabIndex(this._list, item));
  },

  open: function open() {
    this.option('opened', true);
  },
  close: function close() {
    this.option('opened', false);
  }
}).include(DataHelperMixin);
registerComponent('dxDropDownMenu', DropDownMenu);
export default DropDownMenu;
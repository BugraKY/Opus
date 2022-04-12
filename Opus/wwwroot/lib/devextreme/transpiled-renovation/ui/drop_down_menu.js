"use strict";

exports.default = void 0;

var _size = require("../core/utils/size");

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _window = require("../core/utils/window");

var _devices = _interopRequireDefault(require("../core/devices"));

var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));

var _extend = require("../core/utils/extend");

var _ui = _interopRequireDefault(require("./widget/ui.widget"));

var _button = _interopRequireDefault(require("./button"));

var _popover = _interopRequireDefault(require("./popover"));

var _data_helper = _interopRequireDefault(require("../data_helper"));

var _list_light = _interopRequireDefault(require("./list_light"));

var _themes = require("./themes");

var _child_default_template = require("../core/templates/child_default_template");

var _uiToolbar = require("./toolbar/ui.toolbar.utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var window = (0, _window.getWindow)();
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

var DropDownMenu = _ui.default.inherit({
  _supportedKeys: function _supportedKeys() {
    var extension = {};

    if (!this.option('opened') || !this._list.option('focusedElement')) {
      extension = this._button._supportedKeys();
    }

    return (0, _extend.extend)(this.callBase(), extension, {
      tab: function tab() {
        this._popup && this._popup.hide();
      }
    });
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
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
      menuWidget: _list_light.default,
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
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
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
        return (0, _themes.isMaterial)();
      },
      options: {
        useInkRipple: true
      }
    }]);
  },
  _initOptions: function _initOptions(options) {
    if (_devices.default.current().platform === 'android') {
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
      content: new _child_default_template.ChildDefaultTemplate('content')
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

    this._button = this._createComponent($button, _button.default, config);
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

    var $popup = this._$popup = (0, _renderer.default)('<div>').appendTo(this.$element());

    var config = this._popupOptions();

    this._popup = this._createComponent($popup, _popover.default, config); // TODO: Circular dep
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
    var $content = (0, _renderer.default)(contentElement);

    var listConfig = this._listOptions();

    $content.addClass(DROP_DOWN_MENU_LIST_CLASS);
    this._list = this._createComponent($content, this.option('menuWidget'), listConfig); // todo: replace with option

    this._list._getAriaTarget = function () {
      return this.$element();
    }.bind(this);

    this._setListDataSource();

    var listMaxHeight = (0, _size.getHeight)(window) * 0.5;

    if ((0, _size.getHeight)($content) > listMaxHeight) {
      (0, _size.setHeight)($content, listMaxHeight);
    }
  },
  _itemOptionChanged: function _itemOptionChanged(item, property, value) {
    var _this$_list;

    (_this$_list = this._list) === null || _this$_list === void 0 ? void 0 : _this$_list._itemOptionChanged(item, property, value);
    (0, _uiToolbar.toggleItemFocusableElementTabIndex)(this._list, item);
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
  _getKeyboardListeners: function _getKeyboardListeners() {
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
  _updateFocusableItemsTabIndex: function _updateFocusableItemsTabIndex() {
    var _this = this;

    this.option('items').forEach(function (item) {
      return (0, _uiToolbar.toggleItemFocusableElementTabIndex)(_this._list, item);
    });
  },
  open: function open() {
    this.option('opened', true);
  },
  close: function close() {
    this.option('opened', false);
  }
}).include(_data_helper.default);

(0, _component_registrator.default)('dxDropDownMenu', DropDownMenu);
var _default = DropDownMenu;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
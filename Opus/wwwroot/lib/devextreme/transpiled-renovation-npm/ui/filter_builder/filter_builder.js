"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

var _class = _interopRequireDefault(require("../../core/class"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _extend = require("../../core/utils/extend");

var _message = _interopRequireDefault(require("../../localization/message"));

var _deferred = require("../../core/utils/deferred");

var _type = require("../../core/utils/type");

var _tree_view = _interopRequireDefault(require("../tree_view"));

var _popup = _interopRequireDefault(require("../popup"));

var _utils = require("../overlay/utils");

var _ui2 = _interopRequireDefault(require("../shared/ui.editor_factory_mixin"));

var _index = require("../../events/utils/index");

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// STYLE filterBuilder
var FILTER_BUILDER_CLASS = 'dx-filterbuilder';
var FILTER_BUILDER_GROUP_CLASS = FILTER_BUILDER_CLASS + '-group';
var FILTER_BUILDER_GROUP_ITEM_CLASS = FILTER_BUILDER_GROUP_CLASS + '-item';
var FILTER_BUILDER_GROUP_CONTENT_CLASS = FILTER_BUILDER_GROUP_CLASS + '-content';
var FILTER_BUILDER_GROUP_OPERATIONS_CLASS = FILTER_BUILDER_GROUP_CLASS + '-operations';
var FILTER_BUILDER_GROUP_OPERATION_CLASS = FILTER_BUILDER_GROUP_CLASS + '-operation';
var FILTER_BUILDER_ACTION_CLASS = FILTER_BUILDER_CLASS + '-action';
var FILTER_BUILDER_IMAGE_CLASS = FILTER_BUILDER_ACTION_CLASS + '-icon';
var FILTER_BUILDER_IMAGE_ADD_CLASS = 'dx-icon-plus';
var FILTER_BUILDER_IMAGE_REMOVE_CLASS = 'dx-icon-remove';
var FILTER_BUILDER_ITEM_TEXT_CLASS = FILTER_BUILDER_CLASS + '-text';
var FILTER_BUILDER_ITEM_FIELD_CLASS = FILTER_BUILDER_CLASS + '-item-field';
var FILTER_BUILDER_ITEM_OPERATION_CLASS = FILTER_BUILDER_CLASS + '-item-operation';
var FILTER_BUILDER_ITEM_VALUE_CLASS = FILTER_BUILDER_CLASS + '-item-value';
var FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS = FILTER_BUILDER_CLASS + '-item-value-text';
var FILTER_BUILDER_OVERLAY_CLASS = FILTER_BUILDER_CLASS + '-overlay';
var FILTER_BUILDER_FILTER_OPERATIONS_CLASS = FILTER_BUILDER_CLASS + '-operations';
var FILTER_BUILDER_FIELDS_CLASS = FILTER_BUILDER_CLASS + '-fields';
var FILTER_BUILDER_ADD_CONDITION_CLASS = FILTER_BUILDER_CLASS + '-add-condition';
var ACTIVE_CLASS = 'dx-state-active';
var FILTER_BUILDER_MENU_CUSTOM_OPERATION_CLASS = FILTER_BUILDER_CLASS + '-menu-custom-operation';
var SOURCE = 'filterBuilder';
var DISABLED_STATE_CLASS = 'dx-state-disabled';
var TAB_KEY = 'tab';
var ENTER_KEY = 'enter';
var ESCAPE_KEY = 'escape';
var ACTIONS = [{
  name: 'onEditorPreparing',
  config: {
    excludeValidators: ['disabled', 'readOnly'],
    category: 'rendering'
  }
}, {
  name: 'onEditorPrepared',
  config: {
    excludeValidators: ['disabled', 'readOnly'],
    category: 'rendering'
  }
}, {
  name: 'onValueChanged',
  config: {
    excludeValidators: ['disabled', 'readOnly']
  }
}];
var OPERATORS = {
  and: 'and',
  or: 'or',
  notAnd: '!and',
  notOr: '!or'
};

var EditorFactory = _class.default.inherit(_ui2.default);

var FilterBuilder = _ui.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      onEditorPreparing: null,
      onEditorPrepared: null,
      onValueChanged: null,
      fields: [],

      /**
       * @name dxFilterBuilderField.defaultFilterOperation
       * @type Enums.FilterBuilderFieldFilterOperations | string
       * @hidden
       */
      groupOperations: ['and', 'or', 'notAnd', 'notOr'],
      maxGroupLevel: undefined,
      value: null,
      allowHierarchicalFields: false,
      groupOperationDescriptions: {
        and: _message.default.format('dxFilterBuilder-and'),
        or: _message.default.format('dxFilterBuilder-or'),
        notAnd: _message.default.format('dxFilterBuilder-notAnd'),
        notOr: _message.default.format('dxFilterBuilder-notOr')
      },
      customOperations: [],
      closePopupOnTargetScroll: true,
      filterOperationDescriptions: {
        between: _message.default.format('dxFilterBuilder-filterOperationBetween'),
        equal: _message.default.format('dxFilterBuilder-filterOperationEquals'),
        notEqual: _message.default.format('dxFilterBuilder-filterOperationNotEquals'),
        lessThan: _message.default.format('dxFilterBuilder-filterOperationLess'),
        lessThanOrEqual: _message.default.format('dxFilterBuilder-filterOperationLessOrEquals'),
        greaterThan: _message.default.format('dxFilterBuilder-filterOperationGreater'),
        greaterThanOrEqual: _message.default.format('dxFilterBuilder-filterOperationGreaterOrEquals'),
        startsWith: _message.default.format('dxFilterBuilder-filterOperationStartsWith'),
        contains: _message.default.format('dxFilterBuilder-filterOperationContains'),
        notContains: _message.default.format('dxFilterBuilder-filterOperationNotContains'),
        endsWith: _message.default.format('dxFilterBuilder-filterOperationEndsWith'),
        isBlank: _message.default.format('dxFilterBuilder-filterOperationIsBlank'),
        isNotBlank: _message.default.format('dxFilterBuilder-filterOperationIsNotBlank')
      }
    });
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'closePopupOnTargetScroll':
        break;

      case 'onEditorPreparing':
      case 'onEditorPrepared':
      case 'onValueChanged':
        this._initActions();

        break;

      case 'customOperations':
        this._initCustomOperations();

        this._invalidate();

        break;

      case 'fields':
      case 'maxGroupLevel':
      case 'groupOperations':
      case 'allowHierarchicalFields':
      case 'groupOperationDescriptions':
      case 'filterOperationDescriptions':
        this._invalidate();

        break;

      case 'value':
        if (args.value !== args.previousValue) {
          var disableInvalidateForValue = this._disableInvalidateForValue;

          if (!disableInvalidateForValue) {
            this._initModel();

            this._invalidate();
          }

          this._disableInvalidateForValue = false;
          this.executeAction('onValueChanged', {
            value: args.value,
            previousValue: args.previousValue
          });
          this._disableInvalidateForValue = disableInvalidateForValue;
        }

        break;

      default:
        this.callBase(args);
    }
  },
  getFilterExpression: function getFilterExpression() {
    var fields = this._getNormalizedFields();

    var value = (0, _extend.extend)(true, [], this._model);
    return (0, _utils2.getFilterExpression)((0, _utils2.getNormalizedFilter)(value), fields, this._customOperations, SOURCE);
  },
  _getNormalizedFields: function _getNormalizedFields() {
    return (0, _utils2.getNormalizedFields)(this.option('fields'));
  },
  _updateFilter: function _updateFilter() {
    this._disableInvalidateForValue = true;
    var value = (0, _extend.extend)(true, [], this._model);
    var normalizedValue = (0, _utils2.getNormalizedFilter)(value);
    var oldValue = (0, _utils2.getNormalizedFilter)(this._getModel(this.option('value')));

    if (JSON.stringify(oldValue) !== JSON.stringify(normalizedValue)) {
      this.option('value', normalizedValue);
    }

    this._disableInvalidateForValue = false;

    this._fireContentReadyAction();
  },
  _init: function _init() {
    this._initCustomOperations();

    this._initModel();

    this._initEditorFactory();

    this._initActions();

    this.callBase();
  },
  _initEditorFactory: function _initEditorFactory() {
    this._editorFactory = new EditorFactory();
  },
  _initCustomOperations: function _initCustomOperations() {
    this._customOperations = (0, _utils2.getMergedOperations)(this.option('customOperations'), this.option('filterOperationDescriptions.between'), this);
  },
  _getDefaultGroupOperation: function _getDefaultGroupOperation() {
    var _this$option$, _this$option;

    return (_this$option$ = (_this$option = this.option('groupOperations')) === null || _this$option === void 0 ? void 0 : _this$option[0]) !== null && _this$option$ !== void 0 ? _this$option$ : OPERATORS.and;
  },
  _getModel: function _getModel(value) {
    return (0, _utils2.convertToInnerStructure)(value, this._customOperations, this._getDefaultGroupOperation());
  },
  _initModel: function _initModel() {
    this._model = this._getModel(this.option('value'));
  },
  _initActions: function _initActions() {
    var that = this;
    that._actions = {};
    ACTIONS.forEach(function (action) {
      var actionConfig = (0, _extend.extend)({}, action.config);
      that._actions[action.name] = that._createActionByOption(action.name, actionConfig);
    });
  },
  executeAction: function executeAction(actionName, options) {
    var action = this._actions[actionName];
    return action && action(options);
  },
  _initMarkup: function _initMarkup() {
    this.$element().addClass(FILTER_BUILDER_CLASS);
    this.callBase();

    this._createGroupElementByCriteria(this._model).appendTo(this.$element());
  },
  _createConditionElement: function _createConditionElement(condition, parent) {
    return (0, _renderer.default)('<div>').addClass(FILTER_BUILDER_GROUP_CLASS).append(this._createConditionItem(condition, parent));
  },
  _createGroupElementByCriteria: function _createGroupElementByCriteria(criteria, parent) {
    var groupLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var $group = this._createGroupElement(criteria, parent, groupLevel);

    var $groupContent = $group.find('.' + FILTER_BUILDER_GROUP_CONTENT_CLASS);
    var groupCriteria = (0, _utils2.getGroupCriteria)(criteria);

    for (var i = 0; i < groupCriteria.length; i++) {
      var innerCriteria = groupCriteria[i];

      if ((0, _utils2.isGroup)(innerCriteria)) {
        this._createGroupElementByCriteria(innerCriteria, criteria, groupLevel + 1).appendTo($groupContent);
      } else if ((0, _utils2.isCondition)(innerCriteria)) {
        this._createConditionElement(innerCriteria, criteria).appendTo($groupContent);
      }
    }

    return $group;
  },
  _createGroupElement: function _createGroupElement(criteria, parent, groupLevel) {
    var _this = this;

    var $groupItem = (0, _renderer.default)('<div>').addClass(FILTER_BUILDER_GROUP_ITEM_CLASS);
    var $groupContent = (0, _renderer.default)('<div>').addClass(FILTER_BUILDER_GROUP_CONTENT_CLASS);
    var $group = (0, _renderer.default)('<div>').addClass(FILTER_BUILDER_GROUP_CLASS).append($groupItem).append($groupContent);

    if (parent != null) {
      this._createRemoveButton(function () {
        (0, _utils2.removeItem)(parent, criteria);
        $group.remove();

        _this._updateFilter();
      }).appendTo($groupItem);
    }

    this._createGroupOperationButton(criteria).appendTo($groupItem);

    this._createAddButton(function () {
      var newGroup = (0, _utils2.createEmptyGroup)(_this._getDefaultGroupOperation());
      (0, _utils2.addItem)(newGroup, criteria);

      _this._createGroupElement(newGroup, criteria, groupLevel + 1).appendTo($groupContent);

      _this._updateFilter();
    }, function () {
      var field = _this.option('fields')[0];

      var newCondition = (0, _utils2.createCondition)(field, _this._customOperations);
      (0, _utils2.addItem)(newCondition, criteria);

      _this._createConditionElement(newCondition, criteria).appendTo($groupContent);

      _this._updateFilter();
    }, groupLevel).appendTo($groupItem);

    return $group;
  },
  _createButton: function _createButton(caption) {
    return (0, _renderer.default)('<div>').text(caption);
  },
  _createGroupOperationButton: function _createGroupOperationButton(criteria) {
    var _this2 = this;

    var groupOperations = this._getGroupOperations(criteria);

    var groupMenuItem = (0, _utils2.getGroupMenuItem)(criteria, groupOperations);
    var caption = groupMenuItem.text;
    var $operationButton = groupOperations && groupOperations.length < 2 ? this._createButton(caption).addClass(DISABLED_STATE_CLASS) : this._createButtonWithMenu({
      caption: caption,
      menu: {
        items: groupOperations,
        displayExpr: 'text',
        keyExpr: 'value',
        onItemClick: function onItemClick(e) {
          if (groupMenuItem !== e.itemData) {
            (0, _utils2.setGroupValue)(criteria, e.itemData.value);
            $operationButton.text(e.itemData.text);
            groupMenuItem = e.itemData;

            _this2._updateFilter();
          }
        },
        onContentReady: function onContentReady(e) {
          e.component.selectItem(groupMenuItem);
        },
        cssClass: FILTER_BUILDER_GROUP_OPERATIONS_CLASS
      }
    });
    return $operationButton.addClass(FILTER_BUILDER_ITEM_TEXT_CLASS).addClass(FILTER_BUILDER_GROUP_OPERATION_CLASS).attr('tabindex', 0);
  },
  _createButtonWithMenu: function _createButtonWithMenu(options) {
    var that = this;

    var removeMenu = function removeMenu() {
      that.$element().find('.' + ACTIVE_CLASS).removeClass(ACTIVE_CLASS);
      that.$element().find('.dx-overlay .dx-treeview').remove();
      that.$element().find('.dx-overlay').remove();
    };

    var rtlEnabled = this.option('rtlEnabled');

    var menuOnItemClickWrapper = function menuOnItemClickWrapper(handler) {
      return function (e) {
        handler(e);

        if (e.event.type === 'dxclick') {
          removeMenu();
        }
      };
    };

    var position = rtlEnabled ? 'right' : 'left';

    var $button = this._createButton(options.caption);

    (0, _extend.extend)(options.menu, {
      focusStateEnabled: true,
      selectionMode: 'single',
      onItemClick: menuOnItemClickWrapper(options.menu.onItemClick),
      onHiding: function onHiding(e) {
        $button.removeClass(ACTIVE_CLASS);
      },
      position: {
        my: position + ' top',
        at: position + ' bottom',
        offset: '0 1',
        of: $button,
        collision: 'flip'
      },
      animation: null,
      onHidden: function onHidden() {
        removeMenu();
      },
      cssClass: FILTER_BUILDER_OVERLAY_CLASS + ' ' + options.menu.cssClass,
      rtlEnabled: rtlEnabled
    });
    options.popup = {
      onShown: function onShown(info) {
        var treeViewElement = (0, _renderer.default)(info.component.content()).find('.dx-treeview');
        var treeView = treeViewElement.dxTreeView('instance');

        _events_engine.default.on(treeViewElement, 'keyup keydown', function (e) {
          var keyName = (0, _index.normalizeKeyName)(e);

          if (e.type === 'keydown' && keyName === TAB_KEY || e.type === 'keyup' && (keyName === ESCAPE_KEY || keyName === ENTER_KEY)) {
            info.component.hide();

            _events_engine.default.trigger(options.menu.position.of, 'focus');
          }
        });

        treeView.focus();
        treeView.option('focusedElement', null);
      }
    };

    this._subscribeOnClickAndEnterKey($button, function () {
      removeMenu();

      that._createPopupWithTreeView(options, that.$element());

      $button.addClass(ACTIVE_CLASS);
    });

    return $button;
  },
  _hasValueButton: function _hasValueButton(condition) {
    var customOperation = (0, _utils2.getCustomOperation)(this._customOperations, condition[1]);
    return customOperation ? customOperation.hasValue !== false : condition[2] !== null;
  },
  _createOperationButtonWithMenu: function _createOperationButtonWithMenu(condition, field) {
    var _this3 = this;

    var that = this;
    var availableOperations = (0, _utils2.getAvailableOperations)(field, this.option('filterOperationDescriptions'), this._customOperations);
    var currentOperation = (0, _utils2.getOperationFromAvailable)((0, _utils2.getOperationValue)(condition), availableOperations);

    var $operationButton = this._createButtonWithMenu({
      caption: currentOperation.text,
      menu: {
        items: availableOperations,
        displayExpr: 'text',
        onItemRendered: function onItemRendered(e) {
          e.itemData.isCustom && (0, _renderer.default)(e.itemElement).addClass(FILTER_BUILDER_MENU_CUSTOM_OPERATION_CLASS);
        },
        onContentReady: function onContentReady(e) {
          e.component.selectItem(currentOperation);
        },
        onItemClick: function onItemClick(e) {
          if (currentOperation !== e.itemData) {
            currentOperation = e.itemData;
            (0, _utils2.updateConditionByOperation)(condition, currentOperation.value, that._customOperations);
            var $valueButton = $operationButton.siblings().filter('.' + FILTER_BUILDER_ITEM_VALUE_CLASS);

            if (that._hasValueButton(condition)) {
              if ($valueButton.length !== 0) {
                $valueButton.remove();
              }

              that._createValueButton(condition, field).appendTo($operationButton.parent());
            } else {
              $valueButton.remove();
            }

            $operationButton.html(currentOperation.text);

            _this3._updateFilter();
          }
        },
        cssClass: FILTER_BUILDER_FILTER_OPERATIONS_CLASS
      }
    }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS).addClass(FILTER_BUILDER_ITEM_OPERATION_CLASS).attr('tabindex', 0);

    return $operationButton;
  },
  _createOperationAndValueButtons: function _createOperationAndValueButtons(condition, field, $item) {
    this._createOperationButtonWithMenu(condition, field).appendTo($item);

    if (this._hasValueButton(condition)) {
      this._createValueButton(condition, field).appendTo($item);
    }
  },
  _createFieldButtonWithMenu: function _createFieldButtonWithMenu(fields, condition, field) {
    var _this4 = this;

    var that = this;
    var allowHierarchicalFields = this.option('allowHierarchicalFields');
    var items = (0, _utils2.getItems)(fields, allowHierarchicalFields);
    var item = (0, _utils2.getField)(field.name || field.dataField, items);

    var getFullCaption = function getFullCaption(item, items) {
      return allowHierarchicalFields ? (0, _utils2.getCaptionWithParents)(item, items) : item.caption;
    };

    var $fieldButton = this._createButtonWithMenu({
      caption: getFullCaption(item, items),
      menu: {
        items: items,
        dataStructure: 'plain',
        keyExpr: 'id',
        parentId: 'parentId',
        displayExpr: 'caption',
        onItemClick: function onItemClick(e) {
          if (item !== e.itemData) {
            item = e.itemData;
            condition[0] = item.name || item.dataField;
            condition[2] = item.dataType === 'object' ? null : '';
            (0, _utils2.updateConditionByOperation)(condition, (0, _utils2.getDefaultOperation)(item), that._customOperations);
            $fieldButton.siblings().filter('.' + FILTER_BUILDER_ITEM_TEXT_CLASS).remove();

            that._createOperationAndValueButtons(condition, item, $fieldButton.parent());

            var caption = getFullCaption(item, e.component.option('items'));
            $fieldButton.html(caption);

            _this4._updateFilter();
          }
        },
        onContentReady: function onContentReady(e) {
          e.component.selectItem(item);
        },
        cssClass: FILTER_BUILDER_FIELDS_CLASS
      }
    }).addClass(FILTER_BUILDER_ITEM_TEXT_CLASS).addClass(FILTER_BUILDER_ITEM_FIELD_CLASS).attr('tabindex', 0);

    return $fieldButton;
  },
  _createConditionItem: function _createConditionItem(condition, parent) {
    var _this5 = this;

    var $item = (0, _renderer.default)('<div>').addClass(FILTER_BUILDER_GROUP_ITEM_CLASS);

    var fields = this._getNormalizedFields();

    var field = (0, _utils2.getField)(condition[0], fields);

    this._createRemoveButton(function () {
      (0, _utils2.removeItem)(parent, condition);
      var isSingleChild = $item.parent().children().length === 1;

      if (isSingleChild) {
        $item.parent().remove();
      } else {
        $item.remove();
      }

      _this5._updateFilter();
    }).appendTo($item);

    this._createFieldButtonWithMenu(fields, condition, field).appendTo($item);

    this._createOperationAndValueButtons(condition, field, $item);

    return $item;
  },
  _getGroupOperations: function _getGroupOperations(criteria) {
    var groupOperations = this.option('groupOperations');
    var groupOperationDescriptions = this.option('groupOperationDescriptions');

    if (!groupOperations || !groupOperations.length) {
      groupOperations = [(0, _utils2.getGroupValue)(criteria).replace('!', 'not')];
    }

    return groupOperations.map(function (operation) {
      return {
        text: groupOperationDescriptions[operation],
        value: OPERATORS[operation]
      };
    });
  },
  _createRemoveButton: function _createRemoveButton(handler) {
    var $removeButton = (0, _renderer.default)('<div>').addClass(FILTER_BUILDER_IMAGE_CLASS).addClass(FILTER_BUILDER_IMAGE_REMOVE_CLASS).addClass(FILTER_BUILDER_ACTION_CLASS).attr('tabindex', 0);

    this._subscribeOnClickAndEnterKey($removeButton, handler);

    return $removeButton;
  },
  _createAddButton: function _createAddButton(addGroupHandler, addConditionHandler, groupLevel) {
    var $button;
    var maxGroupLevel = this.option('maxGroupLevel');

    if ((0, _type.isDefined)(maxGroupLevel) && groupLevel >= maxGroupLevel) {
      $button = this._createButton();

      this._subscribeOnClickAndEnterKey($button, addConditionHandler);
    } else {
      $button = this._createButtonWithMenu({
        menu: {
          items: [{
            caption: _message.default.format('dxFilterBuilder-addCondition'),
            click: addConditionHandler
          }, {
            caption: _message.default.format('dxFilterBuilder-addGroup'),
            click: addGroupHandler
          }],
          displayExpr: 'caption',
          onItemClick: function onItemClick(e) {
            e.itemData.click();
          },
          cssClass: FILTER_BUILDER_ADD_CONDITION_CLASS
        }
      });
    }

    return $button.addClass(FILTER_BUILDER_IMAGE_CLASS).addClass(FILTER_BUILDER_IMAGE_ADD_CLASS).addClass(FILTER_BUILDER_ACTION_CLASS).attr('tabindex', 0);
  },
  _createValueText: function _createValueText(item, field, $container) {
    var that = this;
    var $text = (0, _renderer.default)('<div>').html('&nbsp;').addClass(FILTER_BUILDER_ITEM_VALUE_TEXT_CLASS).attr('tabindex', 0).appendTo($container);
    var value = item[2];
    var customOperation = (0, _utils2.getCustomOperation)(that._customOperations, item[1]);

    if (!customOperation && field.lookup) {
      (0, _utils2.getCurrentLookupValueText)(field, value, function (result) {
        (0, _utils2.renderValueText)($text, result);
      });
    } else {
      (0, _deferred.when)((0, _utils2.getCurrentValueText)(field, value, customOperation)).done(function (result) {
        (0, _utils2.renderValueText)($text, result, customOperation);
      });
    }

    that._subscribeOnClickAndEnterKey($text, function (e) {
      if (e.type === 'keyup') {
        e.stopPropagation();
      }

      that._createValueEditorWithEvents(item, field, $container);
    });

    return $text;
  },
  _updateConditionValue: function _updateConditionValue(item, value, callback) {
    var areValuesDifferent = item[2] !== value;

    if (areValuesDifferent) {
      item[2] = value;
    }

    callback();

    this._updateFilter();
  },
  _addDocumentKeyUp: function _addDocumentKeyUp($editor, handler) {
    var isComposing = false; // IME Composing going on

    var hasCompositionJustEnded = false; // Used to swallow keyup event related to compositionend

    var document = _dom_adapter.default.getDocument();

    var documentKeyUpHandler = function documentKeyUpHandler(e) {
      if (isComposing || hasCompositionJustEnded) {
        // IME composing fires
        hasCompositionJustEnded = false;
        return;
      }

      handler(e);
    };

    _events_engine.default.on(document, 'keyup', documentKeyUpHandler);

    var input = $editor.find('input');

    _events_engine.default.on(input, 'compositionstart', function () {
      isComposing = true;
    });

    _events_engine.default.on(input, 'compositionend', function () {
      isComposing = false; // some browsers (IE, Firefox, Safari) send a keyup event after
      // compositionend, some (Chrome, Edge) don't. This is to swallow
      // the next keyup event, unless a keydown event happens first

      hasCompositionJustEnded = true;
    }); // Safari on OS X may send a keydown of 229 after compositionend


    _events_engine.default.on(input, 'keydown', function (event) {
      if (event.which !== 229) {
        hasCompositionJustEnded = false;
      }
    });

    this._documentKeyUpHandler = documentKeyUpHandler;
  },
  _addDocumentClick: function _addDocumentClick($editor, closeEditorFunc) {
    var _this6 = this;

    var document = _dom_adapter.default.getDocument();

    var documentClickHandler = function documentClickHandler(e) {
      if (!_this6._isFocusOnEditorParts($editor, e.target)) {
        _events_engine.default.trigger($editor.find('input'), 'change');

        closeEditorFunc();
      }
    };

    _events_engine.default.on(document, 'dxpointerdown', documentClickHandler);

    this._documentClickHandler = documentClickHandler;
  },
  _isFocusOnEditorParts: function _isFocusOnEditorParts($editor, target) {
    var activeElement = target || _dom_adapter.default.getActiveElement();

    return (0, _renderer.default)(activeElement).closest($editor.children()).length || (0, _renderer.default)(activeElement).closest('.dx-dropdowneditor-overlay').length;
  },
  _removeEvents: function _removeEvents() {
    var document = _dom_adapter.default.getDocument();

    (0, _type.isDefined)(this._documentKeyUpHandler) && _events_engine.default.off(document, 'keyup', this._documentKeyUpHandler);
    (0, _type.isDefined)(this._documentClickHandler) && _events_engine.default.off(document, 'dxpointerdown', this._documentClickHandler);
  },
  _dispose: function _dispose() {
    this._removeEvents();

    this.callBase();
  },
  _createValueEditorWithEvents: function _createValueEditorWithEvents(item, field, $container) {
    var _this7 = this;

    var value = item[2];

    var createValueText = function createValueText() {
      $container.empty();

      _this7._removeEvents();

      return _this7._createValueText(item, field, $container);
    };

    var closeEditor = function closeEditor() {
      _this7._updateConditionValue(item, value, function () {
        createValueText();
      });
    };

    var options = {
      value: value === '' ? null : value,
      filterOperation: (0, _utils2.getOperationValue)(item),
      setValue: function setValue(data) {
        value = data === null ? '' : data;
      },
      closeEditor: closeEditor,
      text: $container.text()
    };
    $container.empty();

    var $editor = this._createValueEditor($container, field, options);

    _events_engine.default.trigger($editor.find('input').not(':hidden').eq(0), 'focus');

    this._removeEvents();

    this._addDocumentClick($editor, closeEditor);

    this._addDocumentKeyUp($editor, function (e) {
      var keyName = (0, _index.normalizeKeyName)(e);

      if (keyName === TAB_KEY) {
        if (_this7._isFocusOnEditorParts($editor)) {
          return;
        }

        _this7._updateConditionValue(item, value, function () {
          createValueText();

          if (e.shiftKey) {
            _events_engine.default.trigger($container.prev(), 'focus');
          }
        });
      }

      if (keyName === ESCAPE_KEY) {
        _events_engine.default.trigger(createValueText(), 'focus');
      }

      if (keyName === ENTER_KEY) {
        _this7._updateConditionValue(item, value, function () {
          _events_engine.default.trigger(createValueText(), 'focus');
        });
      }
    });

    this._fireContentReadyAction();
  },
  _createValueButton: function _createValueButton(item, field) {
    var $valueButton = (0, _renderer.default)('<div>').addClass(FILTER_BUILDER_ITEM_TEXT_CLASS).addClass(FILTER_BUILDER_ITEM_VALUE_CLASS);

    this._createValueText(item, field, $valueButton);

    return $valueButton;
  },
  _createValueEditor: function _createValueEditor($container, field, options) {
    var $editor = (0, _renderer.default)('<div>').attr('tabindex', 0).appendTo($container);
    var customOperation = (0, _utils2.getCustomOperation)(this._customOperations, options.filterOperation);
    var editorTemplate = customOperation && customOperation.editorTemplate ? customOperation.editorTemplate : field.editorTemplate;

    if (editorTemplate) {
      var template = this._getTemplate(editorTemplate);

      template.render({
        model: (0, _extend.extend)({
          field: field
        }, options),
        container: $editor
      });
    } else {
      this._editorFactory.createEditor.call(this, $editor, (0, _extend.extend)({}, field, options, {
        parentType: SOURCE
      }));
    }

    return $editor;
  },
  _createPopupWithTreeView: function _createPopupWithTreeView(options, $container) {
    var that = this;
    var $popup = (0, _renderer.default)('<div>').addClass(options.menu.cssClass).appendTo($container);

    this._createComponent($popup, _popup.default, {
      wrapperAttr: {
        class: options.menu.cssClass
      },
      onHiding: options.menu.onHiding,
      onHidden: options.menu.onHidden,
      rtlEnabled: options.menu.rtlEnabled,
      position: options.menu.position,
      animation: options.menu.animation,
      contentTemplate: function contentTemplate(contentElement) {
        var $menuContainer = (0, _renderer.default)('<div>').appendTo(contentElement);

        that._createComponent($menuContainer, _tree_view.default, options.menu); // T852701


        this.repaint();
      },
      _ignoreFunctionValueDeprecation: true,
      maxHeight: function maxHeight() {
        return (0, _utils.getElementMaxHeightByWindow)(options.menu.position.of);
      },
      visible: true,
      focusStateEnabled: false,
      hideOnParentScroll: this.option('closePopupOnTargetScroll'),
      closeOnOutsideClick: true,
      onShown: options.popup.onShown,
      shading: false,
      width: 'auto',
      height: 'auto',
      showTitle: false
    });
  },
  _subscribeOnClickAndEnterKey: function _subscribeOnClickAndEnterKey($button, handler) {
    _events_engine.default.on($button, 'dxclick', handler);

    _events_engine.default.on($button, 'keyup', function (e) {
      if ((0, _index.normalizeKeyName)(e) === ENTER_KEY) {
        handler(e);
      }
    });
  }
});

(0, _component_registrator.default)('dxFilterBuilder', FilterBuilder);
var _default = FilterBuilder;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
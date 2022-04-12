"use strict";

exports.default = void 0;

var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));

var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));

var _common = require("../core/utils/common");

var _extend = require("../core/utils/extend");

var _iterator = require("../core/utils/iterator");

var _validation_engine = _interopRequireDefault(require("./validation_engine"));

var _uiCollection_widget = _interopRequireDefault(require("./collection/ui.collection_widget.edit"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VALIDATION_SUMMARY_CLASS = 'dx-validationsummary';
var ITEM_CLASS = VALIDATION_SUMMARY_CLASS + '-item';
var ITEM_DATA_KEY = VALIDATION_SUMMARY_CLASS + '-item-data';

var ValidationSummary = _uiCollection_widget.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      /**
      * @name dxValidationSummaryOptions.focusStateEnabled
      * @hidden
      */
      focusStateEnabled: false,

      /**
      * @name dxValidationSummaryOptions.noDataText
      * @hidden
      */
      noDataText: null // Ignore comments

      /**
      * @name dxValidationSummaryOptions.dataSource
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.itemRender
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.activeStateEnabled
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.disabled
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.hint
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.itemHoldTimeout
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.rtlEnabled
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.selectedIndex
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.selectedItem
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.selectedItems
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.selectedItemKeys
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.keyExpr
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.visible
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.width
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.height
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.onItemHold
      * @hidden
      * @action
      */

      /**
      * @name dxValidationSummaryOptions.onItemRendered
      * @hidden
      * @action
      */

      /**
      * @name dxValidationSummaryOptions.onItemSelect
      * @hidden
      * @action
      */

      /**
      * @name dxValidationSummaryOptions.onSelectionChanged
      * @hidden
      * @action
      */

      /**
      * @name dxValidationSummaryOptions.onItemContextMenu
      * @hidden
      * @action
      */

      /**
      * @name dxValidationSummaryOptions.accessKey
      * @hidden
      */

      /**
      * @name dxValidationSummaryOptions.tabIndex
      * @hidden
      */

    });
  },
  _setOptionsByReference: function _setOptionsByReference() {
    this.callBase();
    (0, _extend.extend)(this._optionsByReference, {
      validationGroup: true
    });
  },
  _init: function _init() {
    this.callBase();

    this._initGroupRegistration();
  },
  _initGroupRegistration: function _initGroupRegistration() {
    var $element = this.$element();

    var group = this.option('validationGroup') || _validation_engine.default.findGroup($element, this._modelByElement($element));

    var groupConfig = _validation_engine.default.addGroup(group);

    this._unsubscribeGroup();

    this._groupWasInit = true;
    this._validationGroup = group;
    this.groupSubscription = this._groupValidationHandler.bind(this);
    groupConfig.on('validated', this.groupSubscription);
  },
  _unsubscribeGroup: function _unsubscribeGroup() {
    var groupConfig = _validation_engine.default.getGroupConfig(this._validationGroup);

    groupConfig && groupConfig.off('validated', this.groupSubscription);
  },
  _getOrderedItems: function _getOrderedItems(validators, items) {
    var orderedItems = [];
    (0, _iterator.each)(validators, function (_, validator) {
      var foundItems = (0, _common.grep)(items, function (item) {
        if (item.validator === validator) {
          return true;
        }
      });

      if (foundItems.length) {
        orderedItems = orderedItems.concat(foundItems);
      }
    });
    return orderedItems;
  },
  _groupValidationHandler: function _groupValidationHandler(params) {
    var _this = this;

    var items = this._getOrderedItems(params.validators, (0, _iterator.map)(params.brokenRules, function (rule) {
      return {
        text: rule.message,
        validator: rule.validator,
        index: rule.index
      };
    }));

    this.validators = params.validators;
    (0, _iterator.each)(this.validators, function (_, validator) {
      if (validator._validationSummary !== _this) {
        var handler = _this._itemValidationHandler.bind(_this);

        var disposingHandler = function disposingHandler() {
          validator.off('validated', handler);
          validator._validationSummary = null;
          handler = null;
        };

        validator.on('validated', handler);
        validator.on('disposing', disposingHandler);
        validator._validationSummary = _this;
      }
    });
    this.option('items', items);
  },
  _itemValidationHandler: function _itemValidationHandler(_ref) {
    var isValid = _ref.isValid,
        validator = _ref.validator,
        brokenRules = _ref.brokenRules;
    var items = this.option('items');
    var itemsChanged = false;
    var itemIndex = 0;

    var _loop = function _loop() {
      var item = items[itemIndex];

      if (item.validator === validator) {
        var foundRule = (0, _common.grep)(brokenRules || [], function (rule) {
          return rule.index === item.index;
        })[0];

        if (isValid || !foundRule) {
          items.splice(itemIndex, 1);
          itemsChanged = true;
          return "continue";
        }

        if (foundRule.message !== item.text) {
          item.text = foundRule.message;
          itemsChanged = true;
        }
      }

      itemIndex++;
    };

    while (itemIndex < items.length) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    }

    (0, _iterator.each)(brokenRules, function (_, rule) {
      var foundItem = (0, _common.grep)(items, function (item) {
        return item.validator === validator && item.index === rule.index;
      })[0];

      if (!foundItem) {
        items.push({
          text: rule.message,
          validator: validator,
          index: rule.index
        });
        itemsChanged = true;
      }
    });

    if (itemsChanged) {
      items = this._getOrderedItems(this.validators, items);
      this.option('items', items);
    }
  },
  _initMarkup: function _initMarkup() {
    this.$element().addClass(VALIDATION_SUMMARY_CLASS);
    this.callBase();
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'validationGroup':
        this._initGroupRegistration();

        break;

      default:
        this.callBase(args);
    }
  },
  _itemClass: function _itemClass() {
    return ITEM_CLASS;
  },
  _itemDataKey: function _itemDataKey() {
    return ITEM_DATA_KEY;
  },
  _postprocessRenderItem: function _postprocessRenderItem(params) {
    _events_engine.default.on(params.itemElement, 'click', function () {
      params.itemData.validator && params.itemData.validator.focus && params.itemData.validator.focus();
    });
  },
  _dispose: function _dispose() {
    this.callBase();

    this._unsubscribeGroup();
  }
  /**
  * @name dxValidationSummary.registerKeyHandler
  * @publicName registerKeyHandler(key, handler)
  * @hidden
  */

  /**
  * @name dxValidationSummary.getDataSource
  * @publicName getDataSource()
  * @hidden
  */

  /**
  * @name dxValidationSummary.focus
  * @publicName focus()
  * @hidden
  */

});

(0, _component_registrator.default)('dxValidationSummary', ValidationSummary);
var _default = ValidationSummary;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

exports.default = void 0;

var _size = require("../core/utils/size");

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));

var _fx = _interopRequireDefault(require("../animation/fx"));

var _click = require("../events/click");

var _devices = _interopRequireDefault(require("../core/devices"));

var _dom_adapter = _interopRequireDefault(require("../core/dom_adapter"));

var _extend = require("../core/utils/extend");

var _common = require("../core/utils/common");

var _element = require("../core/element");

var iteratorUtils = _interopRequireWildcard(require("../core/utils/iterator"));

var _type = require("../core/utils/type");

var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));

var _index = require("../events/utils/index");

var _uiCollection_widget = _interopRequireDefault(require("./collection/ui.collection_widget.live_update"));

var _deferred = require("../core/utils/deferred");

var _bindable_template = require("../core/templates/bindable_template");

var _icon = require("../core/utils/icon");

var _themes = require("./themes");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// STYLE accordion
var ACCORDION_CLASS = 'dx-accordion';
var ACCORDION_WRAPPER_CLASS = 'dx-accordion-wrapper';
var ACCORDION_ITEM_CLASS = 'dx-accordion-item';
var ACCORDION_ITEM_OPENED_CLASS = 'dx-accordion-item-opened';
var ACCORDION_ITEM_CLOSED_CLASS = 'dx-accordion-item-closed';
var ACCORDION_ITEM_TITLE_CLASS = 'dx-accordion-item-title';
var ACCORDION_ITEM_BODY_CLASS = 'dx-accordion-item-body';
var ACCORDION_ITEM_TITLE_CAPTION_CLASS = 'dx-accordion-item-title-caption';
var ACCORDION_ITEM_DATA_KEY = 'dxAccordionItemData';

var Accordion = _uiCollection_widget.default.inherit({
  _activeStateUnit: '.' + ACCORDION_ITEM_CLASS,
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      hoverStateEnabled: true,
      height: undefined,
      itemTitleTemplate: 'title',
      onItemTitleClick: null,
      selectedIndex: 0,
      collapsible: false,
      multiple: false,
      animationDuration: 300,
      deferRendering: true,
      selectionByClick: true,
      activeStateEnabled: true,
      _itemAttributes: {
        role: 'tab'
      },
      _animationEasing: 'ease'
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: function device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device: function device() {
        return (0, _themes.isMaterial)();
      },
      options: {
        animationDuration: 200,
        _animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }]);
  },
  _itemElements: function _itemElements() {
    return this._itemContainer().children(this._itemSelector());
  },
  _init: function _init() {
    this.callBase();
    this.option('selectionRequired', !this.option('collapsible'));
    this.option('selectionMode', this.option('multiple') ? 'multiple' : 'single');
    var $element = this.$element();
    $element.addClass(ACCORDION_CLASS);
    this._$container = (0, _renderer.default)('<div>').addClass(ACCORDION_WRAPPER_CLASS);
    $element.append(this._$container);
  },
  _initTemplates: function _initTemplates() {
    this.callBase();

    this._templateManager.addDefaultTemplates({
      title: new _bindable_template.BindableTemplate(function ($container, data) {
        if ((0, _type.isPlainObject)(data)) {
          var $iconElement = (0, _icon.getImageContainer)(data.icon);

          if ($iconElement) {
            $container.append($iconElement);
          }

          if ((0, _type.isDefined)(data.title) && !(0, _type.isPlainObject)(data.title)) {
            $container.append(_dom_adapter.default.createTextNode(data.title));
          }
        } else {
          if ((0, _type.isDefined)(data)) {
            $container.text(String(data));
          }
        }

        $container.wrapInner((0, _renderer.default)('<div>').addClass(ACCORDION_ITEM_TITLE_CAPTION_CLASS));
      }, ['title', 'icon'], this.option('integrationOptions.watchMethod'))
    });
  },
  _initMarkup: function _initMarkup() {
    var _this = this;

    this._deferredItems = [];
    this.callBase();
    this.setAria({
      'role': 'tablist',
      'multiselectable': this.option('multiple')
    });
    (0, _common.deferRender)(function () {
      var selectedItemIndices = _this._getSelectedItemIndices();

      _this._renderSelection(selectedItemIndices, []);
    });
  },
  _render: function _render() {
    this.callBase();

    this._updateItemHeightsWrapper(true);
  },
  _itemDataKey: function _itemDataKey() {
    return ACCORDION_ITEM_DATA_KEY;
  },
  _itemClass: function _itemClass() {
    return ACCORDION_ITEM_CLASS;
  },
  _itemContainer: function _itemContainer() {
    return this._$container;
  },
  _itemTitles: function _itemTitles() {
    return this._itemElements().find('.' + ACCORDION_ITEM_TITLE_CLASS);
  },
  _itemContents: function _itemContents() {
    return this._itemElements().find('.' + ACCORDION_ITEM_BODY_CLASS);
  },
  _getItemData: function _getItemData(target) {
    return (0, _renderer.default)(target).parent().data(this._itemDataKey()) || this.callBase.apply(this, arguments);
  },
  _executeItemRenderAction: function _executeItemRenderAction(itemData) {
    if (itemData.type) {
      return;
    }

    this.callBase.apply(this, arguments);
  },
  _itemSelectHandler: function _itemSelectHandler(e) {
    if ((0, _renderer.default)(e.target).closest(this._itemContents()).length) {
      return;
    }

    this.callBase.apply(this, arguments);
  },
  _afterItemElementDeleted: function _afterItemElementDeleted($item, deletedActionArgs) {
    this._deferredItems.splice(deletedActionArgs.itemIndex, 1);

    this.callBase.apply(this, arguments);
  },
  _renderItemContent: function _renderItemContent(args) {
    var itemTitle = this.callBase((0, _extend.extend)({}, args, {
      contentClass: ACCORDION_ITEM_TITLE_CLASS,
      templateProperty: 'titleTemplate',
      defaultTemplateName: this.option('itemTitleTemplate')
    }));

    this._attachItemTitleClickAction(itemTitle);

    var deferred = new _deferred.Deferred();

    if ((0, _type.isDefined)(this._deferredItems[args.index])) {
      this._deferredItems[args.index] = deferred;
    } else {
      this._deferredItems.push(deferred);
    }

    if (!this.option('deferRendering') || this._getSelectedItemIndices().indexOf(args.index) >= 0) {
      deferred.resolve();
    }

    deferred.done(this.callBase.bind(this, (0, _extend.extend)({}, args, {
      contentClass: ACCORDION_ITEM_BODY_CLASS,
      container: (0, _element.getPublicElement)((0, _renderer.default)('<div>').appendTo((0, _renderer.default)(itemTitle).parent()))
    })));
  },
  _attachItemTitleClickAction: function _attachItemTitleClickAction(itemTitle) {
    var eventName = (0, _index.addNamespace)(_click.name, this.NAME);

    _events_engine.default.off(itemTitle, eventName);

    _events_engine.default.on(itemTitle, eventName, this._itemTitleClickHandler.bind(this));
  },
  _itemTitleClickHandler: function _itemTitleClickHandler(e) {
    this._itemDXEventHandler(e, 'onItemTitleClick');
  },
  _renderSelection: function _renderSelection(addedSelection, removedSelection) {
    this._itemElements().addClass(ACCORDION_ITEM_CLOSED_CLASS);

    this.setAria('hidden', true, this._itemContents());

    this._updateItems(addedSelection, removedSelection);
  },
  _updateSelection: function _updateSelection(addedSelection, removedSelection) {
    this._updateItems(addedSelection, removedSelection);

    this._updateItemHeightsWrapper(false);
  },
  _updateItems: function _updateItems(addedSelection, removedSelection) {
    var _this2 = this;

    var $items = this._itemElements();

    iteratorUtils.each(addedSelection, function (_, index) {
      _this2._deferredItems[index].resolve();

      var $item = $items.eq(index).addClass(ACCORDION_ITEM_OPENED_CLASS).removeClass(ACCORDION_ITEM_CLOSED_CLASS);

      _this2.setAria('hidden', false, $item.find('.' + ACCORDION_ITEM_BODY_CLASS));
    });
    iteratorUtils.each(removedSelection, function (_, index) {
      var $item = $items.eq(index).removeClass(ACCORDION_ITEM_OPENED_CLASS);

      _this2.setAria('hidden', true, $item.find('.' + ACCORDION_ITEM_BODY_CLASS));
    });
  },
  _updateItemHeightsWrapper: function _updateItemHeightsWrapper(skipAnimation) {
    if (this.option('templatesRenderAsynchronously')) {
      this._animationTimer = setTimeout(function () {
        this._updateItemHeights(skipAnimation);
      }.bind(this));
    } else {
      this._updateItemHeights(skipAnimation);
    }
  },
  _updateItemHeights: function _updateItemHeights(skipAnimation) {
    var that = this;
    var deferredAnimate = that._deferredAnimate;

    var itemHeight = this._splitFreeSpace(this._calculateFreeSpace());

    clearTimeout(this._animationTimer);
    return _deferred.when.apply(_renderer.default, [].slice.call(this._itemElements()).map(function (item) {
      return that._updateItemHeight((0, _renderer.default)(item), itemHeight, skipAnimation);
    })).done(function () {
      if (deferredAnimate) {
        deferredAnimate.resolveWith(that);
      }
    });
  },
  _updateItemHeight: function _updateItemHeight($item, itemHeight, skipAnimation) {
    var $title = $item.children('.' + ACCORDION_ITEM_TITLE_CLASS);

    if (_fx.default.isAnimating($item)) {
      _fx.default.stop($item);
    }

    var startItemHeight = (0, _size.getOuterHeight)($item);
    var finalItemHeight;

    if ($item.hasClass(ACCORDION_ITEM_OPENED_CLASS)) {
      finalItemHeight = itemHeight + (0, _size.getOuterHeight)($title);

      if (!finalItemHeight) {
        (0, _size.setHeight)($item, 'auto');
        finalItemHeight = (0, _size.getOuterHeight)($item);
      }
    } else {
      finalItemHeight = (0, _size.getOuterHeight)($title);
    }

    return this._animateItem($item, startItemHeight, finalItemHeight, skipAnimation, !!itemHeight);
  },
  _animateItem: function _animateItem($element, startHeight, endHeight, skipAnimation, fixedHeight) {
    var d;

    if (skipAnimation || startHeight === endHeight) {
      $element.css('height', endHeight);
      d = new _deferred.Deferred().resolve();
    } else {
      d = _fx.default.animate($element, {
        type: 'custom',
        from: {
          height: startHeight
        },
        to: {
          height: endHeight
        },
        duration: this.option('animationDuration'),
        easing: this.option('_animationEasing')
      });
    }

    return d.done(function () {
      if ($element.hasClass(ACCORDION_ITEM_OPENED_CLASS) && !fixedHeight) {
        $element.css('height', '');
      }

      $element.not('.' + ACCORDION_ITEM_OPENED_CLASS).addClass(ACCORDION_ITEM_CLOSED_CLASS);
    });
  },
  _splitFreeSpace: function _splitFreeSpace(freeSpace) {
    if (!freeSpace) {
      return freeSpace;
    }

    return freeSpace / this.option('selectedItems').length;
  },
  _calculateFreeSpace: function _calculateFreeSpace() {
    var height = this.option('height');

    if (height === undefined || height === 'auto') {
      return;
    }

    var $titles = this._itemTitles();

    var itemsHeight = 0;
    iteratorUtils.each($titles, function (_, title) {
      itemsHeight += (0, _size.getOuterHeight)(title);
    });
    return (0, _size.getHeight)(this.$element()) - itemsHeight;
  },
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      this._dimensionChanged();
    }
  },
  _dimensionChanged: function _dimensionChanged() {
    this._updateItemHeights(true);
  },
  _clean: function _clean() {
    clearTimeout(this._animationTimer);
    this.callBase();
  },
  _tryParseItemPropertyName: function _tryParseItemPropertyName(fullName) {
    var matches = fullName.match(/.*\.(.*)/);

    if ((0, _type.isDefined)(matches) && matches.length >= 1) {
      return matches[1];
    }
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'items':
        this.callBase(args);

        if (this._tryParseItemPropertyName(args.fullName) === 'title') {
          this._renderSelection(this._getSelectedItemIndices(), []);
        }

        if (this._tryParseItemPropertyName(args.fullName) === 'visible') {
          this._updateItemHeightsWrapper(true);
        }

        if (this.option('repaintChangesOnly') === true && args.fullName === 'items') {
          this._updateItemHeightsWrapper(true);

          this._renderSelection(this._getSelectedItemIndices(), []);
        }

        break;

      case 'animationDuration':
      case 'onItemTitleClick':
      case '_animationEasing':
        break;

      case 'collapsible':
        this.option('selectionRequired', !this.option('collapsible'));
        break;

      case 'itemTitleTemplate':
      case 'height':
      case 'deferRendering':
        this._invalidate();

        break;

      case 'multiple':
        this.option('selectionMode', args.value ? 'multiple' : 'single');
        break;

      default:
        this.callBase(args);
    }
  },
  expandItem: function expandItem(index) {
    this._deferredAnimate = new _deferred.Deferred();
    this.selectItem(index);
    return this._deferredAnimate.promise();
  },
  collapseItem: function collapseItem(index) {
    this._deferredAnimate = new _deferred.Deferred();
    this.unselectItem(index);
    return this._deferredAnimate.promise();
  },
  updateDimensions: function updateDimensions() {
    return this._updateItemHeights(false);
  }
});

(0, _component_registrator.default)('dxAccordion', Accordion);
var _default = Accordion;
/**
 * @name dxAccordionItem
 * @inherits CollectionWidgetItem
 * @type object
 */

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
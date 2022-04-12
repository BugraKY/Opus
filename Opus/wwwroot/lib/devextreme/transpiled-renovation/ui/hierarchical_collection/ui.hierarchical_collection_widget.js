"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _data = require("../../core/utils/data");

var _extend = require("../../core/utils/extend");

var _iterator = require("../../core/utils/iterator");

var _devices = _interopRequireDefault(require("../../core/devices"));

var _icon = require("../../core/utils/icon");

var _ui = _interopRequireDefault(require("./ui.data_adapter"));

var _uiCollection_widget = _interopRequireDefault(require("../collection/ui.collection_widget.edit"));

var _bindable_template = require("../../core/templates/bindable_template");

var _type = require("../../core/utils/type");

var _common = require("../../core/utils/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DISABLED_STATE_CLASS = 'dx-state-disabled';

var HierarchicalCollectionWidget = _uiCollection_widget.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      keyExpr: 'id',
      displayExpr: 'text',
      selectedExpr: 'selected',
      disabledExpr: 'disabled',
      itemsExpr: 'items',
      hoverStateEnabled: true,
      parentIdExpr: 'parentId',
      expandedExpr: 'expanded'
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
    }]);
  },
  _init: function _init() {
    this.callBase();

    this._initAccessors();

    this._initDataAdapter();

    this._initDynamicTemplates();
  },
  _initDataSource: function _initDataSource() {
    this.callBase();
    this._dataSource && this._dataSource.paginate(false);
  },
  _initDataAdapter: function _initDataAdapter() {
    var accessors = this._createDataAdapterAccessors();

    this._dataAdapter = new _ui.default((0, _extend.extend)({
      dataAccessors: {
        getters: accessors.getters,
        setters: accessors.setters
      },
      items: this.option('items')
    }, this._getDataAdapterOptions()));
  },
  _getDataAdapterOptions: _common.noop,
  _initDynamicTemplates: function _initDynamicTemplates() {
    var that = this;

    this._templateManager.addDefaultTemplates({
      item: new _bindable_template.BindableTemplate(function ($container, itemData) {
        $container.html(itemData.html).append(this._getIconContainer(itemData)).append(this._getTextContainer(itemData)).append(this._getPopoutContainer(itemData));

        that._addContentClasses(itemData, $container.parent());
      }.bind(this), ['text', 'html', 'items', 'icon'], this.option('integrationOptions.watchMethod'), {
        'text': this._displayGetter,
        'items': this._itemsGetter
      })
    });
  },
  _getIconContainer: function _getIconContainer(itemData) {
    return itemData.icon ? (0, _icon.getImageContainer)(itemData.icon) : undefined;
  },
  _getTextContainer: function _getTextContainer(itemData) {
    return (0, _renderer.default)('<span>').text(itemData.text);
  },
  _getPopoutContainer: _common.noop,
  _addContentClasses: _common.noop,
  _initAccessors: function _initAccessors() {
    var that = this;
    (0, _iterator.each)(this._getAccessors(), function (_, accessor) {
      that._compileAccessor(accessor);
    });

    this._compileDisplayGetter();
  },
  _getAccessors: function _getAccessors() {
    return ['key', 'selected', 'items', 'disabled', 'parentId', 'expanded'];
  },
  _getChildNodes: function _getChildNodes(node) {
    var that = this;
    var arr = [];
    (0, _iterator.each)(node.internalFields.childrenKeys, function (_, key) {
      var childNode = that._dataAdapter.getNodeByKey(key);

      arr.push(childNode);
    });
    return arr;
  },
  _hasChildren: function _hasChildren(node) {
    return node && node.internalFields.childrenKeys.length;
  },
  _compileAccessor: function _compileAccessor(optionName) {
    var getter = '_' + optionName + 'Getter';
    var setter = '_' + optionName + 'Setter';
    var optionExpr = this.option(optionName + 'Expr');

    if (!optionExpr) {
      this[getter] = _common.noop;
      this[setter] = _common.noop;
      return;
    } else if ((0, _type.isFunction)(optionExpr)) {
      this[setter] = function (obj, value) {
        obj[optionExpr()] = value;
      };

      this[getter] = function (obj) {
        return obj[optionExpr()];
      };

      return;
    }

    this[getter] = (0, _data.compileGetter)(optionExpr);
    this[setter] = (0, _data.compileSetter)(optionExpr);
  },
  _createDataAdapterAccessors: function _createDataAdapterAccessors() {
    var that = this;
    var accessors = {
      getters: {},
      setters: {}
    };
    (0, _iterator.each)(this._getAccessors(), function (_, accessor) {
      var getterName = '_' + accessor + 'Getter';
      var setterName = '_' + accessor + 'Setter';
      var newAccessor = accessor === 'parentId' ? 'parentKey' : accessor;
      accessors.getters[newAccessor] = that[getterName];
      accessors.setters[newAccessor] = that[setterName];
    });
    accessors.getters['display'] = !this._displayGetter ? function (itemData) {
      return itemData.text;
    } : this._displayGetter;
    return accessors;
  },
  _initMarkup: function _initMarkup() {
    this.callBase();

    this._addWidgetClass();
  },
  _addWidgetClass: function _addWidgetClass() {
    this._focusTarget().addClass(this._widgetClass());
  },
  _widgetClass: _common.noop,
  _renderItemFrame: function _renderItemFrame(index, itemData) {
    var $itemFrame = this.callBase.apply(this, arguments);
    $itemFrame.toggleClass(DISABLED_STATE_CLASS, !!this._disabledGetter(itemData));
    return $itemFrame;
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'displayExpr':
      case 'keyExpr':
        this._initAccessors();

        this._initDynamicTemplates();

        this.repaint();
        break;

      case 'itemsExpr':
      case 'selectedExpr':
      case 'disabledExpr':
      case 'expandedExpr':
      case 'parentIdExpr':
        this._initAccessors();

        this._initDataAdapter();

        this.repaint();
        break;

      case 'items':
        this._initDataAdapter();

        this.callBase(args);
        break;

      default:
        this.callBase(args);
    }
  }
});

var _default = HierarchicalCollectionWidget;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
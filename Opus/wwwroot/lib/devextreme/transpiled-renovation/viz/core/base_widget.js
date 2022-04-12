"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _common = require("../../core/utils/common");

var _window = require("../../core/utils/window");

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

var _type = require("../../core/utils/type");

var _iterator = require("../../core/utils/iterator");

var _resize_callbacks = _interopRequireDefault(require("../../core/utils/resize_callbacks"));

var _extend = require("../../core/utils/extend");

var _base_theme_manager = require("../core/base_theme_manager");

var _dom_component = _interopRequireDefault(require("../../core/dom_component"));

var _helpers = require("./helpers");

var _utils = require("./utils");

var _errors_warnings = _interopRequireDefault(require("./errors_warnings"));

var _renderer2 = require("./renderers/renderer");

var _size = require("../../core/utils/size");

var _layout = _interopRequireDefault(require("./layout"));

var _devices = _interopRequireDefault(require("../../core/devices"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _deferred = require("../../core/utils/deferred");

var _base_widget = require("./base_widget.utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _floor = Math.floor;
var _log = _errors_warnings.default.log;
var OPTION_RTL_ENABLED = 'rtlEnabled';
var SIZED_ELEMENT_CLASS = 'dx-sized-element';
var _option = _dom_component.default.prototype.option;

function getTrue() {
  return true;
}

function getFalse() {
  return false;
}

function areCanvasesDifferent(canvas1, canvas2) {
  return !(canvas1.width === canvas2.width && canvas1.height === canvas2.height && canvas1.left === canvas2.left && canvas1.top === canvas2.top && canvas1.right === canvas2.right && canvas1.bottom === canvas2.bottom);
}

function defaultOnIncidentOccurred(e) {
  if (!e.component._eventsStrategy.hasEvent('incidentOccurred')) {
    _log.apply(null, [e.target.id].concat(e.target.args || []));
  }
}

function pickPositiveValue(values) {
  return values.reduce(function (result, value) {
    return value > 0 && !result ? value : result;
  }, 0);
} // TODO - Changes handling
// * Provide more validation - something like
//     _changes: [{
//         code: "THEME",
//         options: ["theme"],
//         type: "option",
//         handler: function () {
//             this._setThemeAndRtl();
//         }
//     }, {
//         code: "CONTAINER_SIZE",
//         options: ["size", "option"],
//         type: "layout",
//         handler: function () {
//             this._updateSize();
//         }
//     }]


var getEmptyComponent = function getEmptyComponent() {
  var emptyComponentConfig = {
    _initTemplates: function _initTemplates() {},
    ctor: function ctor(element, options) {
      this.callBase(element, options);

      var sizedElement = _dom_adapter.default.createElement('div');

      var width = options && (0, _type.isNumeric)(options.width) ? options.width + 'px' : '100%';
      var height = options && (0, _type.isNumeric)(options.height) ? options.height + 'px' : this._getDefaultSize().height + 'px';

      _dom_adapter.default.setStyle(sizedElement, 'width', width);

      _dom_adapter.default.setStyle(sizedElement, 'height', height);

      _dom_adapter.default.setClass(sizedElement, SIZED_ELEMENT_CLASS);

      _dom_adapter.default.insertElement(element, sizedElement);
    }
  };

  var EmptyComponent = _dom_component.default.inherit(emptyComponentConfig);

  var originalInherit = EmptyComponent.inherit;

  EmptyComponent.inherit = function (config) {
    for (var field in config) {
      if ((0, _type.isFunction)(config[field]) && field.substr(0, 1) !== '_' && field !== 'option' || field === '_dispose' || field === '_optionChanged') {
        config[field] = _common.noop;
      }
    }

    return originalInherit.call(this, config);
  };

  return EmptyComponent;
};

function callForEach(functions) {
  functions.forEach(function (c) {
    return c();
  });
}

var isServerSide = !(0, _window.hasWindow)();

function sizeIsValid(value) {
  return (0, _type.isDefined)(value) && value > 0;
}

var baseWidget = isServerSide ? getEmptyComponent() : _dom_component.default.inherit({
  _eventsMap: {
    'onIncidentOccurred': {
      name: 'incidentOccurred'
    },
    'onDrawn': {
      name: 'drawn'
    }
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      onIncidentOccurred: defaultOnIncidentOccurred
    });
  },
  _useLinks: true,
  _init: function _init() {
    var that = this;

    that._$element.children('.' + SIZED_ELEMENT_CLASS).remove();

    that.callBase.apply(that, arguments);
    that._changesLocker = 0;
    that._optionChangedLocker = 0;
    that._asyncFirstDrawing = true;
    that._changes = (0, _helpers.changes)();

    that._suspendChanges();

    that._themeManager = that._createThemeManager();

    that._themeManager.setCallback(function () {
      that._requestChange(that._themeDependentChanges);
    });

    that._renderElementAttributes();

    that._initRenderer(); // Shouldn't "_useLinks" be passed to the renderer instead of doing 3 checks here?


    var linkTarget = that._useLinks && that._renderer.root; // There is an implicit relation between `_useLinks` and `loading indicator` - it uses links
    // Though this relation is not ensured in code we will immediately know when it is broken - `loading indicator` will break on construction

    linkTarget && linkTarget.enableLinks().virtualLink('core').virtualLink('peripheral');

    that._renderVisibilityChange();

    that._attachVisibilityChangeHandlers();

    that._toggleParentsScrollSubscription(this._isVisible());

    that._initEventTrigger();

    that._incidentOccurred = (0, _base_widget.createIncidentOccurred)(that.NAME, that._eventTrigger);
    that._layout = new _layout.default(); // Such solution is used only to avoid writing lots of "after" for all core elements in all widgets
    // May be later a proper solution would be found

    linkTarget && linkTarget.linkAfter('core');

    that._initPlugins();

    that._initCore();

    linkTarget && linkTarget.linkAfter();

    that._change(that._initialChanges);
  },
  _createThemeManager: function _createThemeManager() {
    return new _base_theme_manager.BaseThemeManager(this._getThemeManagerOptions());
  },
  _getThemeManagerOptions: function _getThemeManagerOptions() {
    return {
      themeSection: this._themeSection,
      fontFields: this._fontFields
    };
  },
  _initialChanges: ['LAYOUT', 'RESIZE_HANDLER', 'THEME', 'DISABLED'],
  _initPlugins: function _initPlugins() {
    var that = this;
    (0, _iterator.each)(that._plugins, function (_, plugin) {
      plugin.init.call(that);
    });
  },
  _disposePlugins: function _disposePlugins() {
    var that = this;
    (0, _iterator.each)(that._plugins.slice().reverse(), function (_, plugin) {
      plugin.dispose.call(that);
    });
  },
  _change: function _change(codes) {
    this._changes.add(codes);
  },
  _suspendChanges: function _suspendChanges() {
    ++this._changesLocker;
  },
  _resumeChanges: function _resumeChanges() {
    var that = this;

    if (--that._changesLocker === 0 && that._changes.count() > 0 && !that._applyingChanges) {
      that._renderer.lock();

      that._applyingChanges = true;

      that._applyChanges();

      that._changes.reset();

      that._applyingChanges = false;

      that._changesApplied();

      that._renderer.unlock();

      if (that._optionsQueue) {
        that._applyQueuedOptions();
      }

      that.resolveItemsDeferred(that._legend ? [that._legend] : []);
      that._optionChangedLocker++;

      that._notify();

      that._optionChangedLocker--;
    }
  },
  resolveItemsDeferred: function resolveItemsDeferred(items) {
    this._resolveDeferred(this._getTemplatesItems(items));
  },
  _collectTemplatesFromItems: function _collectTemplatesFromItems(items) {
    return items.reduce(function (prev, i) {
      return {
        items: prev.items.concat(i.getTemplatesDef()),
        groups: prev.groups.concat(i.getTemplatesGroups())
      };
    }, {
      items: [],
      groups: []
    });
  },
  _getTemplatesItems: function _getTemplatesItems(items) {
    var elements = this._collectTemplatesFromItems(items);

    var extraItems = this._getExtraTemplatesItems();

    return {
      items: extraItems.items.concat(elements.items),
      groups: extraItems.groups.concat(elements.groups),
      launchRequest: [extraItems.launchRequest],
      doneRequest: [extraItems.doneRequest]
    };
  },
  _getExtraTemplatesItems: function _getExtraTemplatesItems() {
    return {
      items: [],
      groups: [],
      launchRequest: function launchRequest() {},
      doneRequest: function doneRequest() {}
    };
  },
  _resolveDeferred: function _resolveDeferred(_ref) {
    var items = _ref.items,
        launchRequest = _ref.launchRequest,
        doneRequest = _ref.doneRequest,
        groups = _ref.groups;
    var that = this;

    that._setGroupsVisibility(groups, 'hidden');

    if (that._changesApplying) {
      that._changesApplying = false;
      callForEach(doneRequest);
      return;
    }

    var syncRendering = true;

    _deferred.when.apply(that, items).done(function () {
      if (syncRendering) {
        that._setGroupsVisibility(groups, 'visible');

        return;
      }

      callForEach(launchRequest);
      that._changesApplying = true;
      var changes = ['LAYOUT', 'FULL_RENDER'];

      if (that._asyncFirstDrawing) {
        changes.push('FORCE_FIRST_DRAWING');
        that._asyncFirstDrawing = false;
      } else {
        changes.push('FORCE_DRAWING');
      }

      that._requestChange(changes);

      that._setGroupsVisibility(groups, 'visible');
    });

    syncRendering = false;
  },
  _setGroupsVisibility: function _setGroupsVisibility(groups, visibility) {
    groups.forEach(function (g) {
      return g.attr({
        visibility: visibility
      });
    });
  },
  _applyQueuedOptions: function _applyQueuedOptions() {
    var that = this;
    var queue = that._optionsQueue;
    that._optionsQueue = null;
    that.beginUpdate();
    (0, _iterator.each)(queue, function (_, action) {
      action();
    });
    that.endUpdate();
  },
  _requestChange: function _requestChange(codes) {
    this._suspendChanges();

    this._change(codes);

    this._resumeChanges();
  },
  _applyChanges: function _applyChanges() {
    var that = this;
    var changes = that._changes;
    var order = that._totalChangesOrder;
    var i;
    var ii = order.length;

    for (i = 0; i < ii; ++i) {
      if (changes.has(order[i])) {
        that['_change_' + order[i]]();
      }
    }
  },
  _optionChangesOrder: ['EVENTS', 'THEME', 'RENDERER', 'RESIZE_HANDLER'],
  _layoutChangesOrder: ['ELEMENT_ATTR', 'CONTAINER_SIZE', 'LAYOUT'],
  _customChangesOrder: ['DISABLED'],
  _change_EVENTS: function _change_EVENTS() {
    this._eventTrigger.applyChanges();
  },
  _change_THEME: function _change_THEME() {
    this._setThemeAndRtl();
  },
  _change_RENDERER: function _change_RENDERER() {
    this._setRendererOptions();
  },
  _change_RESIZE_HANDLER: function _change_RESIZE_HANDLER() {
    this._setupResizeHandler();
  },
  _change_ELEMENT_ATTR: function _change_ELEMENT_ATTR() {
    this._renderElementAttributes();

    this._change(['CONTAINER_SIZE']);
  },
  _change_CONTAINER_SIZE: function _change_CONTAINER_SIZE() {
    this._updateSize();
  },
  _change_LAYOUT: function _change_LAYOUT() {
    this._setContentSize();
  },
  _change_DISABLED: function _change_DISABLED() {
    var renderer = this._renderer;
    var root = renderer.root;

    if (this.option('disabled')) {
      this._initDisabledState = root.attr('pointer-events');
      root.attr({
        'pointer-events': 'none',
        filter: renderer.getGrayScaleFilter().id
      });
    } else {
      if (root.attr('pointer-events') === 'none') {
        root.attr({
          'pointer-events': (0, _type.isDefined)(this._initDisabledState) ? this._initDisabledState : null,
          'filter': null
        });
      }
    }
  },
  _themeDependentChanges: ['RENDERER'],
  _initRenderer: function _initRenderer() {
    var that = this; // Canvas is calculated before the renderer is created in order to capture actual size of the container

    that._canvas = that._calculateCanvas();
    that._renderer = new _renderer2.Renderer({
      cssClass: that._rootClassPrefix + ' ' + that._rootClass,
      pathModified: that.option('pathModified'),
      container: that._$element[0]
    });

    that._renderer.resize(that._canvas.width, that._canvas.height);
  },
  _disposeRenderer: function _disposeRenderer() {
    ///#DEBUG
    // NOTE: This is temporary - until links mechanism is stabilized
    this._useLinks && this._renderer.root.checkLinks(); ///#ENDDEBUG

    this._renderer.dispose();
  },
  _getAnimationOptions: _common.noop,
  render: function render() {
    this._requestChange(['CONTAINER_SIZE']);

    var visible = this._isVisible();

    this._toggleParentsScrollSubscription(visible);

    !visible && this._stopCurrentHandling();
  },
  _toggleParentsScrollSubscription: function _toggleParentsScrollSubscription(subscribe) {
    var $parents = (0, _renderer.default)(this._renderer.root.element).parents();
    var scrollEvents = 'scroll.viz_widgets';

    if (_devices.default.real().platform === 'generic') {
      $parents = $parents.add((0, _window.getWindow)());
    }

    this._proxiedTargetParentsScrollHandler = this._proxiedTargetParentsScrollHandler || function () {
      this._stopCurrentHandling();
    }.bind(this);

    _events_engine.default.off((0, _renderer.default)().add(this._$prevRootParents), scrollEvents, this._proxiedTargetParentsScrollHandler);

    if (subscribe) {
      _events_engine.default.on($parents, scrollEvents, this._proxiedTargetParentsScrollHandler);

      this._$prevRootParents = $parents;
    }
  },
  _stopCurrentHandling: _common.noop,
  _dispose: function _dispose() {
    var that = this;
    that.callBase.apply(that, arguments);

    that._toggleParentsScrollSubscription(false);

    that._removeResizeHandler();

    that._layout.dispose();

    that._eventTrigger.dispose();

    that._disposeCore();

    that._disposePlugins();

    that._disposeRenderer();

    that._themeManager.dispose();

    that._themeManager = that._renderer = that._eventTrigger = null;
  },
  _initEventTrigger: function _initEventTrigger() {
    var that = this;
    that._eventTrigger = (0, _base_widget.createEventTrigger)(that._eventsMap, function (name) {
      return that._createActionByOption(name);
    });
  },
  _calculateCanvas: function _calculateCanvas() {
    var that = this;
    var size = that.option('size') || {};
    var margin = that.option('margin') || {};
    var defaultCanvas = that._getDefaultSize() || {};

    var getSizeOfSide = function getSizeOfSide(size, side, getter) {
      if (sizeIsValid(size[side]) || !(0, _window.hasWindow)()) {
        return 0;
      }

      var elementSize = getter(that._$element);
      return elementSize <= 1 ? 0 : elementSize;
    };

    var elementWidth = getSizeOfSide(size, 'width', function (x) {
      return (0, _size.getWidth)(x);
    });
    var elementHeight = getSizeOfSide(size, 'height', function (x) {
      return (0, _size.getHeight)(x);
    });
    var canvas = {
      width: size.width <= 0 ? 0 : _floor(pickPositiveValue([size.width, elementWidth, defaultCanvas.width])),
      height: size.height <= 0 ? 0 : _floor(pickPositiveValue([size.height, elementHeight, defaultCanvas.height])),
      left: pickPositiveValue([margin.left, defaultCanvas.left]),
      top: pickPositiveValue([margin.top, defaultCanvas.top]),
      right: pickPositiveValue([margin.right, defaultCanvas.right]),
      bottom: pickPositiveValue([margin.bottom, defaultCanvas.bottom])
    }; // This for backward compatibility - widget was not rendered when canvas is empty.
    // Now it will be rendered but because of "width" and "height" of the root both set to 0 it will not be visible.

    if (canvas.width - canvas.left - canvas.right <= 0 || canvas.height - canvas.top - canvas.bottom <= 0) {
      canvas = {
        width: 0,
        height: 0
      };
    }

    return canvas;
  },
  _updateSize: function _updateSize() {
    var that = this;

    var canvas = that._calculateCanvas();

    that._renderer.fixPlacement();

    if (areCanvasesDifferent(that._canvas, canvas) || that.__forceRender
    /* for charts */
    ) {
      that._canvas = canvas;

      that._recreateSizeDependentObjects(true);

      that._renderer.resize(canvas.width, canvas.height);

      that._change(['LAYOUT']);
    }
  },
  _recreateSizeDependentObjects: _common.noop,
  _getMinSize: function _getMinSize() {
    return [0, 0];
  },
  _getAlignmentRect: _common.noop,
  _setContentSize: function _setContentSize() {
    var canvas = this._canvas;
    var layout = this._layout;
    var rect = canvas.width > 0 && canvas.height > 0 ? [canvas.left, canvas.top, canvas.width - canvas.right, canvas.height - canvas.bottom] : [0, 0, 0, 0];
    rect = layout.forward(rect, this._getMinSize());
    var nextRect = this._applySize(rect) || rect;
    layout.backward(nextRect, this._getAlignmentRect() || nextRect);
  },
  ///#DEBUG
  DEBUG_getCanvas: function DEBUG_getCanvas() {
    return this._canvas;
  },
  DEBUG_getEventTrigger: function DEBUG_getEventTrigger() {
    return this._eventTrigger;
  },
  ///#ENDDEBUG
  _getOption: function _getOption(name, isScalar) {
    var theme = this._themeManager.theme(name);

    var option = this.option(name);
    return isScalar ? option !== undefined ? option : theme : (0, _extend.extend)(true, {}, theme, option);
  },
  _setupResizeHandler: function _setupResizeHandler() {
    var that = this;
    var redrawOnResize = (0, _utils.parseScalar)(this._getOption('redrawOnResize', true), true);

    if (that._resizeHandler) {
      that._removeResizeHandler();
    }

    that._resizeHandler = (0, _base_widget.createResizeHandler)(function () {
      if (redrawOnResize) {
        that._requestChange(['CONTAINER_SIZE']);
      } else {
        that._renderer.fixPlacement();
      }
    });

    _resize_callbacks.default.add(that._resizeHandler);
  },
  _removeResizeHandler: function _removeResizeHandler() {
    if (this._resizeHandler) {
      _resize_callbacks.default.remove(this._resizeHandler);

      this._resizeHandler.dispose();

      this._resizeHandler = null;
    }
  },
  // This is actually added only to make loading indicator pluggable. This is bad but much better than entire loading indicator in BaseWidget.
  _onBeginUpdate: _common.noop,
  beginUpdate: function beginUpdate() {
    var that = this; // The "_initialized" flag is checked because first time "beginUpdate" is called in the constructor.

    if (that._initialized && that._isUpdateAllowed()) {
      that._onBeginUpdate();

      that._suspendChanges();
    }

    that.callBase.apply(that, arguments);
    return that;
  },
  endUpdate: function endUpdate() {
    this.callBase();
    this._isUpdateAllowed() && this._resumeChanges();
    return this;
  },
  option: function option(name) {
    var that = this; // NOTE: `undefined` has to be returned because base option setter returns `undefined`.
    // `argument.length` and `isObject` checks are copypaste from Component.

    if (that._initialized && that._applyingChanges && (arguments.length > 1 || (0, _type.isObject)(name))) {
      that._optionsQueue = that._optionsQueue || [];

      that._optionsQueue.push(that._getActionForUpdating(arguments));
    } else {
      return _option.apply(that, arguments);
    }
  },
  _getActionForUpdating: function _getActionForUpdating(args) {
    var that = this;
    return function () {
      _option.apply(that, args);
    };
  },
  // For quite a long time the following method were abstract (from the Component perspective).
  // Now they are not but that basic functionality is not required here.
  _clean: _common.noop,
  _render: _common.noop,
  _optionChanged: function _optionChanged(arg) {
    var that = this;

    if (that._optionChangedLocker) {
      return;
    }

    var partialChanges = that.getPartialChangeOptionsName(arg);
    var changes = [];

    if (partialChanges.length > 0) {
      partialChanges.forEach(function (pc) {
        return changes.push(that._partialOptionChangesMap[pc]);
      });
    } else {
      changes.push(that._optionChangesMap[arg.name]);
    }

    changes = changes.filter(function (c) {
      return !!c;
    });

    if (that._eventTrigger.change(arg.name)) {
      that._change(['EVENTS']);
    } else if (changes.length > 0) {
      that._change(changes);
    } else {
      that.callBase.apply(that, arguments);
    }
  },
  _notify: _common.noop,
  _changesApplied: _common.noop,
  _optionChangesMap: {
    size: 'CONTAINER_SIZE',
    margin: 'CONTAINER_SIZE',
    redrawOnResize: 'RESIZE_HANDLER',
    theme: 'THEME',
    rtlEnabled: 'THEME',
    encodeHtml: 'THEME',
    elementAttr: 'ELEMENT_ATTR',
    disabled: 'DISABLED'
  },
  _partialOptionChangesMap: {},
  _partialOptionChangesPath: {},
  getPartialChangeOptionsName: function getPartialChangeOptionsName(changedOption) {
    var that = this;
    var fullName = changedOption.fullName;
    var sections = fullName.split(/[.]/);
    var name = changedOption.name;
    var value = changedOption.value;
    var options = this._partialOptionChangesPath[name];
    var partialChangeOptionsName = [];

    if (options) {
      if (options === true) {
        partialChangeOptionsName.push(name);
      } else {
        options.forEach(function (op) {
          fullName.indexOf(op) >= 0 && partialChangeOptionsName.push(op);
        });

        if (sections.length === 1) {
          if ((0, _type.type)(value) === 'object') {
            that._addOptionsNameForPartialUpdate(value, options, partialChangeOptionsName);
          } else if ((0, _type.type)(value) === 'array') {
            if (value.length > 0 && value.every(function (item) {
              return that._checkOptionsForPartialUpdate(item, options);
            })) {
              value.forEach(function (item) {
                return that._addOptionsNameForPartialUpdate(item, options, partialChangeOptionsName);
              });
            }
          }
        }
      }
    }

    return partialChangeOptionsName.filter(function (value, index, self) {
      return self.indexOf(value) === index;
    });
  },
  _checkOptionsForPartialUpdate: function _checkOptionsForPartialUpdate(optionObject, options) {
    return !Object.keys(optionObject).some(function (key) {
      return options.indexOf(key) === -1;
    });
  },
  _addOptionsNameForPartialUpdate: function _addOptionsNameForPartialUpdate(optionObject, options, partialChangeOptionsName) {
    var optionKeys = Object.keys(optionObject);

    if (this._checkOptionsForPartialUpdate(optionObject, options)) {
      optionKeys.forEach(function (key) {
        return options.indexOf(key) > -1 && partialChangeOptionsName.push(key);
      });
    }
  },
  _visibilityChanged: function _visibilityChanged() {
    this.render();
  },
  _setThemeAndRtl: function _setThemeAndRtl() {
    this._themeManager.setTheme(this.option('theme'), this.option(OPTION_RTL_ENABLED));
  },
  _getRendererOptions: function _getRendererOptions() {
    return {
      rtl: this.option(OPTION_RTL_ENABLED),
      encodeHtml: this.option('encodeHtml'),
      animation: this._getAnimationOptions()
    };
  },
  _setRendererOptions: function _setRendererOptions() {
    this._renderer.setOptions(this._getRendererOptions());
  },
  svg: function svg() {
    return this._renderer.svg();
  },
  getSize: function getSize() {
    var canvas = this._canvas || {};
    return {
      width: canvas.width,
      height: canvas.height
    };
  },
  isReady: getFalse,
  _dataIsReady: getTrue,
  _resetIsReady: function _resetIsReady() {
    this.isReady = getFalse;
  },
  _drawn: function _drawn() {
    var that = this;
    that.isReady = getFalse;

    if (that._dataIsReady()) {
      that._renderer.onEndAnimation(function () {
        that.isReady = getTrue;
      });
    }

    that._eventTrigger('drawn', {});
  }
});
var _default = baseWidget;
exports.default = _default;
(0, _helpers.replaceInherit)(baseWidget);
module.exports = exports.default;
module.exports.default = exports.default;
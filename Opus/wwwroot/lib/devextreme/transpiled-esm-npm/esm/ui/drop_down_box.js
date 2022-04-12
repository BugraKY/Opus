import DropDownEditor from './drop_down_editor/ui.drop_down_editor';
import DataExpressionMixin from './editor/ui.data_expression';
import { noop, grep } from '../core/utils/common';
import { isDefined, isObject } from '../core/utils/type';
import { map } from '../core/utils/iterator';
import { tabbable } from './widget/selectors';
import { when, Deferred } from '../core/utils/deferred';
import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import { extend } from '../core/utils/extend';
import { getElementMaxHeightByWindow } from '../ui/overlay/utils';
import registerComponent from '../core/component_registrator';
import { normalizeKeyName } from '../events/utils/index';
import { keyboard } from '../events/short';
import devices from '../core/devices';
import domAdapter from '../core/dom_adapter';
import { getPublicElement } from '../core/element'; // STYLE dropDownBox

var getActiveElement = domAdapter.getActiveElement;
var DROP_DOWN_BOX_CLASS = 'dx-dropdownbox';
var ANONYMOUS_TEMPLATE_NAME = 'content';
var realDevice = devices.real();
var DropDownBox = DropDownEditor.inherit({
  _supportedKeys: function _supportedKeys() {
    return extend({}, this.callBase(), {
      tab: function tab(e) {
        if (!this.option('opened')) {
          return;
        }

        var $tabbableElements = this._getTabbableElements();

        var $focusableElement = e.shiftKey ? $tabbableElements.last() : $tabbableElements.first();
        $focusableElement && eventsEngine.trigger($focusableElement, 'focus');
        e.preventDefault();
      }
    });
  },
  _getTabbableElements: function _getTabbableElements() {
    return this._getElements().filter(tabbable);
  },
  _getElements: function _getElements() {
    return $(this.content()).find('*');
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      /**
       * @name dxDropDownBoxOptions.attr
       * @hidden
       */
      acceptCustomValue: false,
      contentTemplate: ANONYMOUS_TEMPLATE_NAME,

      /**
      * @name dxDropDownBoxOptions.onContentReady
      * @hidden true
      * @action
      */

      /**
       * @name dxDropDownBoxOptions.spellcheck
       * @type boolean
       * @default false
       * @hidden
       */

      /**
       * @name dxDropDownBoxOptions.applyValueMode
       * @type string
       * @default "instantly"
       * @acceptValues 'useButtons'|'instantly'
       * @hidden
       */

      /**
       * @name dxDropDownBoxOptions.itemTemplate
       * @type template
       * @default "item"
       * @hidden
       */
      openOnFieldClick: true,
      displayValueFormatter: function displayValueFormatter(value) {
        return Array.isArray(value) ? value.join(', ') : value;
      },
      useHiddenSubmitElement: true
    });
  },
  _getAnonymousTemplateName: function _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },
  _initTemplates: function _initTemplates() {
    this.callBase();
  },
  _initMarkup: function _initMarkup() {
    this._initDataExpressions();

    this.$element().addClass(DROP_DOWN_BOX_CLASS);
    this.callBase();
  },
  _setSubmitValue: function _setSubmitValue() {
    var value = this.option('value');
    var submitValue = this._shouldUseDisplayValue(value) ? this._displayGetter(value) : value;

    this._getSubmitElement().val(submitValue);
  },
  _shouldUseDisplayValue: function _shouldUseDisplayValue(value) {
    return this.option('valueExpr') === 'this' && isObject(value);
  },
  _renderInputValue: function _renderInputValue() {
    this._rejectValueLoading();

    var values = [];

    if (!this._dataSource) {
      this.callBase(values);
      return new Deferred().resolve();
    }

    var currentValue = this._getCurrentValue();

    var keys = currentValue !== null && currentValue !== void 0 ? currentValue : [];
    keys = Array.isArray(keys) ? keys : [keys];
    var itemLoadDeferreds = map(keys, key => {
      var deferred = new Deferred();

      this._loadItem(key).always(item => {
        var displayValue = this._displayGetter(item);

        if (isDefined(displayValue)) {
          values.push(displayValue);
        } else if (this.option('acceptCustomValue')) {
          values.push(key);
        }

        deferred.resolve();
      });

      return deferred;
    });
    var callBase = this.callBase.bind(this);
    return when.apply(this, itemLoadDeferreds).always(() => {
      this.option('displayValue', values);
      callBase(values.length && values);
    });
  },
  _loadItem: function _loadItem(value) {
    var deferred = new Deferred();
    var that = this;
    var selectedItem = grep(this.option('items') || [], function (item) {
      return this._isValueEquals(this._valueGetter(item), value);
    }.bind(this))[0];

    if (selectedItem !== undefined) {
      deferred.resolve(selectedItem);
    } else {
      this._loadValue(value).done(function (item) {
        deferred.resolve(item);
      }).fail(function (args) {
        if (args !== null && args !== void 0 && args.shouldSkipCallback) {
          return;
        }

        if (that.option('acceptCustomValue')) {
          deferred.resolve(value);
        } else {
          deferred.reject();
        }
      });
    }

    return deferred.promise();
  },
  _popupElementTabHandler: function _popupElementTabHandler(e) {
    if (normalizeKeyName(e) !== 'tab') return;

    var $firstTabbable = this._getTabbableElements().first().get(0);

    var $lastTabbable = this._getTabbableElements().last().get(0);

    var $target = e.originalEvent.target;
    var moveBackward = !!($target === $firstTabbable && e.shift);
    var moveForward = !!($target === $lastTabbable && !e.shift);

    if (moveBackward || moveForward) {
      this.close();
      eventsEngine.trigger(this._input(), 'focus');

      if (moveBackward) {
        e.originalEvent.preventDefault();
      }
    }
  },
  _renderPopup: function _renderPopup(e) {
    this.callBase();

    if (this.option('focusStateEnabled')) {
      keyboard.on(this.content(), null, e => this._popupElementTabHandler(e));
    }
  },
  _renderPopupContent: function _renderPopupContent() {
    if (this.option('contentTemplate') === ANONYMOUS_TEMPLATE_NAME) {
      return;
    }

    var contentTemplate = this._getTemplateByOption('contentTemplate');

    if (!(contentTemplate && this.option('contentTemplate'))) {
      return;
    }

    var $popupContent = this._popup.$content();

    var templateData = {
      value: this._fieldRenderData(),
      component: this
    };
    $popupContent.empty();
    contentTemplate.render({
      container: getPublicElement($popupContent),
      model: templateData
    });
  },
  _canShowVirtualKeyboard: function _canShowVirtualKeyboard() {
    return realDevice.mac; // T845484
  },
  _isNestedElementActive: function _isNestedElementActive() {
    var activeElement = getActiveElement();
    return activeElement && this._popup.$content().get(0).contains(activeElement);
  },
  _shouldHideOnParentScroll: function _shouldHideOnParentScroll() {
    return realDevice.deviceType === 'desktop' && this._canShowVirtualKeyboard() && this._isNestedElementActive();
  },
  _popupHiddenHandler: function _popupHiddenHandler() {
    this.callBase();
    this._popupPosition = undefined;
  },
  _popupPositionedHandler: function _popupPositionedHandler(e) {
    this.callBase(e);
    this._popupPosition = e.position;
  },
  _getDefaultPopupPosition: function _getDefaultPopupPosition(isRtlEnabled) {
    var {
      my,
      at
    } = this.callBase(isRtlEnabled);
    return {
      my,
      at,
      offset: {
        v: -1
      },
      collision: 'flipfit'
    };
  },
  _popupConfig: function _popupConfig() {
    var {
      focusStateEnabled
    } = this.option();
    return extend(this.callBase(), {
      tabIndex: -1,
      dragEnabled: false,
      focusStateEnabled,
      contentTemplate: ANONYMOUS_TEMPLATE_NAME,
      hideOnParentScroll: this._shouldHideOnParentScroll.bind(this),
      position: extend(this.option('popupPosition'), {
        of: this.$element()
      }),
      onKeyboardHandled: opts => this.option('focusStateEnabled') && this._popupElementTabHandler(opts),
      _ignoreFunctionValueDeprecation: true,
      maxHeight: function () {
        var _this$_popupPosition;

        var popupLocation = (_this$_popupPosition = this._popupPosition) === null || _this$_popupPosition === void 0 ? void 0 : _this$_popupPosition.v.location;
        return getElementMaxHeightByWindow(this.$element(), popupLocation);
      }.bind(this)
    });
  },
  _popupShownHandler: function _popupShownHandler() {
    this.callBase();

    var $firstElement = this._getTabbableElements().first();

    eventsEngine.trigger($firstElement, 'focus');
  },
  _setCollectionWidgetOption: noop,
  _optionChanged: function _optionChanged(args) {
    this._dataExpressionOptionChanged(args);

    switch (args.name) {
      case 'dataSource':
        this._renderInputValue();

        break;

      case 'displayValue':
        this.option('text', args.value);
        break;

      case 'displayExpr':
        this._renderValue();

        break;

      case 'contentTemplate':
        this._invalidate();

        break;

      default:
        this.callBase(args);
    }
  }
}).include(DataExpressionMixin);
registerComponent('dxDropDownBox', DropDownBox);
export default DropDownBox;
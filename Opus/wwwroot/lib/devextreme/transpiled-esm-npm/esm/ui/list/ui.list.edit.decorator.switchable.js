import { getOuterHeight, setHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { noop } from '../../core/utils/common';
import EditDecorator from './ui.list.edit.decorator';
var abstract = EditDecorator.abstract;
import { addNamespace } from '../../events/utils/index';
import pointerEvents from '../../events/pointer';
import { active } from '../../events/core/emitter.feedback';
var LIST_EDIT_DECORATOR = 'dxListEditDecorator';
var POINTER_DOWN_EVENT_NAME = addNamespace(pointerEvents.down, LIST_EDIT_DECORATOR);
var ACTIVE_EVENT_NAME = addNamespace(active, LIST_EDIT_DECORATOR);
var LIST_ITEM_CONTENT_CLASS = 'dx-list-item-content';
var SWITCHABLE_DELETE_READY_CLASS = 'dx-list-switchable-delete-ready';
var SWITCHABLE_MENU_SHIELD_POSITIONING_CLASS = 'dx-list-switchable-menu-shield-positioning';
var SWITCHABLE_DELETE_TOP_SHIELD_CLASS = 'dx-list-switchable-delete-top-shield';
var SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS = 'dx-list-switchable-delete-bottom-shield';
var SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS = 'dx-list-switchable-menu-item-shield-positioning';
var SWITCHABLE_DELETE_ITEM_CONTENT_SHIELD_CLASS = 'dx-list-switchable-delete-item-content-shield';
var SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS = 'dx-list-switchable-delete-button-container';
var SwitchableEditDecorator = EditDecorator.inherit({
  _init: function _init() {
    this._$topShield = $('<div>').addClass(SWITCHABLE_DELETE_TOP_SHIELD_CLASS);
    this._$bottomShield = $('<div>').addClass(SWITCHABLE_DELETE_BOTTOM_SHIELD_CLASS);
    this._$itemContentShield = $('<div>').addClass(SWITCHABLE_DELETE_ITEM_CONTENT_SHIELD_CLASS);
    eventsEngine.on(this._$topShield, POINTER_DOWN_EVENT_NAME, this._cancelDeleteReadyItem.bind(this));
    eventsEngine.on(this._$bottomShield, POINTER_DOWN_EVENT_NAME, this._cancelDeleteReadyItem.bind(this));

    this._list.$element().append(this._$topShield.toggle(false)).append(this._$bottomShield.toggle(false));
  },
  handleClick: function handleClick() {
    return this._cancelDeleteReadyItem();
  },
  _cancelDeleteReadyItem: function _cancelDeleteReadyItem() {
    if (!this._$readyToDeleteItem) {
      return false;
    }

    this._cancelDelete(this._$readyToDeleteItem);

    return true;
  },
  _cancelDelete: function _cancelDelete($itemElement) {
    this._toggleDeleteReady($itemElement, false);
  },
  _toggleDeleteReady: function _toggleDeleteReady($itemElement, readyToDelete) {
    if (readyToDelete === undefined) {
      readyToDelete = !this._isReadyToDelete($itemElement);
    }

    this._toggleShields($itemElement, readyToDelete);

    this._toggleScrolling(readyToDelete);

    this._cacheReadyToDeleteItem($itemElement, readyToDelete);

    this._animateToggleDelete($itemElement, readyToDelete);
  },
  _isReadyToDelete: function _isReadyToDelete($itemElement) {
    return $itemElement.hasClass(SWITCHABLE_DELETE_READY_CLASS);
  },
  _toggleShields: function _toggleShields($itemElement, enabled) {
    this._list.$element().toggleClass(SWITCHABLE_MENU_SHIELD_POSITIONING_CLASS, enabled);

    this._$topShield.toggle(enabled);

    this._$bottomShield.toggle(enabled);

    if (enabled) {
      this._updateShieldsHeight($itemElement);
    }

    this._toggleContentShield($itemElement, enabled);
  },
  _updateShieldsHeight: function _updateShieldsHeight($itemElement) {
    var $list = this._list.$element();

    var listTopOffset = $list.offset().top;
    var listHeight = getOuterHeight($list);
    var itemTopOffset = $itemElement.offset().top;
    var itemHeight = getOuterHeight($itemElement);
    var dirtyTopShieldHeight = itemTopOffset - listTopOffset;
    var dirtyBottomShieldHeight = listHeight - itemHeight - dirtyTopShieldHeight;
    setHeight(this._$topShield, Math.max(dirtyTopShieldHeight, 0));
    setHeight(this._$bottomShield, Math.max(dirtyBottomShieldHeight, 0));
  },
  _toggleContentShield: function _toggleContentShield($itemElement, enabled) {
    if (enabled) {
      $itemElement.find('.' + LIST_ITEM_CONTENT_CLASS).first().append(this._$itemContentShield);
    } else {
      this._$itemContentShield.detach();
    }
  },
  _toggleScrolling: function _toggleScrolling(readyToDelete) {
    var scrollView = this._list.$element().dxScrollView('instance');

    if (readyToDelete) {
      scrollView.on('start', this._cancelScrolling);
    } else {
      scrollView.off('start', this._cancelScrolling);
    }
  },
  _cancelScrolling: function _cancelScrolling(args) {
    args.event.cancel = true;
  },
  _cacheReadyToDeleteItem: function _cacheReadyToDeleteItem($itemElement, cache) {
    if (cache) {
      this._$readyToDeleteItem = $itemElement;
    } else {
      delete this._$readyToDeleteItem;
    }
  },
  _animateToggleDelete: function _animateToggleDelete($itemElement, readyToDelete) {
    if (readyToDelete) {
      this._enablePositioning($itemElement);

      this._prepareDeleteReady($itemElement);

      this._animatePrepareDeleteReady($itemElement);

      eventsEngine.off($itemElement, pointerEvents.up);
    } else {
      this._forgetDeleteReady($itemElement);

      this._animateForgetDeleteReady($itemElement).done(this._disablePositioning.bind(this, $itemElement));
    }
  },
  _enablePositioning: function _enablePositioning($itemElement) {
    $itemElement.addClass(SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS);
    eventsEngine.on($itemElement, ACTIVE_EVENT_NAME, noop);
    eventsEngine.one($itemElement, pointerEvents.up, this._disablePositioning.bind(this, $itemElement));
  },
  _disablePositioning: function _disablePositioning($itemElement) {
    $itemElement.removeClass(SWITCHABLE_MENU_ITEM_SHIELD_POSITIONING_CLASS);
    eventsEngine.off($itemElement, ACTIVE_EVENT_NAME);
  },
  _prepareDeleteReady: function _prepareDeleteReady($itemElement) {
    $itemElement.addClass(SWITCHABLE_DELETE_READY_CLASS);
  },
  _forgetDeleteReady: function _forgetDeleteReady($itemElement) {
    $itemElement.removeClass(SWITCHABLE_DELETE_READY_CLASS);
  },
  _animatePrepareDeleteReady: abstract,
  _animateForgetDeleteReady: abstract,
  _getDeleteButtonContainer: function _getDeleteButtonContainer($itemElement) {
    $itemElement = $itemElement || this._$readyToDeleteItem;
    return $itemElement.children('.' + SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS);
  },
  _deleteItem: function _deleteItem($itemElement) {
    $itemElement = $itemElement || this._$readyToDeleteItem;

    this._getDeleteButtonContainer($itemElement).detach();

    if ($itemElement.is('.dx-state-disabled, .dx-state-disabled *')) {
      return;
    }

    this._list.deleteItem($itemElement).always(this._cancelDelete.bind(this, $itemElement));
  },
  _isRtlEnabled: function _isRtlEnabled() {
    return this._list.option('rtlEnabled');
  },
  dispose: function dispose() {
    if (this._$topShield) {
      this._$topShield.remove();
    }

    if (this._$bottomShield) {
      this._$bottomShield.remove();
    }

    this.callBase.apply(this, arguments);
  }
});
export default SwitchableEditDecorator;
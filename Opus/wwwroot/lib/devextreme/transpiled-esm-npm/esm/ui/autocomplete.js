import $ from '../core/renderer';
import { noop } from '../core/utils/common';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import DropDownList from './drop_down_editor/ui.drop_down_list';
import { Deferred } from '../core/utils/deferred';
import { isCommandKeyPressed } from '../events/utils/index'; // STYLE autocomplete

var AUTOCOMPLETE_CLASS = 'dx-autocomplete';
var AUTOCOMPLETE_POPUP_WRAPPER_CLASS = 'dx-autocomplete-popup-wrapper';
var Autocomplete = DropDownList.inherit({
  _supportedKeys: function _supportedKeys() {
    var item = this._list ? this._list.option('focusedElement') : null;
    var parent = this.callBase();
    item = item && $(item);
    return extend({}, parent, {
      upArrow: function upArrow(e) {
        if (!isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();

          if (item && !this._calcNextItem(-1)) {
            this._clearFocusedItem();

            return false;
          }
        }

        return true;
      },
      downArrow: function downArrow(e) {
        if (!isCommandKeyPressed(e)) {
          e.preventDefault();
          e.stopPropagation();

          if (item && !this._calcNextItem(1)) {
            this._clearFocusedItem();

            return false;
          }
        }

        return true;
      },
      enter: function enter(e) {
        if (!item) {
          this.close();
        }

        var opened = this.option('opened');

        if (opened) {
          e.preventDefault();
        }

        return opened;
      }
    });
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      minSearchLength: 1,
      maxItemCount: 10,

      /**
      * @name dxAutocompleteOptions.noDataText
      * @type string
      * @default ""
      * @hidden
      */
      noDataText: '',
      showDropDownButton: false,
      searchEnabled: true
      /**
      * @name dxAutocompleteOptions.displayExpr
      * @hidden
      */

      /**
      * @name dxAutocompleteOptions.acceptCustomValue
      * @hidden
      */

      /**
      * @name dxAutocompleteOptions.searchEnabled
      * @hidden
      */

      /**
      * @name dxAutocompleteOptions.showDataBeforeSearch
      * @hidden
      */

    });
  },

  /**
  * @name dxAutocomplete.open
  * @publicName open()
  * @hidden
  */

  /**
  * @name dxAutocomplete.close
  * @publicName close()
  * @hidden
  */
  _initMarkup: function _initMarkup() {
    this.callBase();
    this.$element().addClass(AUTOCOMPLETE_CLASS);
    this.setAria('autocomplete', 'inline');
  },
  _displayGetterExpr: function _displayGetterExpr() {
    return this.option('valueExpr');
  },
  _closeOutsideDropDownHandler: function _closeOutsideDropDownHandler(_ref) {
    var {
      target
    } = _ref;
    return !$(target).closest(this.$element()).length;
  },
  _renderDimensions: function _renderDimensions() {
    this.callBase();

    this._dimensionChanged();
  },
  _popupWrapperClass: function _popupWrapperClass() {
    return this.callBase() + ' ' + AUTOCOMPLETE_POPUP_WRAPPER_CLASS;
  },
  _listConfig: function _listConfig() {
    return extend(this.callBase(), {
      pageLoadMode: 'none',
      onSelectionChanged: e => {
        this._setSelectedItem(e.addedItems[0]);
      }
    });
  },
  _listItemClickHandler: function _listItemClickHandler(e) {
    this._saveValueChangeEvent(e.event);

    var value = this._displayGetter(e.itemData);

    this.option('value', value);
    this.close();
  },
  _setListDataSource: function _setListDataSource() {
    if (!this._list) {
      return;
    }

    this._list.option('selectedItems', []);

    this.callBase();
  },
  _refreshSelected: noop,
  _searchCanceled: function _searchCanceled() {
    this.callBase();
    this.close();
  },
  _loadItem: function _loadItem(value, cache) {
    var selectedItem = this._getItemFromPlain(value, cache);

    return new Deferred().resolve(selectedItem).promise();
  },
  _dataSourceOptions: function _dataSourceOptions() {
    return {
      paginate: true,
      pageSize: this.option('maxItemCount')
    };
  },
  _searchDataSource: function _searchDataSource(searchValue) {
    this._dataSource.pageSize(this.option('maxItemCount'));

    this.callBase(searchValue);

    this._clearFocusedItem();
  },
  _clearFocusedItem: function _clearFocusedItem() {
    if (this._list) {
      this._list.option('focusedElement', null);

      this._list.option('selectedIndex', -1);
    }
  },
  _renderValueEventName: function _renderValueEventName() {
    return 'input keyup';
  },
  _valueChangeEventHandler: function _valueChangeEventHandler(e) {
    var value = this._input().val() || null;
    return this.callBase(e, value);
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'maxItemCount':
        this._searchDataSource();

        break;

      case 'valueExpr':
        this._compileDisplayGetter();

        this._setListOption('displayExpr', this._displayGetterExpr());

        this.callBase(args);
        break;

      default:
        this.callBase(args);
    }
  },
  reset: function reset() {
    this.callBase();
    this.close();
  }
});
registerComponent('dxAutocomplete', Autocomplete);
export default Autocomplete;
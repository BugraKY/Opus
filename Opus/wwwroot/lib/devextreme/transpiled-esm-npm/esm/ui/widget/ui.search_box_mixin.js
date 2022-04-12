import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import messageLocalization from '../../localization/message';
import errors from '../widget/ui.errors';
import { Deferred } from '../../core/utils/deferred';
import { stubComponent } from '../../core/utils/stubs';
var EditorClass = stubComponent('TextBox');
export default {
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      searchMode: '',
      searchExpr: null,
      searchValue: '',
      searchEnabled: false,
      searchEditorOptions: {}
    });
  },
  _initMarkup: function _initMarkup() {
    this._renderSearch();

    this.callBase();
  },
  _renderSearch: function _renderSearch() {
    var $element = this.$element();
    var searchEnabled = this.option('searchEnabled');

    var searchBoxClassName = this._addWidgetPrefix('search');

    var rootElementClassName = this._addWidgetPrefix('with-search');

    if (!searchEnabled) {
      $element.removeClass(rootElementClassName);

      this._removeSearchBox();

      return;
    }

    var editorOptions = this._getSearchEditorOptions();

    if (this._searchEditor) {
      this._searchEditor.option(editorOptions);
    } else {
      $element.addClass(rootElementClassName);
      this._$searchEditorElement = $('<div>').addClass(searchBoxClassName).prependTo($element);
      this._searchEditor = this._createComponent(this._$searchEditorElement, EditorClass, editorOptions);
    }
  },
  _removeSearchBox: function _removeSearchBox() {
    this._$searchEditorElement && this._$searchEditorElement.remove();
    delete this._$searchEditorElement;
    delete this._searchEditor;
  },
  _getSearchEditorOptions: function _getSearchEditorOptions() {
    var that = this;
    var userEditorOptions = that.option('searchEditorOptions');
    var searchText = messageLocalization.format('Search');
    return extend({
      mode: 'search',
      placeholder: searchText,
      tabIndex: that.option('tabIndex'),
      value: that.option('searchValue'),
      valueChangeEvent: 'input',
      inputAttr: {
        'aria-label': searchText
      },
      onValueChanged: function onValueChanged(e) {
        var searchTimeout = that.option('searchTimeout');
        that._valueChangeDeferred = new Deferred();
        clearTimeout(that._valueChangeTimeout);

        that._valueChangeDeferred.done(function () {
          this.option('searchValue', e.value);
        }.bind(that));

        if (e.event && e.event.type === 'input' && searchTimeout) {
          that._valueChangeTimeout = setTimeout(function () {
            that._valueChangeDeferred.resolve();
          }, searchTimeout);
        } else {
          that._valueChangeDeferred.resolve();
        }
      }
    }, userEditorOptions);
  },
  _getAriaTarget: function _getAriaTarget() {
    if (this.option('searchEnabled')) {
      return this._itemContainer(true);
    }

    return this.$element();
  },
  _focusTarget: function _focusTarget() {
    if (this.option('searchEnabled')) {
      return this._itemContainer(true);
    }

    return this.callBase();
  },
  _updateFocusState: function _updateFocusState(e, isFocused) {
    if (this.option('searchEnabled')) {
      this._toggleFocusClass(isFocused, this.$element());
    }

    this.callBase(e, isFocused);
  },
  getOperationBySearchMode: function getOperationBySearchMode(searchMode) {
    return searchMode === 'equals' ? '=' : searchMode;
  },
  _cleanAria: function _cleanAria($target) {
    this.setAria({
      'role': null,
      'activedescendant': null
    }, $target);
    $target.attr('tabIndex', null);
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'searchEnabled':
      case 'searchEditorOptions':
        this._cleanAria(this.option('searchEnabled') ? this.$element() : this._itemContainer());

        this._invalidate();

        break;

      case 'searchExpr':
      case 'searchMode':
      case 'searchValue':
        if (!this._dataSource) {
          errors.log('W1009');
          return;
        }

        if (args.name === 'searchMode') {
          this._dataSource.searchOperation(this.getOperationBySearchMode(args.value));
        } else {
          this._dataSource[args.name](args.value);
        }

        this._dataSource.load();

        break;

      case 'searchTimeout':
        break;

      default:
        this.callBase(args);
    }
  },
  focus: function focus() {
    if (!this.option('focusedElement') && this.option('searchEnabled')) {
      this._searchEditor && this._searchEditor.focus();
      return;
    }

    this.callBase();
  },
  _refresh: function _refresh() {
    if (this._valueChangeDeferred) {
      this._valueChangeDeferred.resolve();
    }

    this.callBase();
  },
  setEditorClass: function setEditorClass(value) {
    EditorClass = value;
  }
};
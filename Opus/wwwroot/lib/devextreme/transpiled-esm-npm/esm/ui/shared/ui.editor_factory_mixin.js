import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { isDefined, isObject, isFunction } from '../../core/utils/type';
import variableWrapper from '../../core/utils/variable_wrapper';
import { compileGetter } from '../../core/utils/data';
import browser from '../../core/utils/browser';
import { extend } from '../../core/utils/extend';
import devices from '../../core/devices';
import { getPublicElement } from '../../core/element';
import { normalizeDataSourceOptions } from '../../data/data_source/utils';
import { normalizeKeyName } from '../../events/utils/index';
var {
  isWrapped
} = variableWrapper;
import '../text_box';
import '../number_box';
import '../check_box';
import '../select_box';
import '../date_box';
var CHECKBOX_SIZE_CLASS = 'checkbox-size';
var EDITOR_INLINE_BLOCK = 'dx-editor-inline-block';

var EditorFactoryMixin = function () {
  var getResultConfig = function getResultConfig(config, options) {
    return extend(config, {
      readOnly: options.readOnly,
      placeholder: options.placeholder,
      inputAttr: {
        id: options.id
      },
      tabIndex: options.tabIndex
    }, options.editorOptions);
  };

  var checkEnterBug = function checkEnterBug() {
    return browser.mozilla || devices.real().ios; // Workaround for T344096, T249363, T314719, caused by https://connect.microsoft.com/IE/feedback/details/1552272/
  };

  var getTextEditorConfig = function getTextEditorConfig(options) {
    var data = {};
    var isEnterBug = checkEnterBug();
    var sharedData = options.sharedData || data;
    return getResultConfig({
      placeholder: options.placeholder,
      width: options.width,
      value: options.value,
      onValueChanged: function onValueChanged(e) {
        var needDelayedUpdate = options.parentType === 'filterRow' || options.parentType === 'searchPanel';
        var isInputOrKeyUpEvent = e.event && (e.event.type === 'input' || e.event.type === 'keyup');

        var updateValue = function updateValue(e, notFireEvent) {
          options && options.setValue(e.value, notFireEvent);
        };

        clearTimeout(data.valueChangeTimeout);

        if (isInputOrKeyUpEvent && needDelayedUpdate) {
          sharedData.valueChangeTimeout = data.valueChangeTimeout = setTimeout(function () {
            updateValue(e, data.valueChangeTimeout !== sharedData.valueChangeTimeout);
          }, isDefined(options.updateValueTimeout) ? options.updateValueTimeout : 0);
        } else {
          updateValue(e);
        }
      },
      onKeyDown: function onKeyDown(e) {
        if (isEnterBug && normalizeKeyName(e.event) === 'enter') {
          eventsEngine.trigger($(e.component._input()), 'change');
        }
      },
      valueChangeEvent: 'change' + (options.parentType === 'filterRow' ? ' keyup input' : '')
    }, options);
  };

  var prepareDateBox = function prepareDateBox(options) {
    options.editorName = 'dxDateBox';
    options.editorOptions = getResultConfig({
      value: options.value,
      onValueChanged: function onValueChanged(args) {
        options.setValue(args.value);
      },
      onKeyDown: function onKeyDown(e) {
        if (checkEnterBug() && normalizeKeyName(e.event) === 'enter') {
          e.component.blur();
          e.component.focus();
        }
      },
      displayFormat: options.format,
      type: options.dataType,
      dateSerializationFormat: null,
      width: options.parentType === 'filterBuilder' ? undefined : 'auto'
    }, options);
  };

  var prepareTextBox = function prepareTextBox(options) {
    var config = getTextEditorConfig(options);
    var isSearching = options.parentType === 'searchPanel';

    var toString = function toString(value) {
      return isDefined(value) ? value.toString() : '';
    };

    if (options.editorType && options.editorType !== 'dxTextBox') {
      config.value = options.value;
    } else {
      config.value = toString(options.value);
    }

    config.valueChangeEvent += isSearching ? ' keyup input search' : '';
    config.mode = config.mode || (isSearching ? 'search' : 'text');
    options.editorName = 'dxTextBox';
    options.editorOptions = config;
  };

  var prepareNumberBox = function prepareNumberBox(options) {
    var config = getTextEditorConfig(options);
    config.value = isDefined(options.value) ? options.value : null;
    options.editorName = 'dxNumberBox';
    options.editorOptions = config;
  };

  var prepareBooleanEditor = function prepareBooleanEditor(options) {
    if (options.parentType === 'filterRow' || options.parentType === 'filterBuilder') {
      prepareSelectBox(extend(options, {
        lookup: {
          displayExpr: function displayExpr(data) {
            if (data === true) {
              return options.trueText || 'true';
            } else if (data === false) {
              return options.falseText || 'false';
            }
          },
          dataSource: [true, false]
        }
      }));
    } else {
      prepareCheckBox(options);
    }
  };

  function watchLookupDataSource(options) {
    if (options.row && options.row.watch && options.parentType === 'dataRow') {
      var editorOptions = options.editorOptions || {};
      options.editorOptions = editorOptions;
      var selectBox;
      var onInitialized = editorOptions.onInitialized;

      editorOptions.onInitialized = function (e) {
        onInitialized && onInitialized.apply(this, arguments);
        selectBox = e.component;
        selectBox.on('disposing', stopWatch);
      };

      var dataSource;
      var stopWatch = options.row.watch(() => {
        dataSource = options.lookup.dataSource(options.row);
        return dataSource && dataSource.filter;
      }, () => {
        selectBox.option('dataSource', dataSource);
      }, row => {
        options.row = row;
      });
    }
  }

  function prepareSelectBox(options) {
    var lookup = options.lookup;
    var displayGetter;
    var dataSource;
    var postProcess;
    var isFilterRow = options.parentType === 'filterRow';

    if (lookup) {
      displayGetter = compileGetter(lookup.displayExpr);
      dataSource = lookup.dataSource;

      if (isFunction(dataSource) && !isWrapped(dataSource)) {
        dataSource = dataSource(options.row || {});
        watchLookupDataSource(options);
      }

      if (isObject(dataSource) || Array.isArray(dataSource)) {
        dataSource = normalizeDataSourceOptions(dataSource);

        if (isFilterRow) {
          postProcess = dataSource.postProcess;

          dataSource.postProcess = function (items) {
            if (this.pageIndex() === 0) {
              items = items.slice(0);
              items.unshift(null);
            }

            if (postProcess) {
              return postProcess.call(this, items);
            }

            return items;
          };
        }
      }

      var allowClearing = Boolean(lookup.allowClearing && !isFilterRow);
      options.editorName = 'dxSelectBox';
      options.editorOptions = getResultConfig({
        searchEnabled: true,
        value: options.value,
        valueExpr: options.lookup.valueExpr,
        searchExpr: options.lookup.searchExpr || options.lookup.displayExpr,
        allowClearing: allowClearing,
        showClearButton: allowClearing,
        displayExpr: function displayExpr(data) {
          if (data === null) {
            return options.showAllText;
          }

          return displayGetter(data);
        },
        dataSource: dataSource,
        onValueChanged: function onValueChanged(e) {
          var params = [e.value];
          !isFilterRow && params.push(e.component.option('text'));
          options.setValue.apply(this, params);
        }
      }, options);
    }
  }

  function prepareCheckBox(options) {
    options.editorName = 'dxCheckBox';
    options.editorOptions = getResultConfig({
      elementAttr: {
        id: options.id
      },
      value: isDefined(options.value) ? options.value : undefined,
      hoverStateEnabled: !options.readOnly,
      focusStateEnabled: !options.readOnly,
      activeStateEnabled: false,
      onValueChanged: function onValueChanged(e) {
        options.setValue && options.setValue(e.value, e
        /* for selection */
        );
      }
    }, options);
  }

  var createEditorCore = function createEditorCore(that, options) {
    var $editorElement = $(options.editorElement);

    if (options.editorName && options.editorOptions && $editorElement[options.editorName]) {
      if (options.editorName === 'dxCheckBox' || options.editorName === 'dxSwitch') {
        if (!options.isOnForm) {
          $editorElement.addClass(that.addWidgetPrefix(CHECKBOX_SIZE_CLASS));
          $editorElement.parent().addClass(EDITOR_INLINE_BLOCK);
        }
      }

      that._createComponent($editorElement, options.editorName, options.editorOptions);

      if (options.editorName === 'dxDateBox') {
        var dateBox = $editorElement.dxDateBox('instance');

        var defaultEnterKeyHandler = dateBox._supportedKeys()['enter'];

        dateBox.registerKeyHandler('enter', e => {
          if (dateBox.option('opened')) {
            defaultEnterKeyHandler(e);
          }

          return true;
        });
      }

      if (options.editorName === 'dxTextArea') {
        $editorElement.dxTextArea('instance').registerKeyHandler('enter', function (event) {
          if (normalizeKeyName(event) === 'enter' && !event.ctrlKey && !event.shiftKey) {
            event.stopPropagation();
          }
        });
      }
    }
  };

  return {
    createEditor: function createEditor($container, options) {
      options.cancel = false;
      options.editorElement = getPublicElement($container);

      if (!isDefined(options.tabIndex)) {
        options.tabIndex = this.option('tabIndex');
      }

      if (options.lookup) {
        prepareSelectBox(options);
      } else {
        switch (options.dataType) {
          case 'date':
          case 'datetime':
            prepareDateBox(options);
            break;

          case 'boolean':
            prepareBooleanEditor(options);
            break;

          case 'number':
            prepareNumberBox(options);
            break;

          default:
            prepareTextBox(options);
            break;
        }
      }

      if (options.parentType === 'dataRow' && options.editorType) {
        options.editorName = options.editorType;
      }

      this.executeAction('onEditorPreparing', options);

      if (options.cancel) {
        return;
      }

      if (options.parentType === 'dataRow' && !options.isOnForm && !isDefined(options.editorOptions.showValidationMark)) {
        options.editorOptions.showValidationMark = false;
      }

      createEditorCore(this, options);
      this.executeAction('onEditorPrepared', options);
    }
  };
}();

export default EditorFactoryMixin;
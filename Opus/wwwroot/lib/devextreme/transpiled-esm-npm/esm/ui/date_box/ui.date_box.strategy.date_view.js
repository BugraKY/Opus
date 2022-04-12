import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
var window = getWindow();
import DateView from './ui.date_view';
import DateBoxStrategy from './ui.date_box.strategy';
import { inputType } from '../../core/utils/support';
import { extend } from '../../core/utils/extend';
import dateUtils from './ui.date_utils';
import messageLocalization from '../../localization/message';
var DateViewStrategy = DateBoxStrategy.inherit({
  NAME: 'DateView',
  getDefaultOptions: function getDefaultOptions() {
    return extend(this.callBase(), {
      openOnFieldClick: true,
      applyButtonText: messageLocalization.format('OK'),
      'dropDownOptions.showTitle': true
    });
  },
  getDisplayFormat: function getDisplayFormat(displayFormat) {
    return displayFormat || dateUtils.FORMATS_MAP[this.dateBox.option('type')];
  },
  popupConfig: function popupConfig(config) {
    return {
      toolbarItems: this.dateBox._popupToolbarItemsConfig(),
      onInitialized: config.onInitialized,
      defaultOptionsRules: [{
        device: {
          platform: 'android'
        },
        options: {
          width: 333,
          height: 331
        }
      }, {
        device: function device(_device) {
          var platform = _device.platform;
          return platform === 'generic' || platform === 'ios';
        },
        options: {
          width: 'auto',
          height: 'auto'
        }
      }, {
        device: function device(_device2) {
          var platform = _device2.platform;
          var phone = _device2.phone;
          return platform === 'generic' && phone;
        },
        options: {
          width: 333,
          maxWidth: '100%',
          maxHeight: '100%',
          height: 'auto',
          position: {
            collision: 'flipfit flip'
          }
        }
      }, {
        device: {
          platform: 'ios',
          phone: true
        },
        options: {
          width: '100%',
          position: {
            my: 'bottom',
            at: 'bottom',
            of: window
          }
        }
      }]
    };
  },
  _renderWidget: function _renderWidget() {
    if (inputType(this.dateBox.option('mode')) && this.dateBox._isNativeType() || this.dateBox.option('readOnly')) {
      if (this._widget) {
        this._widget.$element().remove();

        this._widget = null;
      }

      return;
    }

    var popup = this._getPopup();

    if (this._widget) {
      this._widget.option(this._getWidgetOptions());
    } else {
      var element = $('<div>').appendTo(popup.$content());
      this._widget = this._createWidget(element);
    }

    this._widget.$element().appendTo(this._getWidgetContainer());
  },
  _getWidgetName: function _getWidgetName() {
    return DateView;
  },
  renderOpenedState: function renderOpenedState() {
    this.callBase();

    if (this._widget) {
      this._widget.option('value', this._widget._getCurrentDate());
    }
  },
  _getWidgetOptions: function _getWidgetOptions() {
    return {
      value: this.dateBoxValue() || new Date(),
      type: this.dateBox.option('type'),
      minDate: this.dateBox.dateOption('min') || new Date(1900, 0, 1),
      maxDate: this.dateBox.dateOption('max') || new Date(Date.now() + 50 * dateUtils.ONE_YEAR),
      onDisposing: function () {
        this._widget = null;
      }.bind(this)
    };
  }
});
export default DateViewStrategy;
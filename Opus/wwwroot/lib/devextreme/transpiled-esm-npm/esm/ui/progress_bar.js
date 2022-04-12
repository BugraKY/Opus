import $ from '../core/renderer';
import TrackBar from './track_bar';
import { extend } from '../core/utils/extend';
import { isFunction } from '../core/utils/type';
import registerComponent from '../core/component_registrator'; // STYLE progressBar

var PROGRESSBAR_CLASS = 'dx-progressbar';
var PROGRESSBAR_CONTAINER_CLASS = 'dx-progressbar-container';
var PROGRESSBAR_RANGE_CONTAINER_CLASS = 'dx-progressbar-range-container';
var PROGRESSBAR_RANGE_CLASS = 'dx-progressbar-range';
var PROGRESSBAR_WRAPPER_CLASS = 'dx-progressbar-wrapper';
var PROGRESSBAR_STATUS_CLASS = 'dx-progressbar-status';
var PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER = 'dx-progressbar-animating-container';
var PROGRESSBAR_INDETERMINATE_SEGMENT = 'dx-progressbar-animating-segment';
var ProgressBar = TrackBar.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      value: 0,
      statusFormat: function statusFormat(ratio) {
        return 'Progress: ' + Math.round(ratio * 100) + '%';
      },
      showStatus: true,
      onComplete: null,

      /**
      * @name dxProgressBarOptions.activeStateEnabled
      * @hidden
      */
      activeStateEnabled: false,
      statusPosition: 'bottom left',
      _animatingSegmentCount: 0
      /**
      * @name dxProgressBarOptions.focusStateEnabled
      * @hidden
      */

      /**
      * @name dxProgressBarOptions.accessKey
      * @hidden
      */

      /**
      * @name dxProgressBarOptions.tabIndex
      * @hidden
      */

    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: function device(_device) {
        return _device.platform === 'android';
      },
      options: {
        _animatingSegmentCount: 2
      }
    }]);
  },
  _initMarkup: function _initMarkup() {
    this._renderStatus();

    this._createCompleteAction();

    this.callBase();
    this.$element().addClass(PROGRESSBAR_CLASS);

    this._$wrapper.addClass(PROGRESSBAR_WRAPPER_CLASS);

    this._$bar.addClass(PROGRESSBAR_CONTAINER_CLASS);

    this.setAria('role', 'progressbar');
    $('<div>').addClass(PROGRESSBAR_RANGE_CONTAINER_CLASS).appendTo(this._$wrapper).append(this._$bar);

    this._$range.addClass(PROGRESSBAR_RANGE_CLASS);

    this._toggleStatus(this.option('showStatus'));
  },
  _useTemplates: function _useTemplates() {
    return false;
  },
  _createCompleteAction: function _createCompleteAction() {
    this._completeAction = this._createActionByOption('onComplete');
  },
  _renderStatus: function _renderStatus() {
    this._$status = $('<div>').addClass(PROGRESSBAR_STATUS_CLASS);
  },
  _renderIndeterminateState: function _renderIndeterminateState() {
    this._$segmentContainer = $('<div>').addClass(PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER);
    var segments = this.option('_animatingSegmentCount');

    for (var i = 0; i < segments; i++) {
      $('<div>').addClass(PROGRESSBAR_INDETERMINATE_SEGMENT).addClass(PROGRESSBAR_INDETERMINATE_SEGMENT + '-' + (i + 1)).appendTo(this._$segmentContainer);
    }

    this._$segmentContainer.appendTo(this._$wrapper);
  },
  _toggleStatus: function _toggleStatus(value) {
    var splitPosition = this.option('statusPosition').split(' ');

    if (value) {
      if (splitPosition[0] === 'top' || splitPosition[0] === 'left') {
        this._$status.prependTo(this._$wrapper);
      } else {
        this._$status.appendTo(this._$wrapper);
      }
    } else {
      this._$status.detach();
    }

    this._togglePositionClass();
  },
  _togglePositionClass: function _togglePositionClass() {
    var position = this.option('statusPosition');
    var splitPosition = position.split(' ');

    this._$wrapper.removeClass('dx-position-top-left dx-position-top-right dx-position-bottom-left dx-position-bottom-right dx-position-left dx-position-right');

    var positionClass = 'dx-position-' + splitPosition[0];

    if (splitPosition[1]) {
      positionClass += '-' + splitPosition[1];
    }

    this._$wrapper.addClass(positionClass);
  },
  _toggleIndeterminateState: function _toggleIndeterminateState(value) {
    if (value) {
      this._renderIndeterminateState();

      this._$bar.toggle(false);
    } else {
      this._$bar.toggle(true);

      this._$segmentContainer.remove();

      delete this._$segmentContainer;
    }
  },
  _renderValue: function _renderValue() {
    var val = this.option('value');
    var max = this.option('max');

    if (!val && val !== 0) {
      this._toggleIndeterminateState(true);

      return;
    }

    if (this._$segmentContainer) {
      this._toggleIndeterminateState(false);
    }

    if (val === max) {
      this._completeAction();
    }

    this.callBase();

    this._setStatus();
  },
  _setStatus: function _setStatus() {
    var format = this.option('statusFormat');

    if (isFunction(format)) {
      format = format.bind(this);
    } else {
      format = function format(value) {
        return value;
      };
    }

    var statusText = format(this._currentRatio, this.option('value'));

    this._$status.text(statusText);
  },
  _dispose: function _dispose() {
    this._$status.remove();

    this.callBase();
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'statusFormat':
        this._setStatus();

        break;

      case 'showStatus':
        this._toggleStatus(args.value);

        break;

      case 'statusPosition':
        this._toggleStatus(this.option('showStatus'));

        break;

      case 'onComplete':
        this._createCompleteAction();

        break;

      case '_animatingSegmentCount':
        break;

      default:
        this.callBase(args);
    }
  }
  /**
  * @name dxProgressBar.registerKeyHandler
  * @publicName registerKeyHandler(key, handler)
  * @hidden
  */

  /**
  * @name dxProgressBar.focus
  * @publicName focus()
  * @hidden
  */

});
registerComponent('dxProgressBar', ProgressBar);
export default ProgressBar;
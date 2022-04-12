import { getWidth, getHeight } from '../core/utils/size';
import $ from '../core/renderer';
import { getNavigator } from '../core/utils/window';
var navigator = getNavigator();
import { animation } from '../core/utils/support';
import { current, isMaterial, isGeneric } from './themes';
import { extend } from '../core/utils/extend';
import devices from '../core/devices';
import registerComponent from '../core/component_registrator';
import Widget from './widget/ui.widget'; // STYLE loadIndicator

var LOADINDICATOR_CLASS = 'dx-loadindicator';
var LOADINDICATOR_WRAPPER_CLASS = 'dx-loadindicator-wrapper';
var LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
var LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
var LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
var LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';
var LOADINDICATOR_IMAGE_CLASS = 'dx-loadindicator-image';
var LoadIndicator = Widget.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return extend(this.callBase(), {
      indicatorSrc: '',

      /**
      * @name dxLoadIndicatorOptions.disabled
      * @hidden
      */

      /**
      * @name dxLoadIndicatorOptions.activeStateEnabled
      * @hidden
      */
      activeStateEnabled: false,

      /**
       * @name dxLoadIndicatorOptions.hoverStateEnabled
       * @default false
       * @hidden
      */
      hoverStateEnabled: false,

      /**
      * @name dxLoadIndicatorOptions.focusStateEnabled
      * @hidden
      */

      /**
      * @name dxLoadIndicatorOptions.accessKey
      * @hidden
      */

      /**
      * @name dxLoadIndicatorOptions.tabIndex
      * @hidden
      */
      _animatingSegmentCount: 1,
      _animatingSegmentInner: false
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    var themeName = current();
    return this.callBase().concat([{
      device: function device() {
        var realDevice = devices.real();
        var obsoleteAndroid = realDevice.platform === 'android' && !/chrome/i.test(navigator.userAgent);
        return obsoleteAndroid;
      },
      options: {
        viaImage: true
      }
    }, {
      device: function device() {
        return isMaterial(themeName);
      },
      options: {
        _animatingSegmentCount: 2,
        _animatingSegmentInner: true
      }
    }, {
      device: function device() {
        return isGeneric(themeName);
      },
      options: {
        _animatingSegmentCount: 7
      }
    }]);
  },
  _useTemplates: function _useTemplates() {
    return false;
  },
  _init: function _init() {
    this.callBase();
    this.$element().addClass(LOADINDICATOR_CLASS);
  },
  _initMarkup: function _initMarkup() {
    this.callBase();

    this._renderWrapper();

    this._renderIndicatorContent();

    this._renderMarkup();
  },
  _renderWrapper: function _renderWrapper() {
    this._$wrapper = $('<div>').addClass(LOADINDICATOR_WRAPPER_CLASS);
    this.$element().append(this._$wrapper);
  },
  _renderIndicatorContent: function _renderIndicatorContent() {
    this._$content = $('<div>').addClass(LOADINDICATOR_CONTENT_CLASS);

    this._$wrapper.append(this._$content);
  },
  _renderMarkup: function _renderMarkup() {
    if (animation() && !this.option('viaImage') && !this.option('indicatorSrc')) {
      // B236922
      this._renderMarkupForAnimation();
    } else {
      this._renderMarkupForImage();
    }
  },
  _renderMarkupForAnimation: function _renderMarkupForAnimation() {
    var animatingSegmentInner = this.option('_animatingSegmentInner');
    this._$indicator = $('<div>').addClass(LOADINDICATOR_ICON_CLASS);

    this._$content.append(this._$indicator); // Indicator markup


    for (var i = this.option('_animatingSegmentCount'); i >= 0; --i) {
      var $segment = $('<div>').addClass(LOADINDICATOR_SEGMENT_CLASS).addClass(LOADINDICATOR_SEGMENT_CLASS + i);

      if (animatingSegmentInner) {
        $segment.append($('<div>').addClass(LOADINDICATOR_SEGMENT_INNER_CLASS));
      }

      this._$indicator.append($segment);
    }
  },
  _renderMarkupForImage: function _renderMarkupForImage() {
    var indicatorSrc = this.option('indicatorSrc');

    this._$wrapper.addClass(LOADINDICATOR_IMAGE_CLASS);

    if (indicatorSrc) {
      this._$wrapper.css('backgroundImage', 'url(' + indicatorSrc + ')');
    }
  },
  _renderDimensions: function _renderDimensions() {
    this.callBase();

    this._updateContentSizeForAnimation();
  },
  _updateContentSizeForAnimation: function _updateContentSizeForAnimation() {
    if (!this._$indicator) {
      return;
    }

    var width = this.option('width');
    var height = this.option('height');

    if (width || height) {
      width = getWidth(this.$element());
      height = getHeight(this.$element());
      var minDimension = Math.min(height, width);

      this._$wrapper.css({
        height: minDimension,
        width: minDimension,
        fontSize: minDimension
      });
    }
  },
  _clean: function _clean() {
    this.callBase();

    this._removeMarkupForAnimation();

    this._removeMarkupForImage();
  },
  _removeMarkupForAnimation: function _removeMarkupForAnimation() {
    if (!this._$indicator) {
      return;
    }

    this._$indicator.remove();

    delete this._$indicator;
  },
  _removeMarkupForImage: function _removeMarkupForImage() {
    this._$wrapper.css('backgroundImage', 'none');
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case '_animatingSegmentCount':
      case '_animatingSegmentInner':
      case 'indicatorSrc':
        this._invalidate();

        break;

      default:
        this.callBase(args);
    }
  }
  /**
  * @name dxLoadIndicator.registerKeyHandler
  * @publicName registerKeyHandler(key, handler)
  * @hidden
  */

  /**
  * @name dxLoadIndicator.focus
  * @publicName focus()
  * @hidden
  */

});
registerComponent('dxLoadIndicator', LoadIndicator);
export default LoadIndicator;
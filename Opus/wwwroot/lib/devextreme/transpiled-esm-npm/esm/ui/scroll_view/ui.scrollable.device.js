import devices from '../../core/devices';
import { nativeScrolling, touch } from '../../core/utils/support';
export var deviceDependentOptions = function deviceDependentOptions() {
  return [{
    device: function device() {
      return !nativeScrolling;
    },
    options: {
      useNative: false
    }
  }, {
    device: function device(_device) {
      return !devices.isSimulator() && devices.real().deviceType === 'desktop' && _device.platform === 'generic';
    },
    options: {
      bounceEnabled: false,
      scrollByThumb: true,
      scrollByContent: touch,
      showScrollbar: 'onHover'
    }
  }];
};
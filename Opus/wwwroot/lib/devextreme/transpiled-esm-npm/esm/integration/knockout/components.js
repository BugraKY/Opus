// eslint-disable-next-line no-restricted-imports
import ko from 'knockout';
import { getImageContainer } from '../../core/utils/icon';

if (ko) {
  ko.bindingHandlers.dxControlsDescendantBindings = {
    init: function init(_, valueAccessor) {
      return {
        controlsDescendantBindings: ko.unwrap(valueAccessor())
      };
    }
  };
  ko.bindingHandlers.dxIcon = {
    init: function init(element, valueAccessor) {
      var options = ko.utils.unwrapObservable(valueAccessor()) || {};
      var iconElement = getImageContainer(options);
      ko.virtualElements.emptyNode(element);

      if (iconElement) {
        ko.virtualElements.prepend(element, iconElement.get(0));
      }
    },
    update: function update(element, valueAccessor) {
      var options = ko.utils.unwrapObservable(valueAccessor()) || {};
      var iconElement = getImageContainer(options);
      ko.virtualElements.emptyNode(element);

      if (iconElement) {
        ko.virtualElements.prepend(element, iconElement.get(0));
      }
    }
  };
  ko.virtualElements.allowedBindings.dxIcon = true;
}
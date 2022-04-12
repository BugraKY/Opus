import { render as _render } from 'inferno';
import { InfernoEffectHost, hydrate } from '@devextreme/runtime/inferno';
import { createElement as _createElement } from 'inferno-create-element';
import domAdapter from './dom_adapter';
import { cleanDataRecursive } from './element_data';
import injector from './utils/dependency_injector';

var remove = element => {
  var {
    parentNode
  } = element;

  if (parentNode) {
    cleanDataRecursive(element);
    parentNode.$V = element.$V;

    _render(null, parentNode);

    parentNode.appendChild(element);
    element.innerHTML = '';
    delete parentNode.$V;
  }

  delete element.$V;
};

export default injector({
  createElement: (component, props) => _createElement(component, props),
  remove,
  onAfterRender: () => {
    InfernoEffectHost.callEffects();
  },
  onPreRender: () => {
    InfernoEffectHost.lock();
  },
  render: (component, props, container, replace) => {
    if (!replace) {
      var {
        parentNode
      } = container;
      var nextNode = container === null || container === void 0 ? void 0 : container.nextSibling;
      var rootNode = domAdapter.createElement('div');
      rootNode.appendChild(container);
      var mountNode = domAdapter.createDocumentFragment().appendChild(rootNode);
      var vNodeAlreadyExists = !!container.$V;
      vNodeAlreadyExists && remove(container);
      hydrate(_createElement(component, props), mountNode);
      container.$V = mountNode.$V;

      if (parentNode) {
        parentNode.insertBefore(container, nextNode);
      }
    } else {
      _render(_createElement(component, props), container);
    }
  }
});
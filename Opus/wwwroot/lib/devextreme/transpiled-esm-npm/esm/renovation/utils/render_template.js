import { render } from "inferno";
import { createElement } from "inferno-create-element";
export function renderTemplate(template, props, container) {
  setTimeout(() => {
    render(createElement(template, props), container === null || container === void 0 ? void 0 : container.get(0));
  }, 0);
}
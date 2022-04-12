"use strict";

exports.stubComponent = stubComponent;

function stubComponent(componentName) {
  return /*#__PURE__*/function () {
    function NoComponent() {
      // TODO: make correct exceptions here and in decorators
      throw new Error("Module '".concat(componentName, "' not found"));
    }

    NoComponent.getInstance = function getInstance() {};

    return NoComponent;
  }();
}
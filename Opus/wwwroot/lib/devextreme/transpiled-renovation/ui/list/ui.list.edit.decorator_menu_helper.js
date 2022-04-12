"use strict";

exports.default = void 0;
var EditDecoratorMenuHelperMixin = {
  _menuEnabled: function _menuEnabled() {
    return !!this._menuItems().length;
  },
  _menuItems: function _menuItems() {
    return this._list.option('menuItems');
  },
  _deleteEnabled: function _deleteEnabled() {
    return this._list.option('allowItemDeleting');
  },
  _fireMenuAction: function _fireMenuAction($itemElement, action) {
    this._list._itemEventHandlerByHandler($itemElement, action, {}, {
      excludeValidators: ['disabled', 'readOnly']
    });
  }
};
var _default = EditDecoratorMenuHelperMixin;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
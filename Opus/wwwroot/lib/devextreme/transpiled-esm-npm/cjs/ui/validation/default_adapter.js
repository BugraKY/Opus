"use strict";

exports.default = void 0;

var _class = _interopRequireDefault(require("../../core/class"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultAdapter = _class.default.inherit({
  ctor: function ctor(editor, validator) {
    var _this = this;

    this.editor = editor;
    this.validator = validator;
    this.validationRequestsCallbacks = [];

    var handler = function handler(args) {
      _this.validationRequestsCallbacks.forEach(function (item) {
        return item(args);
      });
    };

    editor.validationRequest.add(handler);
    editor.on('disposing', function () {
      editor.validationRequest.remove(handler);
    });
  },
  getValue: function getValue() {
    return this.editor.option('value');
  },
  getCurrentValidationError: function getCurrentValidationError() {
    return this.editor.option('validationError');
  },
  bypass: function bypass() {
    return this.editor.option('disabled');
  },
  applyValidationResults: function applyValidationResults(params) {
    this.editor.option({
      validationErrors: params.brokenRules,
      validationStatus: params.status
    });
  },
  reset: function reset() {
    this.editor.reset();
  },
  focus: function focus() {
    this.editor.focus();
  }
});

var _default = DefaultAdapter;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
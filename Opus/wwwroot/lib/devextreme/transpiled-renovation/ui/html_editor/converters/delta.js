"use strict";

exports.default = void 0;

var _converterController = _interopRequireDefault(require("../converterController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeltaConverter = /*#__PURE__*/function () {
  function DeltaConverter() {}

  var _proto = DeltaConverter.prototype;

  _proto.setQuillInstance = function setQuillInstance(quillInstance) {
    this.quillInstance = quillInstance;
  };

  _proto.toHtml = function toHtml() {
    if (!this.quillInstance) {
      return;
    }

    return this._isQuillEmpty() ? '' : this.quillInstance.getSemanticHTML(0, this.quillInstance.getLength() + 1);
  };

  _proto._isQuillEmpty = function _isQuillEmpty() {
    var delta = this.quillInstance.getContents();
    return delta.length() === 1 && this._isDeltaEmpty(delta);
  };

  _proto._isDeltaEmpty = function _isDeltaEmpty(delta) {
    return delta.reduce(function (__, _ref) {
      var insert = _ref.insert;
      return insert.indexOf('\n') !== -1;
    });
  };

  return DeltaConverter;
}();

_converterController.default.addConverter('delta', DeltaConverter);

var _default = DeltaConverter;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
"use strict";

exports.default = void 0;

var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SizeStyle = {};

if (_devextremeQuill.default) {
  SizeStyle = _devextremeQuill.default.import('attributors/style/size');
  SizeStyle.whitelist = null;
}

var _default = SizeStyle;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
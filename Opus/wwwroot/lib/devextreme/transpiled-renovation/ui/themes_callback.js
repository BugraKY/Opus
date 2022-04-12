"use strict";

exports.themeReadyCallback = void 0;

var _callbacks = _interopRequireDefault(require("../core/utils/callbacks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var themeReadyCallback = new _callbacks.default();
exports.themeReadyCallback = themeReadyCallback;
"use strict";

exports.default = void 0;

var _query_implementation = require("./query_implementation");

var query = function query() {
  var impl = Array.isArray(arguments[0]) ? 'array' : 'remote';
  return _query_implementation.queryImpl[impl].apply(this, arguments);
};

var _default = query;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
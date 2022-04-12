"use strict";

exports.default = void 0;

var _graph = _interopRequireDefault(require("./graph"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validator = {
  validate: function validate(data, incidentOccurred) {
    var result = null;

    if (this._hasCycle(data)) {
      result = 'E2006';
      incidentOccurred('E2006');
    }

    return result;
  },
  _hasCycle: function _hasCycle(data) {
    return _graph.default.struct.hasCycle(data);
  }
};
var _default = validator;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
"use strict";

exports.default = void 0;

var _class = _interopRequireDefault(require("./class"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Guid = _class.default.inherit({
  /**
  * @name Guid.ctor
  * @publicName ctor()
  */

  /**
  * @name Guid.ctor
  * @publicName ctor(value)
  * @param1 value:string
  */
  ctor: function ctor(value) {
    if (value) {
      value = String(value);
    }

    this._value = this._normalize(value || this._generate());
  },
  _normalize: function _normalize(value) {
    value = value.replace(/[^a-f0-9]/ig, '').toLowerCase();

    while (value.length < 32) {
      value += '0';
    }

    return [value.substr(0, 8), value.substr(8, 4), value.substr(12, 4), value.substr(16, 4), value.substr(20, 12)].join('-');
  },
  _generate: function _generate() {
    var value = '';

    for (var i = 0; i < 32; i++) {
      value += Math.round(Math.random() * 15).toString(16);
    }

    return value;
  },
  toString: function toString() {
    return this._value;
  },
  valueOf: function valueOf() {
    return this._value;
  },
  toJSON: function toJSON() {
    return this._value;
  }
});

var _default = Guid;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
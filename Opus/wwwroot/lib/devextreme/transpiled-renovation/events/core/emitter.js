"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _common = require("../../core/utils/common");

var _class = _interopRequireDefault(require("../../core/class"));

var _callbacks = _interopRequireDefault(require("../../core/utils/callbacks"));

var _extend = require("../../core/utils/extend");

var _index = require("../utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Emitter = _class.default.inherit({
  ctor: function ctor(element) {
    this._$element = (0, _renderer.default)(element);
    this._cancelCallback = (0, _callbacks.default)();
    this._acceptCallback = (0, _callbacks.default)();
  },
  getElement: function getElement() {
    return this._$element;
  },
  validate: function validate(e) {
    return !(0, _index.isDxMouseWheelEvent)(e);
  },
  validatePointers: function validatePointers(e) {
    return (0, _index.hasTouches)(e) === 1;
  },
  allowInterruptionByMouseWheel: function allowInterruptionByMouseWheel() {
    return true;
  },
  configure: function configure(data) {
    (0, _extend.extend)(this, data);
  },
  addCancelCallback: function addCancelCallback(callback) {
    this._cancelCallback.add(callback);
  },
  removeCancelCallback: function removeCancelCallback() {
    this._cancelCallback.empty();
  },
  _cancel: function _cancel(e) {
    this._cancelCallback.fire(this, e);
  },
  addAcceptCallback: function addAcceptCallback(callback) {
    this._acceptCallback.add(callback);
  },
  removeAcceptCallback: function removeAcceptCallback() {
    this._acceptCallback.empty();
  },
  _accept: function _accept(e) {
    this._acceptCallback.fire(this, e);
  },
  _requestAccept: function _requestAccept(e) {
    this._acceptRequestEvent = e;
  },
  _forgetAccept: function _forgetAccept() {
    this._accept(this._acceptRequestEvent);

    this._acceptRequestEvent = null;
  },
  start: _common.noop,
  move: _common.noop,
  end: _common.noop,
  cancel: _common.noop,
  reset: function reset() {
    if (this._acceptRequestEvent) {
      this._accept(this._acceptRequestEvent);
    }
  },
  _fireEvent: function _fireEvent(eventName, e, params) {
    var eventData = (0, _extend.extend)({
      type: eventName,
      originalEvent: e,
      target: this._getEmitterTarget(e),
      delegateTarget: this.getElement().get(0)
    }, params);
    e = (0, _index.fireEvent)(eventData);

    if (e.cancel) {
      this._cancel(e);
    }

    return e;
  },
  _getEmitterTarget: function _getEmitterTarget(e) {
    return (this.delegateSelector ? (0, _renderer.default)(e.target).closest(this.delegateSelector) : this.getElement()).get(0);
  },
  dispose: _common.noop
});

var _default = Emitter;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
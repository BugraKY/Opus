import $ from '../../core/renderer';
import { noop } from '../../core/utils/common';
import Class from '../../core/class';
import Callbacks from '../../core/utils/callbacks';
import { extend } from '../../core/utils/extend';
import { isDxMouseWheelEvent, hasTouches, fireEvent } from '../utils/index';
var Emitter = Class.inherit({
  ctor: function ctor(element) {
    this._$element = $(element);
    this._cancelCallback = Callbacks();
    this._acceptCallback = Callbacks();
  },
  getElement: function getElement() {
    return this._$element;
  },
  validate: function validate(e) {
    return !isDxMouseWheelEvent(e);
  },
  validatePointers: function validatePointers(e) {
    return hasTouches(e) === 1;
  },
  allowInterruptionByMouseWheel: function allowInterruptionByMouseWheel() {
    return true;
  },
  configure: function configure(data) {
    extend(this, data);
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
  start: noop,
  move: noop,
  end: noop,
  cancel: noop,
  reset: function reset() {
    if (this._acceptRequestEvent) {
      this._accept(this._acceptRequestEvent);
    }
  },
  _fireEvent: function _fireEvent(eventName, e, params) {
    var eventData = extend({
      type: eventName,
      originalEvent: e,
      target: this._getEmitterTarget(e),
      delegateTarget: this.getElement().get(0)
    }, params);
    e = fireEvent(eventData);

    if (e.cancel) {
      this._cancel(e);
    }

    return e;
  },
  _getEmitterTarget: function _getEmitterTarget(e) {
    return (this.delegateSelector ? $(e.target).closest(this.delegateSelector) : this.getElement()).get(0);
  },
  dispose: noop
});
export default Emitter;
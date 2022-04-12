import { noop } from '../../core/utils/common';
import Class from '../../core/class';
var abstract = Class.abstract;
import { requestAnimationFrame, cancelAnimationFrame } from '../../animation/frame';
var Animator = Class.inherit({
  ctor: function ctor() {
    this._finished = true;
    this._stopped = false;
    this._proxiedStepCore = this._stepCore.bind(this);
  },
  start: function start() {
    this._stopped = false;
    this._finished = false;

    this._stepCore();
  },
  stop: function stop() {
    this._stopped = true;
    cancelAnimationFrame(this._stepAnimationFrame);
  },
  _stepCore: function _stepCore() {
    if (this._isStopped()) {
      this._stop();

      return;
    }

    if (this._isFinished()) {
      this._finished = true;

      this._complete();

      return;
    }

    this._step();

    this._stepAnimationFrame = requestAnimationFrame(this._proxiedStepCore);
  },
  _step: abstract,
  _isFinished: noop,
  _stop: noop,
  _complete: noop,
  _isStopped: function _isStopped() {
    return this._stopped;
  },
  inProgress: function inProgress() {
    return !(this._stopped || this._finished);
  }
});
export default Animator;
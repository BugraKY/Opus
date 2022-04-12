"use strict";

exports.GestureHandler = GestureHandler;
var _ln = Math.log;
var _LN2 = Math.LN2;

function GestureHandler(params) {
  var that = this;
  that._projection = params.projection;
  that._renderer = params.renderer;
  that._x = that._y = 0;

  that._subscribeToTracker(params.tracker);
}

GestureHandler.prototype = {
  constructor: GestureHandler,
  dispose: function dispose() {
    this._offTracker();

    this._offTracker = null;
  },
  _subscribeToTracker: function _subscribeToTracker(tracker) {
    var that = this;
    var isActive = false;
    that._offTracker = tracker.on({
      'start': function start(arg) {
        // TODO: This is an implicit dependency on the ControlBar which must be removed
        isActive = arg.data.name !== 'control-bar';

        if (isActive) {
          that._processStart(arg);
        }
      },
      'move': function move(arg) {
        if (isActive) {
          that._processMove(arg);
        }
      },
      'end': function end() {
        if (isActive) {
          that._processEnd();
        }
      },
      'zoom': function zoom(arg) {
        that._processZoom(arg);
      }
    });
  },
  setInteraction: function setInteraction(options) {
    this._processEnd();

    this._centeringEnabled = options.centeringEnabled;
    this._zoomingEnabled = options.zoomingEnabled;
  },
  _processStart: function _processStart(arg) {
    if (this._centeringEnabled) {
      this._x = arg.x;
      this._y = arg.y;

      this._projection.beginMoveCenter();
    }
  },
  _processMove: function _processMove(arg) {
    var that = this;

    if (that._centeringEnabled) {
      that._renderer.root.attr({
        cursor: 'move'
      });

      that._projection.moveCenter([that._x - arg.x, that._y - arg.y]);

      that._x = arg.x;
      that._y = arg.y;
    }
  },
  _processEnd: function _processEnd() {
    if (this._centeringEnabled) {
      this._renderer.root.attr({
        cursor: 'default'
      });

      this._projection.endMoveCenter();
    }
  },
  _processZoom: function _processZoom(arg) {
    var that = this;
    var delta;
    var screenPosition;
    var coords;

    if (that._zoomingEnabled) {
      if (arg.delta) {
        delta = arg.delta;
      } else if (arg.ratio) {
        delta = _ln(arg.ratio) / _LN2;
      }

      if (that._centeringEnabled) {
        screenPosition = that._renderer.getRootOffset();
        screenPosition = [arg.x - screenPosition.left, arg.y - screenPosition.top];
        coords = that._projection.fromScreenPoint(screenPosition);
      }

      that._projection.changeScaledZoom(delta);

      if (that._centeringEnabled) {
        that._projection.setCenterByPoint(coords, screenPosition);
      }
    }
  }
};
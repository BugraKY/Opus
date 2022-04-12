"use strict";

exports.prepareSegmentRectPoints = exports._test_prepareSegmentRectPoints = void 0;
Object.defineProperty(exports, "refreshPaths", {
  enumerable: true,
  get: function get() {
    return _renderer.refreshPaths;
  }
});

var _renderer = require("./core/renderers/renderer");

var _iterator = require("../core/utils/iterator");

// 'var' because JSHint throws W021 error
var prepareSegmentRectPoints = function prepareSegmentRectPoints(left, top, width, height, borderOptions) {
  var maxSW = ~~((width < height ? width : height) / 2);
  var sw = borderOptions.width || 0;
  var newSW = sw < maxSW ? sw : maxSW;
  left = left + newSW / 2;
  top = top + newSW / 2;
  width = width - newSW;
  height = height - newSW;
  var right = left + width;
  var bottom = top + height;
  var points = [];
  var segments = [];
  var segmentSequence;
  var visiblyOpt = 0;
  var prevSegmentVisibility = 0;
  var allSegment = {
    top: [[left, top], [right, top]],
    right: [[right, top], [right, bottom]],
    bottom: [[right, bottom], [left, bottom]],
    left: [[left, bottom], [left, top]]
  };
  (0, _iterator.each)(allSegment, function (seg) {
    var visibility = !!borderOptions[seg];
    visiblyOpt = visiblyOpt * 2 + ~~visibility;
  });

  switch (visiblyOpt) {
    case 13:
    case 9:
      segmentSequence = ['left', 'top', 'right', 'bottom'];
      break;

    case 11:
      segmentSequence = ['bottom', 'left', 'top', 'right'];
      break;

    default:
      segmentSequence = ['top', 'right', 'bottom', 'left'];
  }

  (0, _iterator.each)(segmentSequence, function (_, seg) {
    var segmentVisibility = !!borderOptions[seg];

    if (!prevSegmentVisibility && segments.length) {
      points.push(segments);
      segments = [];
    }

    if (segmentVisibility) {
      (0, _iterator.each)(allSegment[seg].slice(prevSegmentVisibility), function (_, segment) {
        segments = segments.concat(segment);
      });
    }

    prevSegmentVisibility = ~~segmentVisibility;
  });
  segments.length && points.push(segments);
  points.length === 1 && (points = points[0]);
  return {
    points: points,
    pathType: visiblyOpt === 15 ? 'area' : 'line'
  };
};

exports.prepareSegmentRectPoints = prepareSegmentRectPoints;

///#DEBUG
var _test_prepareSegmentRectPoints = function _test_prepareSegmentRectPoints() {
  var original = prepareSegmentRectPoints.original || prepareSegmentRectPoints;

  if (arguments[0]) {
    exports.prepareSegmentRectPoints = prepareSegmentRectPoints = arguments[0];
  }

  prepareSegmentRectPoints.original = original;

  prepareSegmentRectPoints.restore = function () {
    exports.prepareSegmentRectPoints = prepareSegmentRectPoints = original;
  };

  return prepareSegmentRectPoints;
}; ///#ENDDEBUG


exports._test_prepareSegmentRectPoints = _test_prepareSegmentRectPoints;
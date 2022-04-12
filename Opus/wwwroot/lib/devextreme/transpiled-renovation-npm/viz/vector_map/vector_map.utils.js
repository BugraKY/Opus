"use strict";

exports.generateDataKey = generateDataKey;
var nextDataKey = 1;

function generateDataKey() {
  return 'vectormap-data-' + nextDataKey++;
}
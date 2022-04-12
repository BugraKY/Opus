"use strict";

exports.forEachGroup = void 0;

var forEachGroup = function forEachGroup(data, callback, level) {
  data = data || [];
  level = level || 0;

  for (var i = 0; i < data.length; i++) {
    var group = data[i];
    callback(group, level);

    if (group && group.items && group.items.length) {
      forEachGroup(group.items, callback, level + 1);
    }
  }
};

exports.forEachGroup = forEachGroup;
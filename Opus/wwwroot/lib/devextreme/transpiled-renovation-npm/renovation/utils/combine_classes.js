"use strict";

exports.combineClasses = combineClasses;

function combineClasses(classesMap) {
  return Object.keys(classesMap).filter(function (p) {
    return classesMap[p];
  }).join(" ");
}
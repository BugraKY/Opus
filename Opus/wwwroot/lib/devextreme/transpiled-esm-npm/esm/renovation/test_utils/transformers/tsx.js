var fs = require('fs');

var tsJest = require('ts-jest');

var getCacheKey = require('./get_cache_key');

var THIS_FILE = fs.readFileSync(__filename);
var jestTransformer = tsJest.createTransformer();

var addCreateElementImport = src => "import React from 'react'; ".concat(src);

module.exports = {
  process(src, filename, config) {
    return jestTransformer.process(filename.indexOf('__tests__') > -1 ? src : addCreateElementImport(src), filename, config);
  },

  getCacheKey(fileData, filePath, configStr) {
    return getCacheKey(fileData, filePath, configStr, THIS_FILE);
  }

};
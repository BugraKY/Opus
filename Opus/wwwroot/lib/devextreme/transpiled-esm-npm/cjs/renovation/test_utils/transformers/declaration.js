"use strict";

var _require = require('@devextreme-generator/core'),
    compileCode = _require.compileCode;

var _require2 = require('@devextreme-generator/build-helpers'),
    getTsConfig = _require2.getTsConfig;

var generator = require('@devextreme-generator/inferno').default;

var ts = require('typescript');

var path = require('path');

var fs = require('fs');

var tsJest = require('ts-jest');

var _getCacheKey = require('./get_cache_key');

var _require3 = require('../../../../build/gulp/generator/generator-options'),
    BASE_GENERATOR_OPTIONS_WITH_JQUERY = _require3.BASE_GENERATOR_OPTIONS_WITH_JQUERY;

var THIS_FILE = fs.readFileSync(__filename);
var jestTransformer = tsJest.createTransformer();
var TS_CONFIG_PATH = 'build/gulp/generator/ts-configs/jest.tsconfig.json';
var tsConfig = getTsConfig(TS_CONFIG_PATH);
generator.options = BASE_GENERATOR_OPTIONS_WITH_JQUERY;
module.exports = {
  process: function process(src, filename, config) {
    if (filename.indexOf('test_components') !== -1 && path.extname(filename) === '.tsx') {
      var result = compileCode(generator, src, {
        path: filename,
        dirname: path.dirname(filename)
      }, true);

      if (result && result[1]) {
        var componentName = (result[1].code.match(/export default class (\w+) extends/) || [])[1];

        if (!componentName) {
          return '';
        }

        return jestTransformer.process( // eslint-disable-next-line spellcheck/spell-checker
        ts.transpileModule("".concat(result[0].code, "\n                ").concat(result[1].code.replace('export default', 'export ').replace(new RegExp("\\b".concat(componentName, "\\b"), 'g'), "".concat(componentName, "Class")).replace(new RegExp("import ".concat(componentName, "Component from\\s+\\S+")), "const ".concat(componentName, "Component = ").concat(componentName))), tsConfig).outputText, filename, config);
      }
    }

    return jestTransformer.process(src, filename, config);
  },
  getCacheKey: function getCacheKey(fileData, filePath, configStr) {
    return _getCacheKey(fileData, filePath, configStr, THIS_FILE);
  }
};
var {
  compileCode
} = require('@devextreme-generator/core');

var {
  getTsConfig
} = require('@devextreme-generator/build-helpers');

var generator = require('@devextreme-generator/inferno').default;

var ts = require('typescript');

var path = require('path');

var fs = require('fs');

var tsJest = require('ts-jest');

var getCacheKey = require('./get_cache_key');

var {
  BASE_GENERATOR_OPTIONS_WITH_JQUERY
} = require('../../../../build/gulp/generator/generator-options');

var THIS_FILE = fs.readFileSync(__filename);
var jestTransformer = tsJest.createTransformer();
var TS_CONFIG_PATH = 'build/gulp/generator/ts-configs/jest.tsconfig.json';
var tsConfig = getTsConfig(TS_CONFIG_PATH);
generator.options = BASE_GENERATOR_OPTIONS_WITH_JQUERY;
module.exports = {
  process(src, filename, config) {
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

  getCacheKey(fileData, filePath, configStr) {
    return getCacheKey(fileData, filePath, configStr, THIS_FILE);
  }

};
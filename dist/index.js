'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generate = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _parser = require('./src/parser');

var _parser2 = _interopRequireDefault(_parser);

var _generator = require('./src/generator');

var _generator2 = _interopRequireDefault(_generator);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _helpers = require('./src/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.Promise = _bluebird2.default;
global.cache = _helpers2.default.cache;
global.logger = function (message) {
  return console.debug('\x1B[33mswagger-generator-express::\x1B[0m ' + message);
};

var writeOutput = async function writeOutput(data, config) {
  return _helpers2.default.file.save(config, 'output', data);
};
var writeError = async function writeError(data, config) {
  return _helpers2.default.file.save(config, 'error', data);
};
var internalGenerate = async function internalGenerate(config) {
  var startTime = new Date();
  logger('generate documentation started at \x1B[36m' + startTime.toString() + '\x1B[0m ...');
  var customConfig = config;
  // eslint-disable-next-line global-require, import/no-dynamic-require
  // load config from file
  if (typeof config === 'string') customConfig = await _helpers2.default.file.load(config);
  // prepare configs
  var mergedConfig = _lodash2.default.merge({}, _config2.default, customConfig);
  // validate configs
  _helpers2.default.validation.validateConfig(mergedConfig);
  // set global settings
  global.concurrencyLimit = mergedConfig.concurrencyLimit || 0;
  // Generate documentation for both package and endpoints

  var _ref = await _bluebird2.default.all([_parser2.default.packageInfo(), _generator2.default.endpoints(mergedConfig)]),
      _ref2 = _slicedToArray(_ref, 2),
      pkgInfo = _ref2[0],
      endpointsDocs = _ref2[1];
  // prepare output


  var generatedJson = _lodash2.default.merge({}, mergedConfig.specs, { tags: _lodash2.default.flatten(mergedConfig.tags) }, {
    info: pkgInfo
  }, {
    paths: endpointsDocs.documentation
  });
  var unDocumented = endpointsDocs.undocumented;
  // write output files
  await _bluebird2.default.all([writeOutput(generatedJson, mergedConfig.output), writeError(unDocumented, mergedConfig.output)]);
  // clear cache
  cache.clear();
  var endTime = new Date();
  logger('\x1B[32m' + _lodash2.default.keys(endpointsDocs.documentation).length + ' endpoints success\x1B[0m, \x1B[31m' + endpointsDocs.undocumented.length + ' error found\x1B[0m');
  logger('generated documentation finished at \x1B[36m' + endTime.toString() + ' \x1B[0m');
  logger('total execution time \x1B[36m' + (endTime - startTime) / 1000 + ' sec\x1B[0m');
};

var generate = exports.generate = async function generate(config) {
  return internalGenerate(config);
};

exports.default = {
  generate: async function generate(config) {
    return internalGenerate(config);
  }
};
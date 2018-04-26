'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _yamljs = require('yamljs');

var _yamljs2 = _interopRequireDefault(_yamljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var writeFile = (0, _util.promisify)(_fs2.default.writeFile);
var stat = (0, _util.promisify)(_fs2.default.stat);

// save output to disk
exports.default = {
  save: async function save(config, fileName, data) {
    var targetFormat = _lodash2.default.lowerCase(_lodash2.default.trimStart(config.format, '.'));
    var ext = void 0;
    if (targetFormat === 'json') ext = '.json';else if (targetFormat === 'yml' || targetFormat === 'yaml') ext = '.yml';
    if (!ext) throw new Error('unknown output format');
    logger('saving file ' + fileName + ext);
    var fileContent = ext === '.json' ? JSON.stringify(data, null, 2) : _yamljs2.default.stringify(data, 99, 2);
    var filePath = _path2.default.join(config.location, './' + fileName + ext);
    await writeFile(filePath, fileContent);
  },
  load: async function load(filePath) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    if (await stat(filePath)) return require(filePath);
    throw new Error('file ' + filePath + ' not found');
  }
};
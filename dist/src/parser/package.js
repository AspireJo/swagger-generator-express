'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stat = (0, _util.promisify)(_fs2.default.stat);
var read = (0, _util.promisify)(_fs2.default.readFile);

exports.default = async function () {
  var pkgFilePath = _path2.default.join(process.cwd(), './package.json');
  if (await stat(pkgFilePath)) {
    logger('parse package.json content');
    var pkg = JSON.parse((await read(pkgFilePath, 'utf8')));
    return {
      version: pkg.version,
      title: pkg.name,
      description: pkg.description
    };
  }
  throw new Error('Cannot locate package.json');
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsdocApi = require('jsdoc-api');

var _jsdocApi2 = _interopRequireDefault(_jsdocApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// returns raw documentation
exports.default = function (file) {
  var ext = _lodash2.default.endsWith(file, '.js') ? '' : '.js';
  logger('read raw documentation for ' + file + ext);
  return _jsdocApi2.default.explain({
    files: '' + file + ext,
    configure: _path2.default.join(__dirname, './../../config/jsdoc.conf')
  });
};
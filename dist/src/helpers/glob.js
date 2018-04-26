'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _globPromise = require('glob-promise');

var _globPromise2 = _interopRequireDefault(_globPromise);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// returns file name
var getName = function getName(file) {
  return file.substr(file.lastIndexOf('/')).slice(1).replace('.js', '');
};

exports.default = {
  list: async function list(pattern) {
    return (0, _globPromise2.default)(pattern);
  },
  asMap: async function asMap(pattern) {
    var files = await (0, _globPromise2.default)(pattern);
    return _lodash2.default.fromPairs(files.map(function (file) {
      return [getName(file), file];
    }));
  }
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cache = {};
exports.default = {
  get: function get(type, key) {
    if (cache[type] && cache[type][key]) return cache[type][key];
    return undefined;
  },
  set: function set(type, key, value) {
    if (!cache[type]) cache[type] = {};
    cache[type][key] = value;
  },
  clear: function clear() {
    _lodash2.default.forOwn(cache, function (x) {
      return delete cache[x];
    });
  }
};
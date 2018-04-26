'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseValue = function parseValue(value, type) {
  if (type === 'string') return _lodash2.default.trim(value);
  if (type === 'integer') return parseInt(_lodash2.default.trim(value), 10);
  if (type === 'float' || type === 'number') return parseFloat(_lodash2.default.trim(value));
  if (type === 'boolean') return _lodash2.default.trim(value).toLowerCase() === 'true';
  return value;
};

exports.default = async function (typeDesc, value) {
  if (typeDesc.type === 'array') return value.split(',').map(function (a) {
    return parseValue(a, typeDesc.model);
  });
  return parseValue(value, typeDesc.model);
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _endpoints = require('./endpoints');

var _endpoints2 = _interopRequireDefault(_endpoints);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var _parameter = require('./parameter');

var _parameter2 = _interopRequireDefault(_parameter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  endpoints: _endpoints2.default,
  api: _api2.default,
  response: _response2.default,
  parameter: _parameter2.default
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _specs = require('./specs');

var _specs2 = _interopRequireDefault(_specs);

var _responses = require('./responses');

var _responses2 = _interopRequireDefault(_responses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  concurrencyLimit: 0,
  specs: _specs2.default,
  customResponses: _responses2.default,
  patterns: {
    fileName: /_(delete|get|post|put|patch)\.(v\d+)(\.\S+)*\.js$/
  }
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _package = require('./package');

var _package2 = _interopRequireDefault(_package);

var _description = require('./description');

var _description2 = _interopRequireDefault(_description);

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _value = require('./value');

var _value2 = _interopRequireDefault(_value);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  packageInfo: _package2.default,
  description: _description2.default,
  controller: _controller2.default,
  value: _value2.default,
  model: _model2.default
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsDoc = require('./jsDoc');

var _jsDoc2 = _interopRequireDefault(_jsDoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getPropertyType: async function getPropertyType(property) {
    return _jsDoc2.default.getTypeDescription(property);
  }
};
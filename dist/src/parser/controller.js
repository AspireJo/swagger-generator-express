'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsDoc = require('./jsDoc');

var _jsDoc2 = _interopRequireDefault(_jsDoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  // returns return model info
  getReturnModel: async function getReturnModel(documentaion) {
    return _jsDoc2.default.getTypeDescription(_lodash2.default.head(documentaion.returns));
  },

  // returns tags list
  getTags: async function getTags(documentaion) {
    return _jsDoc2.default.findTagByName(documentaion, 'tags');
  },

  // returns routes list
  getRoute: async function getRoute(documentaion) {
    return _jsDoc2.default.findTagByName(documentaion, 'route');
  },

  // returns schemas list
  getSchemas: async function getSchemas(documentaion) {
    return _jsDoc2.default.findTagByName(documentaion, 'schema');
  },

  // returns respose codes list
  getResponses: async function getResponses(documentaion) {
    return _jsDoc2.default.findTagByName(documentaion, 'responseCodes');
  }
};
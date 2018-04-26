'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsDoc = require('./jsDoc');

var _jsDoc2 = _interopRequireDefault(_jsDoc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getClassDescription: async function getClassDescription(fileDescription) {
    return _jsDoc2.default.findByFilter(fileDescription, function (a) {
      return a.kind === 'class' && a.scope === 'global' && !a.undocumented;
    });
  },

  getControllerDescription: async function getControllerDescription(fileDescription) {
    return _jsDoc2.default.findByFilter(fileDescription, function (a) {
      return a.kind === 'function' && a.name === 'controller' && !a.undocumented;
    });
  },

  getTypeDescription: async function getTypeDescription(type) {
    return _jsDoc2.default.getTypeDescription(type);
  }
};
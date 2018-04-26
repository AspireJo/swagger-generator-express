'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Custom erros
exports.default = {
  undocumented: function undocumented(file, message) {
    return {
      file: file.slice(file.indexOf('/app/')),
      message: message,
      code: -1001
    };
  },
  unkonwn: function unkonwn(name, type) {
    return {
      file: name,
      message: 'unknown ' + type + ' ' + name,
      code: -1002
    };
  }
};
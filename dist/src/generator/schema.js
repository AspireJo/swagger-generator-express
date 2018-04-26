'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reader = require('./../reader');

var _reader2 = _interopRequireDefault(_reader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getSchemaDescription: async function getSchemaDescription(filePath) {
    var cached = cache.get('schema', filePath);
    if (cached) return cached;
    logger('generate schema ' + filePath + ' documentation');
    var rawDoc = await _reader2.default.jsDoc(filePath);
    var scehmaDesc = {
      file: filePath,
      // eslint-disable-next-line global-require, import/no-dynamic-require
      schema: require(filePath),
      docs: rawDoc.filter(function (item) {
        return (item.kind === 'member' || item.kind === 'constant') && (item.scope === 'static' || item.scope === 'global') && !item.undocumented;
      })
    };
    cache.set('schema', filePath, scehmaDesc);
    return scehmaDesc;
  }
};
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var path = require('path');

module.exports = {
  baseRoute: '/{version}/{route}',
  specs: {
    host: 'aspire.jo'
  },
  patterns: {
    controllerInfoResolver: async function controllerInfoResolver(fileName) {
      var _$exec = /_(delete|get|post|put|patch)\.(v\d+)(\.\S+)*\.js$/.exec(fileName),
          _$exec2 = _slicedToArray(_$exec, 3),
          method = _$exec2[1],
          version = _$exec2[2];

      return { method: method, version: version };
    },
    models: path.resolve(__dirname, '../app/') + '/**/models/**/*.js',
    schemas: path.resolve(__dirname, '../app/') + '/**/schema/**/*.js',
    controllers: path.resolve(__dirname, '../app/') + '/**/controller/**/_*.js'
  },
  tags: [{ name: 'User', description: 'User management endpoints' }],
  output: {
    location: path.join(__dirname, '../app/documentation'),
    format: 'json'
  },
  params: {},
  versions: {},
  customResponses: {
    204: {
      description: 'No content',
      schema: {
        properties: {
          code: {
            type: 'number'
          },
          message: {
            type: 'string'
          }
        }
      }
    },
    403: {
      description: 'Unauthorized',
      schema: {
        properties: {
          code: {
            type: 'number'
          },
          message: {
            type: 'string'
          }
        }
      }
    }
  }
};
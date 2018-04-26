'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  getErrorResponses: async function getErrorResponses(apiDescription) {
    return {
      400: {
        description: 'Bad request',
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
      500: {
        description: apiDescription + ' Failed',
        schema: {
          properties: {
            message: {
              type: 'string'
            }
          }
        }
      }
    };
  },
  getOkResponse: async function getOkResponse(modelDescription, apiDescription, modelsMap) {
    logger('generate success response');
    if (!modelDescription) return { 200: { description: apiDescription + ' Succeed' } };
    var properties = await _model2.default.getDescription(modelDescription.model, modelsMap, modelDescription.description);
    var result = { 200: { description: apiDescription + ' Succeed', schema: {} } };
    if (modelDescription.type === 'array') result['200'].schema = _lodash2.default.merge({}, result['200'].schema, { type: 'array', items: { allOf: [{ type: 'object', properties: properties }] } });else result['200'].schema = _lodash2.default.merge({}, result['200'].schema, { type: 'object', properties: properties });
    return result;
  },
  getAdditionalResponses: async function getAdditionalResponses(responses, config) {
    if (!config.customResponses) return undefined;
    logger('generate additional responses');
    var result = {};
    responses.forEach(function (response) {
      result[response] = config.customResponses[response];
    });
    return result;
  }
};
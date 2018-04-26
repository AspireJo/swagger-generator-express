import _ from 'lodash';
import modelGenerator from './model';

export default {
  getErrorResponses: async apiDescription => ({
    400: {
      description: 'Bad request',
      schema: {
        properties: {
          code: {
            type: 'number',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
    500: {
      description: `${apiDescription} Failed`,
      schema: {
        properties: {
          message: {
            type: 'string',
          },
        },
      },
    },
  }),
  getOkResponse: async (modelDescription, apiDescription, modelsMap) => {
    logger('generate success response');
    if (!modelDescription) return { 200: { description: `${apiDescription} Succeed` } };
    const properties = await modelGenerator.getDescription(modelDescription.model, modelsMap, modelDescription.description);
    const result = { 200: { description: `${apiDescription} Succeed`, schema: {} } };
    if (modelDescription.type === 'array') result['200'].schema = _.merge({}, result['200'].schema, { type: 'array', items: { allOf: [{ type: 'object', properties }] } });
    else result['200'].schema = _.merge({}, result['200'].schema, { type: 'object', properties });
    return result;
  },
  getAdditionalResponses: async (responses, config) => {
    if (!config.customResponses) return undefined;
    logger('generate additional responses');
    const result = {};
    responses.forEach((response) => {
      result[response] = config.customResponses[response];
    });
    return result;
  },
};

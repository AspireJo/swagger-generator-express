const path = require('path');

module.exports = {
  baseRoute: '/{version}/{route}',
  specs: {
    host: 'aspire.jo',
  },
  patterns: {
    controllerInfoResolver: async (fileName) => {
      const [, method, version] = /_(delete|get|post|put|patch)\.(v\d+)(\.\S+)*\.js$/.exec(fileName);
      return { method, version };
    },
    models: `${path.resolve(__dirname, '../app/')}/**/models/**/*.js`,
    schemas: `${path.resolve(__dirname, '../app/')}/**/schema/**/*.js`,
    controllers: `${path.resolve(__dirname, '../app/')}/**/controller/**/_*.js`,
  },
  tags: [
    { name: 'User', description: 'User management endpoints' },
    { name: 'Tests', description: 'Test cases endpoints' },
  ],
  output: {
    location: path.join(__dirname, '../app/documentation'),
    format: 'json'
  },
  params: {
  },
  versions: {
    v2: [
      {
        name: 'Authorization',
        in: 'header',
        description: 'auth token',
        required: true,
        type: 'string',
      }
    ],
  },
  customResponses: {
    204: {
      description: 'No content',
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
    403: {
      description: 'Unauthorized',
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
    }
  }
};

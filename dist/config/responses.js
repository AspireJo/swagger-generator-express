'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
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
  401: {
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
  },
  403: {
    description: 'Forbidden',
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
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  validateConfig: function validateConfig(config) {
    // validate config
    if (!config) throw new Error('config is required');
    // destruct
    var baseRoute = config.baseRoute,
        specs = config.specs,
        patterns = config.patterns,
        output = config.output;
    // validate baseRoute

    if (!baseRoute) throw new Error('config.baseRoute is required');
    if (baseRoute.indexOf('{version}') < 0 || baseRoute.indexOf('{route}') < 0) throw new Error('config.baseRoute must contain {route} & {version}');
    // validate specs
    if (!specs) throw new Error('config.specs is required');
    if (!specs.swagger) throw new Error('config.specs.swagger is required');
    if (!specs.host) throw new Error('config.specs.host is required');
    if (!specs.basePath) throw new Error('config.specs.basePath is required');
    if (!specs.schemes || specs.schemes.length < 1) throw new Error('config.specs.schemes is required');
    if (!specs.consumes || specs.consumes.length < 1) throw new Error('config.specs.consumes is required');
    if (!specs.produces || specs.produces.length < 1) throw new Error('config.specs.produces is required');
    // validate tags
    // -----------------------------------------------
    // validate patterns
    if (!patterns) throw new Error('config.pattern is required');
    if (!patterns.controllerInfoResolver || typeof patterns.controllerInfoResolver !== 'function') throw new Error('confog.pattern.controllerInfoResolver is required');
    if (!patterns.models) throw new Error('confog.pattern.models is required');
    if (!patterns.schemas) throw new Error('confog.pattern.schemas is required');
    if (!patterns.controllers) throw new Error('confog.pattern.controllers is required');
    // validate output
    if (!output) throw new Error('config.output is required');
    if (!output.location) throw new Error('config.output.location is required');
    if (!output.format) throw new Error('config.output.format is required');
    var frmt = _lodash2.default.lowerCase(output.format);
    if (frmt !== 'json' && frmt !== 'yml' && frmt !== 'yaml') throw new Error('config.output.format must be json, yml ot yaml');
  }
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _exceptions = require('./../exceptions');

var _exceptions2 = _interopRequireDefault(_exceptions);

var _parser = require('./../parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// returns properties list
var getProperties = async function getProperties(rawDoc) {
  if (!rawDoc.properties) return undefined;
  var props = await Promise.map(rawDoc.properties, async function (property) {
    var typeDesc = await _parser2.default.description.getTypeDescription(property);
    return [[property.name, await _parser2.default.value(typeDesc, property.description)]];
  }, { concurrency: concurrencyLimit });
  return _lodash2.default.fromPairs(_lodash2.default.concat.apply(_lodash2.default, _toConsumableArray(props)));
};
// returns property description
var getPropertyDescription = async function getPropertyDescription(rawDoc) {
  return {
    description: rawDoc.description,
    type: rawDoc.type ? rawDoc.type.names[0] : undefined
  };
};
// returns the response body
var constructBodyRequest = async function constructBodyRequest(schemaPropsRes) {
  logger('generate body request');
  var bodyDescription = void 0;
  var isArrayBody = schemaPropsRes.filter(function (a) {
    return a.isBodyProp && a.name.indexOf('*') > -1;
  }).length > 0;
  var inBodyProps = schemaPropsRes.filter(function (a) {
    return a.isBodyProp;
  }).map(function (a) {
    return [a.name.replace('*.', ''), _lodash2.default.omit(a, ['isBodyProp', 'name'])];
  });
  if (!_lodash2.default.isEmpty(inBodyProps)) {
    var itemsWithNestedObjects = inBodyProps.filter(function (a) {
      return a[0].indexOf('.') > -1;
    });
    if (!_lodash2.default.isEmpty(itemsWithNestedObjects)) {
      var tempBodyDesc = [];
      inBodyProps.forEach(function (prop) {
        if (prop[0].indexOf('.') === -1) tempBodyDesc.push(prop);else {
          var key = prop[0].split('.')[0].trim();
          var subKey = prop[0].split('.')[1].trim();
          var x = tempBodyDesc.findIndex(function (a) {
            return a[0] === key;
          });
          if (x === -1) tempBodyDesc.push([key, []]);
          var indx = tempBodyDesc.findIndex(function (a) {
            return a[0] === key;
          });
          tempBodyDesc[indx][1] = _lodash2.default.concat([], tempBodyDesc[indx][1], [[subKey, prop[1]]]);
        }
      });
      bodyDescription = _lodash2.default.fromPairs(tempBodyDesc.map(function (x) {
        return Array.isArray(x[1]) ? [x[0], { type: 'object', properties: _lodash2.default.fromPairs(x[1]) }] : x;
      }));
    } else bodyDescription = _lodash2.default.fromPairs(inBodyProps);
    return _lodash2.default.merge({}, {
      name: 'requestBody',
      in: 'body',
      required: true,
      description: 'JSON object representing request body'
    }, isArrayBody ? {
      schema: {
        type: 'array',
        items: {
          properties: bodyDescription
        }
      }
    } : {
      schema: {
        type: 'object',
        properties: bodyDescription
      }
    });
  }
  return undefined;
};
exports.default = {
  // returns version parameters
  getVersionParameters: async function getVersionParameters(version, config) {
    return config.versions ? config.versions[version] || [] : [];
  },

  // returns url parameters
  getUrlParameters: async function getUrlParameters(route, config) {
    if (!config.params) return []; // no params defined
    var urlPars = [];
    _lodash2.default.forEach(_lodash2.default.split(route, '/').filter(function (a) {
      return a.startsWith('{');
    }).map(function (key) {
      return key.slice(1, -1);
    }), function (segmant) {
      urlPars.push(config.params[segmant] || undefined);
    });
    return urlPars.filter(function (a) {
      return a;
    });
  },

  // returns schema parameters
  getSchemaParameters: async function getSchemaParameters(schemaFiles, schemasMap) {
    if (!schemaFiles || !schemaFiles.length) return undefined; // no schema
    logger('generate schema parameters documentation');
    // map schemas
    var mapRes = await Promise.map(schemaFiles, async function (file) {
      var schemaLocation = schemasMap[file];
      if (!schemaLocation) throw _exceptions2.default.unkonwn(file, 'schema');
      return _schema2.default.getSchemaDescription(schemaLocation);
    }, { concurrency: concurrencyLimit });

    // no caching as the controller can combine any schemas together
    var schemaPropsRes = await Promise.map(mapRes, async function (schemaInfo) {
      var docs = schemaInfo.docs,
          file = schemaInfo.file;

      if (_lodash2.default.isEmpty(docs)) throw _exceptions2.default.undocumented(file, 'documentation missing for schema');
      // if schema has default & locale specific definition use the default as it should contain all props
      var schemaDef = _lodash2.default.isFunction(schemaInfo.schema) ? schemaInfo.schema({ body: {}, query: {}, params: {} }) : schemaInfo.schema.default || schemaInfo.schema;
      return Promise.map(_lodash2.default.toPairs(schemaDef), async function (input) {
        var _input = _slicedToArray(input, 2),
            shcemaPropKey = _input[0],
            schemaPropValue = _input[1];

        var propDoc = _lodash2.default.mapKeys(_lodash2.default.pickBy(docs, function (value) {
          return value.name.trim().replace(/"/g, '') === shcemaPropKey;
        }), function () {
          return 'val';
        }).val;
        if (!propDoc) return { status: 'invalid', shcemaPropKey: shcemaPropKey };
        var parameterDetails = {};
        if (schemaPropValue.in === 'body') parameterDetails = { isBodyProp: true, name: shcemaPropKey };else {
          parameterDetails = {
            required: !schemaPropValue.optional,
            name: shcemaPropKey,
            in: _lodash2.default.replace(schemaPropValue.in || 'query', 'params', 'path')
          };
        }
        return _lodash2.default.merge({}, (await getProperties(propDoc)), (await getPropertyDescription(propDoc)), parameterDetails);
      }, { concurrency: concurrencyLimit });
    }, { concurrency: concurrencyLimit });

    var aggregatedSchema = _lodash2.default.concat.apply(_lodash2.default, _toConsumableArray(schemaPropsRes));
    var missingProps = aggregatedSchema.filter(function (a) {
      return a.status;
    }).map(function (a) {
      return a.shcemaPropKey;
    });
    if (!_lodash2.default.isEmpty(missingProps)) throw _exceptions2.default.undocumented('schema file', 'documentation missing for properties: ' + missingProps.join(', '));
    var schemaPars = aggregatedSchema.filter(function (a) {
      return !a.isBodyProp;
    });
    return _lodash2.default.concat(schemaPars, (await constructBodyRequest(aggregatedSchema)));
  }
};
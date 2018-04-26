'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reader = require('./../reader');

var _reader2 = _interopRequireDefault(_reader);

var _parser = require('./../parser');

var _parser2 = _interopRequireDefault(_parser);

var _exceptions = require('./../exceptions');

var _exceptions2 = _interopRequireDefault(_exceptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// known types [primitive]
var KNOWN_TYPES = ['string', 'integer', 'boolean', 'float', 'number'];

// generate inline model documentation
var getInlineModelDescription = async function getInlineModelDescription(modelDescription) {
  if (!modelDescription) return undefined;
  var properties = {};
  var rawObjectDescription = modelDescription.slice(1, -1);
  rawObjectDescription.split(',').filter(function (a) {
    return !_lodash2.default.isEmpty(a);
  }).forEach(function (rawInlinePropertyDef) {
    var propDescription = rawInlinePropertyDef.split(':').filter(function (a) {
      return !_lodash2.default.isEmpty(a);
    });

    var _propDescription = _slicedToArray(propDescription, 3),
        propName = _propDescription[0],
        propType = _propDescription[1],
        propDesc = _propDescription[2];

    var prop = {};
    prop[propName] = { type: propType, description: propDesc };
    properties = _lodash2.default.merge({}, properties, prop);
  });
  return properties;
};

var getBaseModelDescription = async function getBaseModelDescription(modelPath, modelsMap) {
  var res = await _reader2.default.jsDoc(modelPath);
  var modelClassDescription = res.filter(function (item) {
    return item.kind === 'class' && item.scope === 'global' && item.augments;
  })['0'];
  // eslint-disable-next-line no-use-before-define
  if (modelClassDescription && modelClassDescription.augments) return recGetDescription(modelClassDescription.augments['0'], modelsMap, undefined);
  return undefined;
};

var getPropertyDescription = async function getPropertyDescription(property, modelsMap) {
  if (!property || property.undocumented) return undefined;
  var prop = await _parser2.default.model.getPropertyType(property);
  var description = void 0;
  if (KNOWN_TYPES.find(function (a) {
    return a === prop.model;
  })) description = { type: prop.model, description: prop.description };else {
    // eslint-disable-next-line no-use-before-define
    var des = await recGetDescription(prop.model, modelsMap, undefined);
    description = { description: prop.description, properties: des };
  }
  if (property.properties) {
    await _lodash2.default.forOwn(property.properties, async function (value) {
      var pp = await _parser2.default.model.getPropertyType(value);
      if (pp.type === 'array') description[value.name] = value.description.split(',');else description[value.name] = value.description;
    });
  }
  return prop.type === 'array' ? { type: 'array', items: description } : description;
};

// recursive get description
var recGetDescription = async function recGetDescription(modelName, modelsMap, modelDescription) {
  if (!modelName) return undefined; // unkown model
  if (KNOWN_TYPES.find(function (a) {
    return a === modelName;
  })) return { type: modelName }; // known type
  if (modelName === 'object') return getInlineModelDescription(modelDescription); // inline model
  logger('generate model ' + modelName + ' docuemntation');
  // check cache
  var cached = cache.get('model', modelName);
  if (cached) return cached;
  // get model path from map
  var modelPath = modelsMap[modelName];
  if (!modelPath) throw _exceptions2.default.unkonwn(modelName, 'model'); // unknown
  // read jsDoc
  var res = await _reader2.default.jsDoc(modelPath);
  // filter documentations
  var membersInfo = _lodash2.default.uniqBy(res.filter(function (item) {
    return item.kind === 'member' && (item.scope === 'instance' || item.scope === 'global' && !item.undocumented);
  }), 'name');
  if (!membersInfo) throw _exceptions2.default.undocumented(modelPath, 'missing documentation for model'); // missing
  // get properties documentation
  var propsRes = await Promise.map(membersInfo, async function (element) {
    var propDescription = await getPropertyDescription(element, modelsMap, modelPath);
    if (!propDescription) return { status: 'invalid', name: element.name };
    var x = {};
    x[element.name] = propDescription;
    return x;
  }, { concurrency: concurrencyLimit });
  // filter uncommented properties
  var invalidProps = propsRes.filter(function (a) {
    return a.status === 'invalid';
  });
  if (invalidProps.length > 0) throw _exceptions2.default.undocumented(modelPath, 'missing documentation for proeprties : ' + invalidProps.join(', '));
  // get parent model documentation
  var parentModelDesc = await getBaseModelDescription(modelPath, modelsMap);
  // construct documentation
  var modelDocumentation = _lodash2.default.merge({}, _lodash2.default.merge.apply(_lodash2.default, _toConsumableArray(propsRes)), parentModelDesc);
  // add to cache
  cache.set('model', modelName, modelDocumentation);
  return modelDocumentation;
};

exports.default = {
  getDescription: async function getDescription(modelName, modelsMap, modelDescription) {
    return recGetDescription(modelName, modelsMap, modelDescription);
  }
};
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

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var _parameter = require('./parameter');

var _parameter2 = _interopRequireDefault(_parameter);

var _exceptions = require('./../exceptions');

var _exceptions2 = _interopRequireDefault(_exceptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = async function (controller, modelsMap, schemasMap, config) {
  try {
    logger('generate controller ' + controller + ' docuemntation');
    // get raw documentation from file
    var rawJsDoc = await _reader2.default.jsDoc(controller);
    // parse controller's method & version

    var _ref = await config.patterns.controllerInfoResolver(controller),
        method = _ref.method,
        version = _ref.version;

    if (!method || !version) throw new Error('unknows method or version for controller ' + controller);
    // get controller documentstion
    var jsDocs = (await _parser2.default.description.getClassDescription(rawJsDoc)) || (await _parser2.default.description.getControllerDescription(rawJsDoc));
    if (!jsDocs || jsDocs.undocumented) throw _exceptions2.default.undocumented(controller, 'missing controller documentation');
    // parse controller's route, model, schema, tags, responses

    var _ref2 = await Promise.all([_parser2.default.controller.getRoute(jsDocs), _parser2.default.controller.getReturnModel(jsDocs), _parser2.default.controller.getSchemas(jsDocs), _parser2.default.controller.getTags(jsDocs), _parser2.default.controller.getResponses(jsDocs)]),
        _ref3 = _slicedToArray(_ref2, 5),
        routes = _ref3[0],
        model = _ref3[1],
        schema = _ref3[2],
        tags = _ref3[3],
        responses = _ref3[4];

    logger(routes.length + ' route/alias found for ' + controller);
    // get description text
    var descriptionText = jsDocs.classdesc || jsDocs.description;
    // generate end point documentation
    // contains responses and parameters

    var _ref4 = await Promise.all([_response2.default.getOkResponse(model, descriptionText, modelsMap), _response2.default.getErrorResponses(descriptionText), _parameter2.default.getVersionParameters(version, config), _parameter2.default.getSchemaParameters(schema, schemasMap), _response2.default.getAdditionalResponses(responses, config)]),
        _ref5 = _slicedToArray(_ref4, 5),
        okResponse = _ref5[0],
        errResponse = _ref5[1],
        versionParams = _ref5[2],
        schemaParams = _ref5[3],
        otherResponses = _ref5[4];
    // construct route documentation


    var routeDescription = _lodash2.default.merge({}, { tags: tags, description: descriptionText }, { responses: _lodash2.default.merge({}, okResponse, errResponse, otherResponses) });
    // construct route params documentation
    var versionAndSchemaParams = _lodash2.default.uniqBy(_lodash2.default.concat(versionParams, schemaParams).filter(function (a) {
      return a;
    }), 'name');
    // construct aliases documentation
    var genRes = await Promise.map(routes, async function (alias) {
      var route = _lodash2.default.replace(_lodash2.default.replace(config.baseRoute, '{version}', version), '{route}', _lodash2.default.trimStart(alias, '/'));
      var params = _lodash2.default.uniqBy(_lodash2.default.concat(_lodash2.default.cloneDeep(versionAndSchemaParams), (await _parameter2.default.getUrlParameters(route, config))).filter(function (a) {
        return a;
      }), 'name');
      var x = {};
      x[route] = {};
      x[route][method] = _lodash2.default.merge({}, routeDescription, { parameters: params });
      return x;
    }, { concurrency: concurrencyLimit });
    logger('finished controller ' + controller);
    // merge routes documentation
    return _lodash2.default.merge.apply(_lodash2.default, [{}].concat(_toConsumableArray(genRes)));
  } catch (ex) {
    if (ex.code && (ex.code === -1001 || ex.code === -1002)) return { file: ex.file, message: ex.message };
    return Promise.reject(ex);
  }
};
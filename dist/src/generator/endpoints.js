'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('./../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = async function (config) {
  // list models, schemas and controllers
  var _ref = await Promise.all([_helpers2.default.glob.asMap(config.patterns.models), _helpers2.default.glob.asMap(config.patterns.schemas), _helpers2.default.glob.list(config.patterns.controllers)]),
      _ref2 = _slicedToArray(_ref, 3),
      models = _ref2[0],
      schemas = _ref2[1],
      controllers = _ref2[2];
  // log number of globbed files


  logger('found : ' + _lodash2.default.keysIn(models).length + ' models, ' + _lodash2.default.keysIn(schemas).length + ' schema, ' + controllers.length + ' controller');
  // generate documentation
  var results = await Promise.map(controllers, async function (controller) {
    return (0, _api2.default)(controller, models, schemas, config);
  }, { concurrency: concurrencyLimit });
  // construct return object
  return { documentation: _lodash2.default.merge.apply(_lodash2.default, [{}].concat(_toConsumableArray(results.filter(function (a) {
      return !a.file;
    })))), undocumented: results.filter(function (a) {
      return a.file;
    }) };
};
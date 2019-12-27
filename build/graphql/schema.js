"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

var _vent = _interopRequireDefault(require("./queries/vent"));

var _co = _interopRequireDefault(require("./queries/co2"));

var _temps = _interopRequireDefault(require("./queries/temps"));

var _grlnd = _interopRequireDefault(require("./queries/grlnd"));

var _weather = _interopRequireDefault(require("./queries/weather"));

var _camera = _interopRequireDefault(require("./mutations/camera"));

var _setTemp = _interopRequireDefault(require("./mutations/setTemp"));

var _manualHeater = _interopRequireDefault(require("./mutations/manualHeater"));

var _grlnd2 = _interopRequireDefault(require("./mutations/grlnd"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = new _graphql.GraphQLSchema({
  query: new _graphql.GraphQLObjectType({
    name: 'SchemaQueries',
    fields: {
      vent: _vent.default,
      co2: _co.default,
      temps: _temps.default,
      weather: _weather.default,
      grlnd: _grlnd.default
    }
  }),
  mutation: new _graphql.GraphQLObjectType({
    name: 'SchemaMutations',
    fields: {
      setTemp: _setTemp.default,
      manualHeater: _manualHeater.default,
      camera: _camera.default,
      setGrlnd: _grlnd2.default
    }
  })
});

exports.default = _default;
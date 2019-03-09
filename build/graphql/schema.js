"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

var _vent = _interopRequireDefault(require("./queries/vent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = new _graphql.GraphQLSchema({
  query: new _graphql.GraphQLObjectType({
    name: 'SchemaQueries',
    fields: {
      vent: _vent.default
    }
  })
});

exports.default = _default;
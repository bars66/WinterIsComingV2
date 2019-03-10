"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

var _default = {
  type: new _graphql.GraphQLObjectType({
    name: 'Temp',
    fields: {
      canal: {
        type: _graphql.GraphQLFloat
      },
      inside: {
        type: _graphql.GraphQLFloat
      },
      lastUpdate: {
        type: _graphql.GraphQLString
      }
    }
  }),

  resolve(unused1, unused2, context) {
    return context.sensors.Temp.value;
  }

};
exports.default = _default;
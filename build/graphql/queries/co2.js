"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

var _default = {
  type: new _graphql.GraphQLObjectType({
    name: 'CO2',
    fields: {
      value: {
        type: _graphql.GraphQLInt
      }
    }
  }),

  resolve(unused1, unused2, context) {
    return context.sensors.Co2Room.value;
  }

};
exports.default = _default;
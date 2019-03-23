"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Co2GqlType = void 0;

var _graphql = require("graphql");

const Co2GqlType = new _graphql.GraphQLObjectType({
  name: 'CO2',
  fields: () => ({
    value: {
      type: _graphql.GraphQLInt
    },
    lastUpdate: {
      type: _graphql.GraphQLString
    },
    st: {
      type: _graphql.GraphQLInt
    },
    lastTrueValue: {
      type: Co2GqlType
    }
  })
});
exports.Co2GqlType = Co2GqlType;
var _default = {
  type: Co2GqlType,

  resolve(unused1, unused2, context) {
    return context.sensors.Co2Room.value;
  }

};
exports.default = _default;
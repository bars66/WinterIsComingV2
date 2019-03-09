"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

var _default = {
  type: new _graphql.GraphQLObjectType({
    name: 'Vent',
    fields: {
      "canaltTmp": {
        type: _graphql.GraphQLFloat
      },
      "insideTmp": {
        type: _graphql.GraphQLFloat
      },
      "heaterPower": {
        type: _graphql.GraphQLFloat
      },
      "ventEnabled": {
        type: _graphql.GraphQLBoolean
      },
      "heaterEnabled": {
        type: _graphql.GraphQLBoolean
      },
      "temp": {
        type: _graphql.GraphQLFloat
      },
      "heaterWatts": {
        type: _graphql.GraphQLFloat
      },
      "lastAnswer": {
        type: _graphql.GraphQLString
      },
      switchReason: {
        type: new _graphql.GraphQLObjectType({
          name: 'VentSwitchReasons',
          fields: {
            isEnabled: {
              type: _graphql.GraphQLBoolean
            },
            reason: {
              type: _graphql.GraphQLString
            }
          },

          resolve(unused, unused1, context) {
            return context.controllers.Vent.switchReason;
          }

        })
      }
    }
  }),

  resolve(unused1, unused2, context) {
    return context.controllers.Vent.params;
  }

};
exports.default = _default;
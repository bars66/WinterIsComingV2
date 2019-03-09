"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  type: new _graphql.GraphQLObjectType({
    name: 'Vent',
    fields: {
      canaltTmp: {
        type: _graphql.GraphQLFloat
      },
      insideTmp: {
        type: _graphql.GraphQLFloat
      },
      heaterPower: {
        type: _graphql.GraphQLFloat
      },
      ventEnabled: {
        type: _graphql.GraphQLBoolean
      },
      heaterEnabled: {
        type: _graphql.GraphQLBoolean
      },
      temp: {
        type: _graphql.GraphQLFloat
      },
      heaterWatts: {
        type: _graphql.GraphQLFloat
      },
      lastAnswer: {
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
            },
            time: {
              type: _graphql.GraphQLString
            }
          }
        })
      }
    }
  }),

  resolve(unused1, unused2, context) {
    return _objectSpread({}, context.controllers.Vent.params, {
      switchReason: context.controllers.Vent.switchReason
    });
  }

};
exports.default = _default;
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
    name: 'Grlnd',
    fields: {
      pwmGB: {
        type: _graphql.GraphQLInt
      },
      pwmRY: {
        type: _graphql.GraphQLInt
      },
      time: {
        type: _graphql.GraphQLInt
      },
      userBrightness: {
        type: _graphql.GraphQLInt
      }
    }
  }),

  resolve(unused1, unused2, context) {
    return _objectSpread({}, context.controllers.GrlndNyController.params);
  }

};
exports.default = _default;
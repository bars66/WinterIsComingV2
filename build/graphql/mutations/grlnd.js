"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

var _default = {
  type: _graphql.GraphQLBoolean,
  args: {
    pwmGB: {
      type: _graphql.GraphQLInt
    },
    pwmRY: {
      type: _graphql.GraphQLInt
    },
    time: {
      type: _graphql.GraphQLInt
    }
  },
  resolve: (unused, {
    pwmGB,
    pwmRY,
    time,
    userBrightness
  }, context) => {
    if (!!time) {
      context.controllers.GrlndNyController.setBlink({
        time
      });
    } else {
      context.controllers.GrlndNyController.changeParams({
        pwmGB,
        pwmRY
      });
    }

    return true;
  }
};
exports.default = _default;
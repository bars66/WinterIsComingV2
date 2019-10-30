"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

var _default = {
  type: _graphql.GraphQLBoolean,
  args: {
    action: {
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) // ENUM бы сюда, но не сегодня

    }
  },
  resolve: (unused, {
    action
  }, context) => {
    if (!['stop', 'start'].includes(action)) return false;
    context.controllers.Camera[action]();
    return true;
  }
};
exports.default = _default;
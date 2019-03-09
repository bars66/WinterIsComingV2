"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

var _default = {
  type: _graphql.GraphQLBoolean,
  args: {
    temp: {
      type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat)
    }
  },
  resolve: (unused, {
    temp
  }, context) => {
    context.controllers.Vent.setTemp(temp);
    return true;
  }
};
exports.default = _default;
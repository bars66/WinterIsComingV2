"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphql = require("graphql");

var _default = {
  type: _graphql.GraphQLBoolean,
  args: {
    isEnabled: {
      type: _graphql.GraphQLBoolean
    },
    manualControl: {
      type: _graphql.GraphQLBoolean
    }
  },
  resolve: (unused, {
    isEnabled,
    manualControl
  }, context) => {
    if (manualControl !== undefined) {
      context.controllers.Vent.setManual(manualControl);
    }

    if (isEnabled !== undefined) {
      if (isEnabled) {
        context.controllers.Vent.enable();
      } else {
        context.controllers.Vent.disable();
      } // TODO: Плохо так делать :(


      context.controllers.Vent.switchReason = {
        isEnabled,
        reason: 'MANUAL',
        time: new Date()
      };
    }

    return true;
  }
};
exports.default = _default;
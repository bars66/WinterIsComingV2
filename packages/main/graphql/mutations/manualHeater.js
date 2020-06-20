import {GraphQLBoolean} from 'graphql';

export default {
  type: GraphQLBoolean,
  args: {
    isEnabled: {type: GraphQLBoolean},
    manualControl: {type: GraphQLBoolean},
  },
  resolve: (unused, {isEnabled, manualControl}, context) => {
    if (manualControl !== undefined) {
      context.controllers.Vent.setManual(manualControl);
    }

    if (isEnabled !== undefined) {
      if (isEnabled) {
        context.controllers.Vent.enable();
      } else {
        context.controllers.Vent.disable();
      }
      // TODO: Плохо так делать :(
      context.controllers.Vent.switchReason = {
        isEnabled,
        reason: 'MANUAL',
        time: new Date(),
      };
    }

    return true;
  },
};

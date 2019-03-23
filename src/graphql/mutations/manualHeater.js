import { GraphQLBoolean, GraphQLFloat, GraphQLNonNull } from 'graphql'

export default {
  type: GraphQLBoolean,
  args: {
    isEnabled: { type: GraphQLBoolean }
  },
  resolve: (unused, { isEnabled }, context) => {

    if (isEnabled !== undefined) {
      if (isEnabled) {
        context.controllers.Vent.enable()
      } else {
        context.controllers.Vent.disable()
      }
      // TODO: Плохо так делать :(
      context.controllers.Vent.switchReason = {
        isEnabled,
        reason: 'MANUAL',
        time: new Date()
      }
    }

    return true
  }
}

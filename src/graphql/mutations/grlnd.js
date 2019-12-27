import { GraphQLBoolean, GraphQLInt, GraphQLNonNull } from 'graphql'

export default {
  type: GraphQLBoolean,
  args: {
    pwmGB: { type: GraphQLInt },
    pwmRY: { type: GraphQLInt },
    time: { type: GraphQLInt }

  },
  resolve: (unused, { pwmGB, pwmRY, time  }, context) => {
    if (!!time) {
      context.controllers.GrlndNyController.setBlink({time,})
    } else {
      console.log('mkadsd', pwmGB, pwmRY)
      context.controllers.GrlndNyController.changeParams({pwmGB, pwmRY})
    }

    return true
  }
}

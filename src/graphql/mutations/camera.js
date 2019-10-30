import { GraphQLBoolean, GraphQLString, GraphQLNonNull } from 'graphql'

export default {
  type: GraphQLBoolean,
  args: {
    action: { type: new GraphQLNonNull(GraphQLString) } // ENUM бы сюда, но не сегодня
  },
  resolve: (unused, { action }, context) => {
    if (!['stop', 'start'].includes(action)) return false;
    context.controllers.Camera[action]()

    return true
  }
}

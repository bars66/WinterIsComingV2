import { GraphQLObjectType, GraphQLInt } from 'graphql'

export default {
  type: new GraphQLObjectType({
    name: 'Grlnd',
    fields: {
      pwmGB: { type: GraphQLInt },
      pwmRY: { type: GraphQLInt },
      time: { type: GraphQLInt },
    }
  }),

  resolve (unused1, unused2, context) {
    return { ...context.controllers.GrlndNyController.params, }
  }
}

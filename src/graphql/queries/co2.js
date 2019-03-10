import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql'

export default {
  type: new GraphQLObjectType({
    name: 'CO2',
    fields: {
      value: { type: GraphQLInt }
    }
  }),

  resolve (unused1, unused2, context) {
    return context.sensors.Co2Room.value
  }
}

import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql'

export default {
  type: new GraphQLObjectType({
    name: 'CO2',
    fields: {
      value: { type: GraphQLInt },
      lastUpdate: { type: GraphQLString }
    }
  }),

  resolve (unused1, unused2, context) {
    return context.sensors.Co2Room.value
  }
}

import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLBoolean } from 'graphql'

export default {
  type: new GraphQLObjectType({
    name: 'Temp',
    fields: {
      canal: { type: GraphQLFloat },
      inside: { type: GraphQLFloat },
      lastUpdate: { type: GraphQLString }
    }
  }),

  resolve (unused1, unused2, context) {
    return context.sensors.Temp.value
  }
}

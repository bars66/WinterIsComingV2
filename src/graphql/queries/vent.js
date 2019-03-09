import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLBoolean } from 'graphql'

export default {
  type: new GraphQLObjectType({
    name: 'Vent',
    fields: {
      "canaltTmp": {type: GraphQLFloat},
      "insideTmp": {type: GraphQLFloat},
      "heaterPower": {type: GraphQLFloat},
      "ventEnabled": {type: GraphQLBoolean},
      "heaterEnabled": {type: GraphQLBoolean},
      "temp": {type: GraphQLFloat},
      "heaterWatts": {type: GraphQLFloat},
      "lastAnswer": {type: GraphQLString},
      switchReason: {type: new GraphQLObjectType({
        name: 'VentSwitchReasons',
        fields: {
          isEnabled: {type: GraphQLBoolean},
          reason: {type: GraphQLString},
        },
        resolve(unused, unused1, context) {
          return context.controllers.Vent.switchReason;
        }
      })},
    },
  }),

  resolve(unused1, unused2, context) {
    return context.controllers.Vent.params;
  }
}
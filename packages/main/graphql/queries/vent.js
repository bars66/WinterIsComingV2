import {GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLBoolean} from 'graphql';

export default {
  type: new GraphQLObjectType({
    name: 'Vent',
    fields: {
      canaltTmp: {type: GraphQLFloat},
      insideTmp: {type: GraphQLFloat},
      heaterPower: {type: GraphQLFloat},
      ventEnabled: {type: GraphQLBoolean},
      heaterEnabled: {type: GraphQLBoolean},
      temp: {type: GraphQLFloat},
      heaterWatts: {type: GraphQLFloat},
      lastAnswer: {type: GraphQLString},
      manualControl: {type: GraphQLBoolean},
      switchReason: {
        type: new GraphQLObjectType({
          name: 'VentSwitchReasons',
          fields: {
            isEnabled: {type: GraphQLBoolean},
            reason: {type: GraphQLString},
            time: {type: GraphQLString},
          },
        }),
      },
    },
  }),

  resolve(unused1, unused2, context) {
    return {
      ...context.controllers.Vent.params,
      switchReason: context.controllers.Vent.switchReason,
      manualControl: context.controllers.Vent.manualControl,
    };
  },
};

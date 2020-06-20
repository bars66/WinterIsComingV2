import {GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean} from 'graphql';

export const Co2GqlType = new GraphQLObjectType({
  name: 'CO2',
  fields: () => ({
    value: {type: GraphQLInt},
    lastUpdate: {type: GraphQLString},
    st: {type: GraphQLInt},
    lastTrueValue: {type: Co2GqlType},
  }),
});

export default {
  type: Co2GqlType,

  resolve(unused1, unused2, context) {
    return context.sensors.Co2Room.value;
  },
};

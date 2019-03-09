import {GraphQLBoolean, GraphQLFloat, GraphQLNonNull} from 'graphql'

export default {
  type: GraphQLBoolean,
  args: {
    temp: {type: new GraphQLNonNull(GraphQLFloat)},

  },
  resolve: (unused, {temp}, context) => {
    context.controllers.Vent.setTemp(temp);

    return true;
  }
}
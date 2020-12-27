import {GraphQLInt, GraphQLObjectType, GraphQLList, GraphQLString} from 'graphql';
import {Flower, Statuses} from '../../controllers/flower';
import {Controller, fields} from './controller';

export const FlowerType = new GraphQLObjectType({
  name: 'Flower',
  interfaces: () => [Controller],
  fields: () => ({
    ...fields,
    statuses: {
      type: new GraphQLObjectType({
        name: 'FlowerStatuses',
        fields: {
          sensors: {type: new GraphQLList(GraphQLInt)},
          pumps: {type: new GraphQLList(GraphQLInt)},
          currentChannel: {type: GraphQLInt},
          lastPump: {type: GraphQLInt},
        },
      }),
      resolve(controller: Flower): Statuses {
        return controller.getStatuses();
      },
    },
  }),
});

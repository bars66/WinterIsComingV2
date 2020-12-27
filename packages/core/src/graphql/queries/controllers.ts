import {GraphQLList, GraphQLError, GraphQLObjectType, GraphQLString} from 'graphql';
import {Context} from '../../context';
import {Controller} from '../controllers/controller';
import type {AbstractController} from '../../controllers/abstract';

export default {
  type: new GraphQLList(
    new GraphQLObjectType({
      name: 'ControllerWithId',
      fields: {
        controller: {type: Controller},
        id: {type: GraphQLString},
      },
    })
  ),
  async resolve(
    unused: any,
    args: any,
    context: Context
  ): Promise<Array<{controller: AbstractController; id: string}>> {
    if (!context.controllers) {
      throw new GraphQLError('Not initialized');
    }

    return Object.entries(context.controllers).map(([id, controller]) => ({id, controller}));
  },
};

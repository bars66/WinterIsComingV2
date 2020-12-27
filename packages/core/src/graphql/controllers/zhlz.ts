import {GraphQLInt, GraphQLObjectType, GraphQLList, GraphQLString} from 'graphql';
import {Zhlz} from '../../controllers/zhlz';
import {Controller, fields} from './controller';

export const ZhlzType = new GraphQLObjectType({
  name: 'Zhlz',
  interfaces: () => [Controller],
  fields: () => ({
    ...fields,
    position: {
      type: new GraphQLList(GraphQLInt),
      resolve(controller: Zhlz): Promise<Array<number>> {
        return controller.getPosition();
      },
    },
    motorsStatus: {
      type: new GraphQLList(GraphQLString),
      resolve(controller: Zhlz): Array<string> {
        return controller.getMotorsStatus();
      },
    },
  }),
});

import {GraphQLObjectType, GraphQLString} from 'graphql';
import {Controller, fields} from './controller';

export const AbstractControllerType = new GraphQLObjectType({
  name: 'AbstractControllerType',
  interfaces: () => [Controller],
  fields: () => ({
    ...fields,
  }),
});

import {GraphQLBoolean, GraphQLObjectType, GraphQLSchema} from 'graphql';

import controllers from './queries/controllers';
import executeAction from './mutations/action';
import {AbstractControllerType} from './controllers/abstractController';
import {ZhlzType} from './controllers/zhlz';
import {FlowerType} from './controllers/flower';
import {ButtonType} from './controllers/actions/action';

export default new GraphQLSchema({
  types: [AbstractControllerType, ZhlzType, FlowerType, ButtonType],
  query: new GraphQLObjectType({
    name: 'SchemaQueries',
    fields: {
      controllers,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'SchemaMutations',
    fields: {
      executeAction,
    },
  }),
});

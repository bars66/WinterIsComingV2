import {GraphQLBoolean, GraphQLObjectType, GraphQLSchema} from 'graphql';

import executeAction from './mutations/action';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'SchemaQueries',
    fields: {
      test: {
        type: GraphQLBoolean,

        resolve(unused1, unused2, context) {
          return true;
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'SchemaMutations',
    fields: {
      executeAction,
    },
  }),
});

import {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType
} from 'graphql'

import vent from './queries/vent'
import setTemp from './mutations/setTemp';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'SchemaQueries',
    fields: {
      vent
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'SchemaMutations',
    fields: {
      setTemp
    }
  })
})

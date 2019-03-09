import {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType
} from 'graphql'

import vent from './queries/vent'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'SchemaQueries',
    fields: {
      vent
    }
  })
})

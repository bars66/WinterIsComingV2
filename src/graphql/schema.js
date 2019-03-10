import {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType
} from 'graphql'

import vent from './queries/vent'
import co2 from './queries/co2'
import setTemp from './mutations/setTemp'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'SchemaQueries',
    fields: {
      vent,
      co2
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'SchemaMutations',
    fields: {
      setTemp
    }
  })
})

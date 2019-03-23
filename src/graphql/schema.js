import {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType
} from 'graphql'

import vent from './queries/vent'
import co2 from './queries/co2'
import temps from './queries/temps'

import setTemp from './mutations/setTemp'
import manualHeater from './mutations/manualHeater'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'SchemaQueries',
    fields: {
      vent,
      co2,
      temps,
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'SchemaMutations',
    fields: {
      setTemp,
      manualHeater,
    }
  })
})

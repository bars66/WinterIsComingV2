import {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType
} from 'graphql'

import vent from './queries/vent'
import co2 from './queries/co2'
import temps from './queries/temps'
import weather from './queries/weather'
import camera from './mutations/camera'
import setTemp from './mutations/setTemp'
import manualHeater from './mutations/manualHeater'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'SchemaQueries',
    fields: {
      vent,
      co2,
      temps,
      weather
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'SchemaMutations',
    fields: {
      setTemp,
      manualHeater,
      camera
    }
  })
})

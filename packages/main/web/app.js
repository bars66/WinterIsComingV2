import express from 'express'
import GqlSchema from '../graphql/schema'

import indexRoute from './routes'

const graphqlHTTP = require('express-graphql')

const app = express()
const port = process.env.PORT

export default function init (context) {
  const { logger } = context

  app.use(express.static('public'))
  app.use('/graphql', graphqlHTTP({
    schema: GqlSchema,
    graphiql: true,
    context
  }))

  app.use((req, res, next) => {
    req.context = context

    next()
  })

  app.get('/', indexRoute('main'))
  app.get('/planshet1', indexRoute('planshet1'))
  app.get('/camera', indexRoute('camera'))

  app.listen(port, () => logger.info({ port }, 'Server start'))
}

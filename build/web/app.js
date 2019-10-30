"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _express = _interopRequireDefault(require("express"));

var _schema = _interopRequireDefault(require("../graphql/schema"));

var _index = _interopRequireDefault(require("./routes/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const graphqlHTTP = require('express-graphql');

const app = (0, _express.default)();
const port = process.env.PORT;

function init(context) {
  const {
    logger
  } = context;
  app.use(_express.default.static('public'));
  app.use('/graphql', graphqlHTTP({
    schema: _schema.default,
    graphiql: true,
    context
  }));
  app.use((req, res, next) => {
    req.context = context;
    next();
  });
  app.get('/', (0, _index.default)('main'));
  app.get('/planshet1', (0, _index.default)('planshet1'));
  app.get('/camera', (0, _index.default)('camera'));
  app.listen(port, () => logger.info({
    port
  }, 'Server start'));
}
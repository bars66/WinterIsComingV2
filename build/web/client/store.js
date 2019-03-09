"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getStore;

var _redux = require("redux");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _reduxDevtoolsExtension = require("redux-devtools-extension");

var _index = _interopRequireDefault(require("./reducers/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStore() {
  const middlewares = (0, _reduxDevtoolsExtension.composeWithDevTools)((0, _redux.applyMiddleware)(_reduxThunk.default));
  const store = (0, _redux.createStore)(_index.default, undefined, middlewares);
  return store;
}
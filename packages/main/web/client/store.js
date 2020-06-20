import {applyMiddleware, createStore, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';

export default function getStore() {
  const middlewares = composeWithDevTools(applyMiddleware(thunkMiddleware));
  const store = createStore(rootReducer, undefined, middlewares);

  return store;
}

import { combineReducers } from 'redux'
import contextReducer from './context';

const reducers = combineReducers({
  isLoading: (state = false) => state,
  context: contextReducer,
})

export default reducers;
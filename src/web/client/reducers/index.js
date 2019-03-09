import { combineReducers } from 'redux'
import ventReducer from './vent'
import loadingReducer from './loading'

const reducers = combineReducers({
  isLoading: loadingReducer,
  vent: ventReducer
})

export default reducers

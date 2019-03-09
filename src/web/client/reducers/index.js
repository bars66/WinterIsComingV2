import { combineReducers } from 'redux'
import ventReducer from './vent'

const reducers = combineReducers({
  isLoading: (state = false) => state,
  vent: ventReducer,
})

export default reducers

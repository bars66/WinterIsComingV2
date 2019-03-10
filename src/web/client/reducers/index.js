import { combineReducers } from 'redux'
import ventReducer from './vent'
import loadingReducer from './loading'
import co2Reducer from './co2'

const reducers = combineReducers({
  isLoading: loadingReducer,
  vent: ventReducer,
  co2: co2Reducer
})

export default reducers

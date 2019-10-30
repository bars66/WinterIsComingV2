import { combineReducers } from 'redux'
import ventReducer from './vent'
import loadingReducer from './loading'
import co2Reducer from './co2'
import tempsReducer from './temps'
import forecastReducer from './forecast'

const reducers = combineReducers({
  isLoading: loadingReducer,
  vent: ventReducer,
  co2: co2Reducer,
  temps: tempsReducer,
  forecast: forecastReducer
})

export default reducers

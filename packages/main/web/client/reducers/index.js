import {combineReducers} from 'redux';
import ventReducer from './vent';
import loadingReducer from './loading';
import co2Reducer from './co2';
import tempsReducer from './temps';
import forecastReducer from './forecast';
import grlndReducer from './grlnd';

const reducers = combineReducers({
  isLoading: loadingReducer,
  vent: ventReducer,
  co2: co2Reducer,
  temps: tempsReducer,
  forecast: forecastReducer,
  grlnd: grlndReducer,
});

export default reducers;

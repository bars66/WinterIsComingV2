"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterHourlyForecast = filterHourlyForecast;
exports.default = void 0;

var _graphql = require("graphql");

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _lruCache = _interopRequireDefault(require("lru-cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const API_KEY = process.env.DARKSKY;
const COORDS = process.env.COORDS_FOR_SUN;
const API_URL = `https://api.darksky.net/forecast/`;
const MORNING_HOUR = 11;
const EVENING_HOUR = 21;
const cache = new _lruCache.default({
  maxAge: 1000 * 60 * 10
});
const CACHE_ID = 'forecast'; // "time": 1568413521,
//   "summary": "Сильная Облачность",
//   "icon": "cloudy",
//   "nearestStormDistance": 0,
//   "precipIntensity": 0.0066,
//   "precipProbability": 0.02,
//   "precipType": "rain",
//   "temperature": 17.23,
//   "apparentTemperature": 17.23,
//   "dewPoint": 10.76,
//   "humidity": 0.66,
//   "pressure": 1010.92,
//   "windSpeed": 5.76,
//   "windGust": 11.92,
//   "windBearing": 239,
//   "cloudCover": 0.93,
//   "uvIndex": 0,
//   "visibility": 10.625,
//   "ozone": 268

const ForecastType = new _graphql.GraphQLObjectType({
  name: 'Forecast',
  fields: {
    time: {
      type: new _graphql.GraphQLObjectType({
        name: 'ForecastTime',
        fields: {
          unix: {
            type: _graphql.GraphQLString
          },
          text: {
            type: _graphql.GraphQLString
          }
        }
      }),

      resolve({
        time
      }) {
        return {
          unix: time * 1000,
          text: '' + new Date(time * 1000)
        };
      }

    },
    temperature: {
      type: _graphql.GraphQLFloat
    },
    windSpeed: {
      type: _graphql.GraphQLFloat
    },
    summary: {
      type: _graphql.GraphQLString
    },
    icon: {
      type: _graphql.GraphQLString
    },
    precipType: {
      type: _graphql.GraphQLString
    },
    precipProbability: {
      type: _graphql.GraphQLFloat
    }
  }
});

function filterHourlyForecast(forecast) {
  // Оставляем только утро и вечер - примерное время возврата и отправки
  const morning = forecast.find(({
    time
  }) => new Date(time * 1000).getHours() === MORNING_HOUR);
  const evening = forecast.find(({
    time
  }) => new Date(time * 1000).getHours() === EVENING_HOUR);
  return [morning, evening].filter(Boolean);
}

var _default = {
  type: new _graphql.GraphQLObjectType({
    name: 'weather',
    fields: {
      currently: {
        type: ForecastType
      },
      hourly: {
        type: new _graphql.GraphQLList(ForecastType),

        resolve({
          hourly
        }) {
          return filterHourlyForecast(hourly.data);
        }

      }
    }
  }),

  async resolve(unused1, unused2, context) {
    const fromCache = cache.get(CACHE_ID);

    if (fromCache) {
      context.logger.trace('Forecast from cache');
      return fromCache;
    }

    const forecastRaw = await _requestPromise.default.get(`${API_URL}${API_KEY}/${COORDS}?lang=ru&units=si`);
    console.log('asads', forecastRaw);
    const forecast = JSON.parse(forecastRaw);
    cache.set(CACHE_ID, forecast);
    return forecast;
  }

};
exports.default = _default;
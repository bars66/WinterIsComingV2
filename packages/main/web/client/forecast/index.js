import React from 'react'
import { connect } from 'react-redux'

import Grid from '@material-ui/common/Grid'

import ForecastCard from './card';

class Forecast extends React.Component {
  render () {
    const currently = this.props.forecast.currently;
    const nowHours = new Date().getHours();
    const hourly = (nowHours < 7 || nowHours > 21) ? this.props.forecast.hourly[0] : this.props.forecast.hourly[1]
    return (
      <Grid container spacing={8}>
        <Grid item xs={6}>
          <ForecastCard forecast={currently} />
        </Grid>
        <Grid item xs={6}>
          <ForecastCard forecast={hourly} />
        </Grid>
      </Grid>
    )
  }
}

// icon: "partly-cloudy-night"
// precipProbability: 0.05
// precipType: "rain"
// summary: "Небольшая Облачность"
// temperature: 9.56
// time: {unix: "1568493645000", text: "Sat Sep 14 2019 23:40:45 GMT+0300 (Москва, стандартное время)"}
// windSpeed: 3.5

export default connect(({ forecast }) => ({ forecast }))(Forecast)

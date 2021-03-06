import React from 'react';
import Typography from '@material-ui/common/Typography';

import Card from '@material-ui/common/Card';
import CardContent from '@material-ui/common/CardContent';
import CardHeader from '@material-ui/common/CardHeader';
import Divider from '@material-ui/common/Divider';
import Grid from '@material-ui/common/Grid';
import Avatar from '@material-ui/common/Avatar';

const ForecastCard = ({forecast}) => (
  <Card style={{marginBottom: '10px'}}>
    <CardHeader
      title={`${forecast.summary}`}
      titleTypographyProps={{
        variant: 'h5',
      }}
      subheader={new Date(+forecast.time.unix).toISOString()}
      avatar={
        <React.Fragment>
          <Avatar
            style={{
              width: 60,
              height: 60,
            }}
          >
            <b>{forecast.temperature}</b>
          </Avatar>
        </React.Fragment>
      }
    />
    <CardContent style={{marginTop: '-25px'}}>
      {!!forecast.precipProbability && (
        <Typography>
          Вероятность осадков: <b>{forecast.precipProbability * 100}</b>%(
          {forecast.precipType})
        </Typography>
      )}
      <Typography>
        Скорость ветра: <b>{forecast.windSpeed}</b>м/с
      </Typography>
    </CardContent>
  </Card>
);

// icon: "partly-cloudy-night"
// precipProbability: 0.05
// precipType: "rain"
// summary: "Небольшая Облачность"
// temperature: 9.56
// time: {unix: "1568493645000", text: "Sat Sep 14 2019 23:40:45 GMT+0300 (Москва, стандартное время)"}
// windSpeed: 3.5

export default ForecastCard;

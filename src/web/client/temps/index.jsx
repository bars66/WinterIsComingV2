import React from 'react'
import Slider from '@material-ui/lab/Slider'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'

const Temps = ({inside, canal, lastUpdate}) => {
    return (
      <Card>
        <CardHeader
          title='Температуры'
          titleTypographyProps={{
            variant: 'display1',
          }}
          subheader={(new Date(+lastUpdate)).toISOString()}
          avatar={
            <Avatar style={{
              width: 60,
              height: 60,
              color: '#fff',
              backgroundColor: '#4caf50'
            }}>
              +{inside}
            </Avatar>
          }
        />
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <Typography >Внутренняя:</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography><b>{inside}</b></Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography >Канальная:</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography >{canal}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
}

export default connect(({ temps }) => temps)(Temps)

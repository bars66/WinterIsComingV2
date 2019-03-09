import React from 'react'
import Slider from '@material-ui/lab/Slider'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'

class Vent extends React.Component {
  state = {
    value: this.props.temp
  };

  handleChange = (event, value) => {
    this.setState({ value })
  };

  render () {
    const { switchReason: { isEnabled, reason, time}, temp, insideTmp, canaltTmp } = this.props
    const { value } = this.state

    return (
      <Card>
        <CardHeader title='Вентиляция' />
        <CardContent>

          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Typography variant='title' >Автоматическое управление.</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>Состояние:</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography><b>{isEnabled ? 'Включено' : 'Выключено'}</b></Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography >Причина:</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography >{reason}</Typography>
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={9}>
              <Typography >{(new Date(+time)).toISOString()}</Typography>
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Typography variant='title'> Температуры.</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography >Заданная:</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant='title'><b>{temp}</b></Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography >Внутренняя:</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography ><b>{insideTemp}</b></Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography >Канальная:</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography >{canalTemp}</Typography>
            </Grid>
          </Grid>
          <Divider />

          <Slider
            style={{marginTop: '20px'}}
            value={value}
            min={15}
            max={30}
            step={0.5}
            onChange={this.handleChange}
          />
        </CardContent>
      </Card>
    )
  }
}

export default connect(({ vent }) => vent)(Vent)

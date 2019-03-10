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

import debounce from 'debounce'

import setTemp from '../actions/setTemp'

class Vent extends React.Component {
  state = {
    value: this.props.temp
  };

  debouncedSetTemp = debounce(this.props.changeTemp, 500);

  handleChange = (event, value) => {
    this.setState({ value })
    this.debouncedSetTemp(value)
  };

  getColorByStatus = () => {
    const {ventEnabled, temp, insideTmp} = this.props;

    if (!ventEnabled) return '#bdbdbd';

    if (temp.toFixed(2) !== insideTmp.toFixed(2)) return '#ffd54f';

    return '#4caf50';
   }

  render () {
    const { switchReason: { isEnabled, reason, time }, temp, lastAnswer } = this.props
    const { value: valueFromState } = this.state
    const tempForShown = valueFromState.toFixed(2) !== temp.toFixed(2) ? valueFromState : temp

    return (
      <Card style={{ marginBottom: '20px' }}>
        <CardHeader
          title='Вентиляция'
          titleTypographyProps={{
            variant: 'display1',
          }}
          subheader={(new Date(+lastAnswer)).toISOString()}
          avatar={
            <Avatar style={{
              width: 60,
              height: 60,
              color: '#fff',
              backgroundColor: this.getColorByStatus()
            }}>
              <b>+{tempForShown}</b>
            </Avatar>
          }
        />
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
              <Typography variant='title'>Температура.</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>Заданная:</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography><b>{tempForShown}</b></Typography>
            </Grid>
          </Grid>
          <Divider />

          <Slider
            style={{ marginTop: '20px' }}
            value={tempForShown}
            min={15}
            max={28}
            step={0.5}
            onChange={this.handleChange}
          />
        </CardContent>
      </Card>
    )
  }
}

export default connect(({ vent }) => vent, (dispatch) => ({
  changeTemp: temp => dispatch(setTemp(temp))
}))(Vent)

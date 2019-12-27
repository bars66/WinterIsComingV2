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
import Button from '@material-ui/core/Button'
import setGrlnd from '../actions/setGrlnd'

class Grlnd extends React.Component {
  render () {
    const { pwmRY, pwmGB, time, setGrlnd, small} = this.props
    console.log('AAA', setGrlnd)
    // const { value: valueFromState } = this.state
    // const tempForShown = valueFromState.toFixed(2) !== temp.toFixed(2) ? valueFromState : temp

    const isEnabled = pwmRY || pwmGB || time;

    return (
      <Card style={!small ? { marginBottom: '20px' } : {marginBottom: '-20px'}}>
        <CardHeader
          title='GRLND'
          titleTypographyProps={{
            variant: 'display1'
          }}
        />
        <CardContent style={small ? {marginTop: '-30px'} : {}}>
          {!small && <Grid container spacing={0}>
            <Grid item xs={12}>
              <Typography variant='title' >{!!time ? 'Мигание' : (pwmRY || pwmGB) ? 'Включено' : 'Выключено'}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>Состояние:</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography><b>PWM_GB: {pwmGB}; PWM_RY: {pwmRY}; time: {time}</b></Typography>
            </Grid>
          </Grid>}
          <Divider />

          <div style={{ marginTop: '10px' }}>
          <Button variant='contained' color={!isEnabled ? 'primary' : 'secondary'} onClick={() => setGrlnd(!isEnabled ? {pwmRY: 999, pwmGB: 999, time: 0} : {pwmRY: 0, pwmGB: 0, time: 0} )}>
            {!isEnabled ? 'Включить' : 'Выключить'}
          </Button>

          {!!isEnabled &&
            <Button variant='contained' color='primary' onClick={() => setGrlnd({time: 100})} style={{ marginLeft: '20px' }}>
              Включить мигание
            </Button>
          }
          </div>


        </CardContent>
      </Card>
    )
  }
}

export default connect(({ grlnd }) => grlnd, (dispatch) => ({
  setGrlnd: opts => dispatch(setGrlnd(opts)),
}))(Grlnd)

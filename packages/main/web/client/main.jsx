import * as React from 'react'
import { connect } from 'react-redux'
import CssBaseline from '@material-ui/common/CssBaseline'
import Typography from '@material-ui/common/Typography'
import Divider from '@material-ui/common/Divider'
import Grid from '@material-ui/common/Grid'
import LinearProgress from '@material-ui/common/LinearProgress'

import getSystemStatus from './actions/getSystemStatus'
import Grlnd from './grlnd'
import Vent from './vent'
import CO2 from './co2'
import Temps from './temps'

export class Main extends React.Component {
  intervalId;

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.intervalId = setInterval(() => {
      this.props.updateSystemStatus()
    }, 1000)
  }

  componentWillUnmount () {
    this.intervalId && clearInterval(this.timerId)
  }

  render () {
    const { statusColor, sysStatus, isLoading } = this.props
    return (
      <div style={{
        maxWidth: '100%',
        overflowX: 'hidden',
      }}>
        <CssBaseline />

        <Typography component='h2' variant='display2' gutterBottom>
          WiC V2.1. <span style={{ color: statusColor }}>{sysStatus}</span>
        </Typography>
        <Divider />

        {!this.props.isLoading
          ? <React.Fragment>
            <LinearProgress />
            <br />
            <LinearProgress color='secondary' />
          </React.Fragment>
          : <React.Fragment>
            <Grlnd />
            <CO2 />
            <Vent />
            <Temps />
          </React.Fragment>
        }

      </div>
    )
  }
}

export default connect(({ isLoading }) => {
  return { isLoading, sysStatus: !isLoading ? 'Fatal' : 'Stable', statusColor: !isLoading ? 'red' : 'green' }
}, (dispatch) => ({
  updateSystemStatus: () => {
    dispatch(getSystemStatus())
  }
}))(Main)

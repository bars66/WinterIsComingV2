import * as React from 'react'
import { connect } from 'react-redux'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'

import getSystemStatus from './actions/getSystemStatus'
import Vent from './vent/index'
import CO2 from './co2/index'
import Temps from './temps/index'

export class App extends React.Component {
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
        padding: '10px'
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
}))(App)

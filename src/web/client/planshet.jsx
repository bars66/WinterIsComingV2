import * as React from 'react'
import { connect } from 'react-redux'
import CssBaseline from '@material-ui/core/CssBaseline'
import LinearProgress from '@material-ui/core/LinearProgress'
import { createMuiTheme, MuiThemeProvider} from '@material-ui/core';

import getSystemStatus from './actions/getSystemStatus'
import Forecast from './forecast/index'
import Vent from './vent'

const theme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
});

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
    return (
      <MuiThemeProvider theme={theme}>
        <div style={{
          maxWidth: '100%',
          overflowX: 'hidden',
          padding: '10px',
        }}>
          <CssBaseline />
          {!this.props.isLoading
            ? <React.Fragment>
              <LinearProgress />
              <br />
              <LinearProgress color='secondary' />
            </React.Fragment>
            : <React.Fragment>
              <Forecast />
              <Vent small/>
            </React.Fragment>
          }
        </div>
      </MuiThemeProvider>
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

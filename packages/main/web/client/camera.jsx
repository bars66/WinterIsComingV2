import * as React from 'react'
import { connect } from 'react-redux'
import CssBaseline from '@material-ui/common/CssBaseline'
import LinearProgress from '@material-ui/common/LinearProgress'
import { createMuiTheme, MuiThemeProvider} from '@material-ui/common';
import JSMpeg from '@cycjimmy/jsmpeg-player';

export class App extends React.Component {
  intervalId;

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    new JSMpeg.VideoElement('#videoWrapper', `ws://${window.location.hostname}:9999`);
  }

  componentWillUnmount () {
    this.intervalId && clearInterval(this.timerId)
  }

  render () {
    return (
        <div style={{
          maxWidth: '100%',
          overflowX: 'hidden',
          padding: '10px',
        }}>
          <div id="videoWrapper" style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9
          }}/>
        </div>
    )
  }
}

export default connect(({ isLoading }) => {
  return { isLoading, sysStatus: !isLoading ? 'Fatal' : 'Stable', statusColor: !isLoading ? 'red' : 'green' }
}, (dispatch) => ({
  updateSystemStatus: () => {
  }
}))(App)

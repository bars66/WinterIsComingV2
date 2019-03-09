import * as React from 'react';
import {connect} from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

import getSystemStatus from './actions/getSystemStatus';
import Index from './index/index';

export class App extends React.Component {
  intervalId;

  constructor (props) {
    super(props)
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.props.updateSystemStatus();
    }, 1000);
  }

  componentWillUnmount() {
    this.intervalId && clearInterval(this.timerId);
  }

  render() {
    return (
      <div style={{
        width: '100%',
        padding: '10px'
      }}>
        <CssBaseline/>

        <Typography component="h2" variant="display2" gutterBottom>
          WiC V2.1. <span style={{color: 'green'}}>Stable</span>
        </Typography>
        <Divider/>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Index/>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default connect(undefined, (dispatch) => ({
  updateSystemStatus: () => {
    dispatch(getSystemStatus());
  }
}))(App)
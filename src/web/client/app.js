import * as React from 'react';
import {connect} from 'react-redux';

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
    return <Index/>
  }
}

export default connect(undefined, (dispatch) => ({
  updateSystemStatus: () => {
    dispatch(getSystemStatus());
  }
}))(App)
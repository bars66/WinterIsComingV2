import React from 'react';
import Slider from '@material-ui/lab/Slider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

class StepSlider extends React.Component {
  state = {
    value: 3,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <React.Fragment>
        <Typography component="h2" variant="display1" gutterBottom>
          Вентиляция
        </Typography>
          <Slider
            value={value}
            min={0}
            max={6}
            step={1}
            onChange={this.handleChange}
          />
      </React.Fragment>
    );
  }
}

export default (StepSlider);
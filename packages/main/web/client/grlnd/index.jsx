import React from 'react';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/common/Typography';
import {connect} from 'react-redux';

import Card from '@material-ui/common/Card';
import CardContent from '@material-ui/common/CardContent';
import CardHeader from '@material-ui/common/CardHeader';
import Divider from '@material-ui/common/Divider';
import Grid from '@material-ui/common/Grid';
import Button from '@material-ui/common/Button';
import setGrlnd from '../actions/setGrlnd';
import debounce from 'debounce';

class Grlnd extends React.Component {
  state = {
    value: this.props.time,
  };

  debouncedSetGrlnd = debounce(this.props.setGrlnd, 500);

  handleChange = (event, value) => {
    this.setState({value});
    this.debouncedSetGrlnd({time: value});
  };

  handleChangeBrightness = (event, value) => {
    this.setState({brightness: value});
    this.debouncedSetGrlnd({pwmRY: value, pwmGB: value, time: 0});
  };

  render() {
    const {pwmRY, pwmGB, time, setGrlnd, small} = this.props;
    const {value: timeValueFromState, brightness} = this.state;
    // const tempForShown = valueFromState.toFixed(2) !== temp.toFixed(2) ? valueFromState : temp

    const isEnabled = pwmRY || pwmGB || time;

    return (
      <Card style={!small ? {marginBottom: '20px'} : {marginBottom: '-20px'}}>
        <CardHeader
          title="GRLND"
          titleTypographyProps={{
            variant: 'display1',
          }}
        />
        <CardContent style={small ? {marginTop: '-30px'} : {}}>
          {!small && (
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Typography variant="title">
                  {!!time ? 'Мигание' : pwmRY || pwmGB ? 'Включено' : 'Выключено'}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Состояние:</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography>
                  <b>
                    PWM_GB: {pwmGB}; PWM_RY: {pwmRY}; time: {time}
                  </b>
                </Typography>
              </Grid>
            </Grid>
          )}
          <Divider />

          <div style={{marginTop: '10px'}}>
            <Button
              variant="contained"
              color={!isEnabled ? 'primary' : 'secondary'}
              onClick={() =>
                setGrlnd(
                  !isEnabled
                    ? {
                        pwmRY: this.props.userBrightness,
                        pwmGB: this.props.userBrightness,
                        time: 0,
                      }
                    : {pwmRY: 0, pwmGB: 0, time: 0}
                )
              }
            >
              {!isEnabled ? 'Включить' : 'Выключить'}
            </Button>

            {!!isEnabled && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setGrlnd({time: 100})}
                style={{marginLeft: '20px'}}
              >
                Включить мигание
              </Button>
            )}

            {!!isEnabled && !time && (
              <div style={{marginTop: '10px'}}>
                <Typography>Яркость, {(pwmRY / 1000).toFixed(3)} %</Typography>
                <Slider
                  style={{
                    marginTop: '20px',
                    marginBottom: '60px',
                    marginLeft: '30px',
                    marginRight: '10px',
                    width: '90%',
                  }}
                  value={+brightness || 999}
                  min={1}
                  max={999}
                  step={1}
                  onChange={this.handleChangeBrightness}
                />
              </div>
            )}

            {!!time && (
              <div style={{marginTop: '10px'}}>
                <Typography>T 1/4 мигания, мс: {timeValueFromState || 100}</Typography>
                <Slider
                  style={{
                    marginTop: '20px',
                    marginBottom: '60px',
                    marginLeft: '30px',
                    marginRight: '10px',
                    width: '90%',
                  }}
                  value={+timeValueFromState || 100}
                  min={10}
                  max={500}
                  step={10}
                  onChange={this.handleChange}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default connect(
  ({grlnd}) => grlnd,
  (dispatch) => ({
    setGrlnd: (opts) => dispatch(setGrlnd(opts)),
  })
)(Grlnd);

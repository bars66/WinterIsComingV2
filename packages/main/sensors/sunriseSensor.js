import SunCalc from 'suncalc';
import {AbstractSensor} from './abstractSensor';

const [lat, lon] = process.env.COORDS_FOR_SUN.split(',');

export class Sunrise extends AbstractSensor {
  value = {};
  constructor(context) {
    super();
    this.context = context;
    this.logger = context.logger;

    this.context.sensors.Sunrise = this;
    this.logger.debug('sensors/Sunrise started');
  }

  handle_Minute = () => {
    this.value = SunCalc.getTimes(new Date(), lat, lon);
  };
}

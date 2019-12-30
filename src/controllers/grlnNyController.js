import rp from 'request-promise'

const grlndUrl = process.env.GRLND_NY

export class GrlndNyController {
  name = 'controllers/GrlndNY';

  params = {
    time: 0,
    pwmRY: 0,
    pwmGB: 0,
    userBrightness: 998,
  };

  constructor (context) {
    this.logger = context.logger
    this.context = context

    this.context.controllers.GrlndNyController = this
    this.logger.debug(this.name + ' started')
  }

  changeParams = async ({pwmRY, pwmGB}) => {
    const options = {
      method: 'GET',
      uri: grlndUrl + '?PWM1=' + pwmRY + '&PWM2=' + pwmGB,
    }
    this.params.time = 0;
    this.params.pwmRY = pwmRY;
    this.params.pwmGB = pwmGB;

    if (pwmRY !== 0) this.params.userBrightness = pwmRY;

    try {
      const result = await rp(options)
      this.logger.trace(result, 'Grlnd change result')
    } catch (e) {
      this.logger.error({ name: this.name, e, stackTrace: e.stackTrace }, 'Grlnd change error')
    }
  }

  setBlink = async ({time}) => {
    const options = {
      method: 'GET',
      uri: grlndUrl + '?PWM1=999&PWM2=0&time=' + time,
    }

    this.params.time = time;

    try {
      const result = await rp(options)
      this.logger.trace(result, 'Grlnd setBlink result')
    } catch (e) {
      this.logger.error({ name: this.name, e, stackTrace: e.stackTrace }, 'Grlnd setBlink error')
    }
  }

  handle_Minute = () => {
  }
}

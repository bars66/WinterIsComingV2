import rp from 'request-promise'

const flowerLightUrl = process.env.FLOWER_LIGHT

export class FlowerLightController {
  name = 'controllers/FlowerLight';
  FLOWER_LIGHT_TIME = 12 * 60 * 60 * 1000;

  params = {
  };

  constructor (context) {
    this.logger = context.logger
    this.context = context

    this.context.controllers.FlowerLight = this
    this.logger.debug('controllers/ FlowerLight started')
  }

  switchRelay = async (number, state) => {
    const options = {
      method: 'GET',
      uri: flowerLightUrl + 'api/relayChange' + `?relay=${number}&state=${state}`
    }

    try {
      const result = await rp(options)
      this.logger.trace(result, 'Relay change result')
    } catch (e) {
      this.logger.error({ name: this.name, e, stackTrace: e.stackTrace }, 'Relay change error')
    }
  }

  getRelayStatus = async () => {
    const options = {
      method: 'GET',
      uri: flowerLightUrl + 'api/relayState',
      json: true
    }

    try {
      const result = await rp(options)
      this.params.relayValues = result.data.relays
    } catch (e) {
      console.log(e)
      this.logger.error({ name: this.name, e, stackTrace: e.stackTrace }, 'Relay get status error')
    }
  }

  handle_Minute = () => {
    this.enableOrDisableRelaysBySunrise()

    this.getRelayStatus()
  }

  enableOrDisableRelaysBySunrise = () => {
    const solarTimes = this.context.sensors.Sunrise.value
    if (!solarTimes || !solarTimes.sunrise) return
    const sunriseTime = solarTimes.sunrise

    if (new Date() > new Date(sunriseTime.getTime() + this.FLOWER_LIGHT_TIME)) {
      setTimeout(() => {
        this.logger.info({ name: this.name }, 'Disable 1 relay by sunrise time')
        this.switchRelay(1, 'disable')
      }, 1000)

      setTimeout(() => {
        this.logger.info({ name: this.name }, 'Disable 3 relay by sunrise time')
        this.switchRelay(3, 'disable')
      }, 5000)

      return
    }

    if (new Date() > sunriseTime) {
      setTimeout(() => {
        this.logger.info({ name: this.name }, 'Enable 1 relay by sunrise time')
        this.switchRelay(1, 'enable')
      }, 1000)

      setTimeout(() => {
        this.logger.info({ name: this.name }, 'Enable 3 relay by sunrise time')
        this.switchRelay(3, 'enable')
      }, 5000)
    }
  }
}

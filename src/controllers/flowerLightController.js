import rp from 'request-promise'

const flowerLightUrl = process.env.FLOWER_LIGHT

export class FlowerLightController {
  name = 'controllers/FlowerLight';
  FLOWER_LIGHT_TIME = 2 * 60 * 1000;

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
      method: 'POST',
      uri: flowerLightUrl + 'api/relayChange',
      body: {
        relay: number,
        state
      }
    }

    try {
      const result = await rp(options)
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
      params.relayValues = result.data.relays
    } catch (e) {
      this.logger.error({ name: this.name, e, stackTrace: e.stackTrace }, 'Relay get status error')
    }
  }

  handle_Minute = () => {
    this.enableOrDisableRelaysBySunrise().catch(e => {})

    this.getRelayStatus().catch(e => {})
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
        this.logger.info({ name: this.name }, 'Disable 2 relay by sunrise time')
        this.switchRelay(2, 'disable')
      }, 5000)

      return
    }

    if (new Date() > sunriseTime) {
      setTimeout(() => {
        this.logger.info({ name: this.name }, 'Enable 1 relay by sunrise time')
        this.switchRelay(1, 'enable')
      }, 1000)

      setTimeout(() => {
        this.logger.info({ name: this.name }, 'Enable 2 relay by sunrise time')
        this.switchRelay(2, 'enable')
      }, 5000)
    }
  }
}

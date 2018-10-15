import { VentController } from '../controllers/ventController'

export class TempSensor {
  constructor (logger) {
    this.vC = VentController.getSingletone(logger)
    this.subscribe()
  }

  subscribe = () => {
    this.vC.on('values', ({ canalTmp, insideTmp }) => {
      this.value = {
        canal: canalTmp,
        inside: insideTmp
      }
    })
  }

  static getSingletone = (logger) => {
    if (!TempSensor.instance) {
      TempSensor.instance = new TempSensor(logger)
    }

    return TempSensor.instance
  };
}

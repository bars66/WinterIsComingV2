import { VentController } from '../controllers/ventController'
import { AbstractSensor } from './abstractSensor'

export class TempSensor extends AbstractSensor {
  value = {};
  constructor (logger) {
    super();
    this.vC = VentController.getSingletone(logger)
    this.subscribe()
  }

  subscribe = () => {
    this.vC.on('values', ({ canaltTmp, insideTmp }) => {
      this.value = {
        canal: canaltTmp,
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

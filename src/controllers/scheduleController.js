import Datastore from 'nedb-promise';
import moment from 'moment'

const getSecondsFromTime = (time) => {
  const parsedTime = time.split(':').map(Number);

  return parsedTime[0] * 3600 + parsedTime[1] * 60;
}

export class ScheduleController {
  name = 'controllers/Scheduler';
  isLoaded = false;

  constructor (context) {
    this.logger = context.logger
    this.context = context

    this.context.controllers.Camera = this
    this.logger.debug('controllers/Camera started')

    this.db = new Datastore({ filename: './scheduler.db', autoload: true  });
    this.db = {};
    this.db.actions = new Datastore({ filename: './db/scheduler/actions.db', autoload: true  });
    this.db.plane = new Datastore({ filename: './db/scheduler/plane.db', autoload: true  });
  }

  addAction_temperature = async (action) => {
    const {from, to, temp, needReturnOriginalAfter} = action;

    await this.db.actions.insert({
      type: 'temperature',
      from: getSecondsFromTime(from),
      to: getSecondsFromTime(to),
      params: {
        temp,
        needReturnOriginalAfter: !!needReturnOriginalAfter,
      },
    })
  }

  addAction = async (action) => {
    await this[`addAction_${action.type}`](action);
  }

  planeAction = async () => {
    const now = moment().format("HH:mm");
    const nowSeconds = getSecondsFromTime(now);

    const actions = await this.db.actions.find({from: {$lte: nowSeconds}, to: {$gte: nowSeconds}});
    if (!actions || !actions.length) return;

    // const isScheduled =
    console.log(actions);
  }

  handle_Second = async () => {
    await this.planeAction();
    // await this.addAction({type: 'temperature', from: '00:00', to: '03:00', temp: '+1.5'})
    console.log(moment().format("HH:mm"))
  }
}
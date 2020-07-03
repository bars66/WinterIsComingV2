import {Context} from '../context';
import {AbstractController} from '../controllers/abstract';
import {logger} from 'winteriscomingv2-common';
import {AbstractAction} from '../actions/abstract';

export type ControllersMap = {[key: string]: AbstractController};
export type ActionsMap = {[key: string]: AbstractAction};

export async function init(controllers: ControllersMap, actions: ActionsMap, context: Context) {
  context.controllers = controllers;
  context.actions = actions;

  const controllersAsArray = Object.values(controllers);

  context.logger.info('Begin controllers init');

  await Promise.all(
    controllersAsArray.map(async (c: AbstractController) => {
      await c.waitForInitDone();
      logger.info({id: c.getId()}, 'Init done');
    })
  );

  const actionsAsArray = Object.values(actions);
  await Promise.all(
    actionsAsArray.map(async (action: AbstractAction) => {
      await action.init();
      action.start();
    })
  );
}

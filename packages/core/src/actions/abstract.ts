import type {Context} from '../context';
import type {Logger} from 'winteriscomingv2-common';

export class AbstractAction {
  protected name: string;
  protected logger: Logger;

  constructor({name, context}: {name: string; context: Context}) {
    this.name = name;
    this.logger = context.logger.child({action: {name: this.name}});
  }

  public start() {
    throw new Error('Not implemented');
  }

  public stop() {
    throw new Error('Not implemented');
  }
}

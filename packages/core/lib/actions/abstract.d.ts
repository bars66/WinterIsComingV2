import type {Context} from '../context';
import type {Logger} from 'winteriscomingv2-common';
export declare class AbstractAction {
  protected name: string;
  protected logger: Logger;
  constructor({name, context}: {name: string; context: Context});
  start(): void;
  stop(): void;
}

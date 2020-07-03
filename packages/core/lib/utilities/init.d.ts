import {Context} from '../context';
import {AbstractController} from '../controllers/abstract';
import {AbstractAction} from '../actions/abstract';
export declare type ControllersMap = {
  [key: string]: AbstractController;
};
export declare type ActionsMap = {
  [key: string]: AbstractAction;
};
export declare function init(
  controllers: ControllersMap,
  actions: ActionsMap,
  context: Context
): Promise<void>;

import type {Context} from '../context';
export declare type SettingsFromSql<T> = {
  id: string;
  lastUpdate: Date | null;
  updateId: number;
  settings: T;
};
export declare class SqlSettings<T> {
  context: Context;
  id: string;
  defaultSettings: T;
  constructor(context: Context, id: string, defaultSettings: T);
  write(settings: T, updateId: number, force?: boolean): Promise<void>;
  getSettings(): Promise<SettingsFromSql<T>>;
}

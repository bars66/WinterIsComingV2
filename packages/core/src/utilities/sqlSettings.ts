import type {Context} from '../context';
import type {RowDataPacket} from 'mysql2';

export type SettingsFromSql<T> = {
  id: string;
  lastUpdate: Date | null;
  updateId: number;
  settings: T;
};

export class SqlSettings<T> {
  context: Context;
  id: string;
  defaultSettings: T;

  constructor(context: Context, id: string, defaultSettings: T) {
    this.context = context;
    this.id = id;
    this.defaultSettings = defaultSettings;
  }

  async write(settings: T, updateId: number, force?: boolean): Promise<void> {
    const connection = await this.context.sources.sql.getConnection();
    await connection.query('START TRANSACTION;');

    const updateIdFromSqlResult = await connection.query<RowDataPacket[]>({
      sql: 'SELECT update_id as updateId FROM settings WHERE id = ?',
      values: [this.id],
    });
    const updateIdFromSql = updateIdFromSqlResult?.[0]?.[0]?.updateId;

    if (updateIdFromSql?.[0]?.[0]?.updateId && updateIdFromSql?.[0]?.[0]?.updateId !== updateId) {
      if (force) {
        this.context.logger.warn(
          {settings, newUpdateId: updateId, updateIdFromSql},
          'Update id not match. Force write'
        );
      } else {
        await connection.query('COMMIT;');

        await connection.release();
        throw new Error('Incorrect update ID');
      }
    }

    const settingsAsStr = JSON.stringify(settings);
    const date = new Date();

    await connection.query({
      sql: `
        INSERT INTO settings (id, last_update, update_id, settings) VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE
last_update=?, update_id=?, settings=?;
      `,
      values: [this.id, date, updateId + 1, settingsAsStr, date, updateId + 1, settingsAsStr],
    });
    await connection.query('COMMIT;');
    await connection.release();
  }

  async getSettings(): Promise<SettingsFromSql<T>> {
    const result = await this.context.sources.sql.query<RowDataPacket[]>({
      sql:
        'SELECT id, last_update as lastUpdate, update_id as updateId, settings FROM settings WHERE id = ?',
      values: [`${this.id}`],
    });

    const settings = result?.[0]?.[0] as SettingsFromSql<T> | void;

    if (!settings) {
      return {id: this.id, updateId: 0, lastUpdate: null, settings: this.defaultSettings};
    }

    return settings;
  }
}

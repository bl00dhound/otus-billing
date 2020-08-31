import IBalance from '../interfaces/IBalance';
import db from '../providers/db';

export default class AccountDAO {
  static async createAccount(user_id: number): Promise<boolean> {
    const result = await db('user_accounts')
      .insert({ user_id, balance: 0 });
    return Boolean(result);
  }

  static async getBalance(userId: number): Promise<IBalance> {
    return db('user_accounts')
      .first('balance', 'user_id as userId')
      .where('user_id', userId);
  }

  static async changeBalance(userId: number, amount: number): Promise<IBalance> {
    return db('user_accounts')
      .where('user_id', userId)
      .increment({ balance: amount } as any)
      .returning('*')
      .then((data) => data[0]);
  }
}

/* eslint-disable @typescript-eslint/naming-convention */
import IUser from '../interfaces/IUser';
import IBalance from '../interfaces/IBalance';
import IReplenishData from '../interfaces/IReplenishData';
import ICreateOrder from '../interfaces/ICreateOrder';
import AccountDAO from '../dao/account.dao';
import logger from '../providers/logger';
import bus from '../providers/bus';

export default class AccountService {
  static async createAccount(data: IUser): Promise<boolean> {
    try {
      return AccountDAO.createAccount(data.id);
    } catch (err) {
      logger.error({
        message: err.message,
        stack: err.stack,
      }, '[Create account error]: ');
    }
    return false;
  }

  static async getBalance(userId: number): Promise<IBalance> {
    try {
      return AccountDAO.getBalance(userId);
    } catch (err) {
      logger.error({
        message: err.message,
        stack: err.stack,
      }, '[Get balance error]: ');
    }
    return { balance: 0, user_id: userId };
  }

  static async replenishBalance(data: IReplenishData): Promise<boolean> {
    try {
      const result = await AccountService.changeBalance(data);
      return bus.publish('billing:success', result);
    } catch (err) {
      logger.error({
        message: err.message,
        stack: err.stack,
      }, '[Replenish balance error]: ');
    }
    return bus.publish('billing:failed', { user_id: data.user_id, balance: 0 });
  }

  static async changeBalance(data: IReplenishData | ICreateOrder): Promise<IBalance> {
    const { user_id, amount } = data || {};
    logger.info({
      user_id, amount,
    }, '[Change balance]: ');
    return AccountDAO.changeBalance(user_id, amount);
  }

  static async createOrder(data: ICreateOrder): Promise<boolean> {
    try {
      const currentBalance = await AccountService.getBalance(data.user_id);

      if (currentBalance.balance < data.amount) throw Error('Not enough funds for order');

      const result = await AccountService.changeBalance({ ...data, amount: data.amount * -1 });
      return bus.publish('billing:success', result);
    } catch (err) {
      logger.error({
        message: err.message,
        stack: err.stack,
      }, '[CreateOrder balance error]: ');
    }
    return bus.publish('billing:failed', { user_id: data.user_id, balance: 0 });
  }
}

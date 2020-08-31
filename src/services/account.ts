import IUser from '../interfaces/IUser';
import IBalance from '../interfaces/IBalance';
import IReplenishData from '../interfaces/IReplenishData';
import ICreateOrder from '../interfaces/ICreateOrder';
import AccountDAO from '../dao/account.dao';
import logger from '../providers/logger';
import bus from '../providers/bus';
import Constants from '../constants';

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
    return { balance: 0, userId };
  }

  static async replenishBalance(data: IReplenishData): Promise<boolean> {
    try {
      const result = await AccountService.changeBalance(data);
      return bus.publish(`billing:${Constants.Reasons.REPLENISH}:success`, result);
    } catch (err) {
      logger.error({
        message: err.message,
        stack: err.stack,
      }, '[Replenish balance error]: ');
    }
    return bus.publish(`billing:${Constants.Reasons.REPLENISH}:failed`, { id: data.userId, balance: 0 });
  }

  static async changeBalance(data: IReplenishData | ICreateOrder): Promise<IBalance> {
    const { userId, amount } = data || {};
    logger.info({
      userId, amount,
    }, '[Change balance]: ');
    return AccountDAO.changeBalance(userId, amount);
  }

  static async createOrder(data: ICreateOrder): Promise<boolean> {
    try {
      const result = await AccountService.changeBalance({ ...data, amount: data.amount * -1 });
      return bus.publish(`billing:${Constants.Reasons.ORDER}:success`, result);
    } catch (err) {
      logger.error({
        message: err.message,
        stack: err.stack,
      }, '[CreateOrder balance error]: ');
    }
    return bus.publish(`billing:${Constants.Reasons.ORDER}:failed`, { id: data.userId, balance: 0 });
  }
}

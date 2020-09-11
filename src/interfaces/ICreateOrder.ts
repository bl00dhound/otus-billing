import { OrderStatus } from '../constants';

interface ICreateOrder {
  user_id: number;
  amount: number;
  status: OrderStatus;
  id?: string;
}

export default ICreateOrder;

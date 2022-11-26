import { ORDER_STATUS } from '@prisma/client';

export type OrderItem = {
  bookID: string;
  amount: number;
};

export type CreateOrderReqBody = {
  orderItems: OrderItem[];
};

export type UpdateOrderStatusReqBody = {
  status: ORDER_STATUS;
};

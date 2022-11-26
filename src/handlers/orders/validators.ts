import { body } from 'express-validator';

export const createOrder = [
  body('orderItems').custom(input => {
    if (!Array.isArray(input)) {
      return { message: 'Invalid input type.' };
    }

    if (input.length === 0) {
      return { message: 'At least one order item' };
    }

    const validInputItems = input.every(item => {
      const orderItemKeys = ['bookID', 'amount'];
      const validKeys = Object.keys(item).every(key =>
        orderItemKeys.includes(key),
      );
      const orderItem = item as { bookID: unknown; amount: unknown };
      const validAmount = typeof orderItem.amount === 'number';
      const validBookID = typeof orderItem.bookID === 'string';

      return validKeys && validAmount && validBookID;
    });

    if (!validInputItems) {
      return { message: 'Invalid order item(s)' };
    }

    return true;
  }),
];

export const updateOrder = [
  body('status').isIn([
    'PROCESSING',
    'CONFIRMED',
    'IN_PROGRESS',
    'CANCELED',
    'DONE',
  ]),
];

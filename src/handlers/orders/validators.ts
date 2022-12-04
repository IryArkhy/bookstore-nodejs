import { body } from 'express-validator';

export const createOrder = [
  body('orderItems').custom(input => {
    if (!Array.isArray(input)) {
      return Promise.reject('Invalid input type. Should be an array.');
    }

    if (input.length === 0) {
      return Promise.reject('At least one order item');
    }

    const validInputItems = input.every(item => {
      const orderItemKeys = ['bookID', 'amount', 'authorID'];
      const validKeys = Object.keys(item).every(key =>
        orderItemKeys.includes(key),
      );

      const orderItem = item as {
        bookID: unknown;
        amount: unknown;
        authorID: unknown;
      };

      const validAmount =
        typeof orderItem.amount === 'number' && orderItem.amount > 0;
      const validBookID = typeof orderItem.bookID === 'string';
      const validAuthorID = typeof orderItem.authorID === 'string';

      return validKeys && validAmount && validBookID && validAuthorID;
    });

    if (!validInputItems) {
      return Promise.reject('Invalid order item(s)');
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

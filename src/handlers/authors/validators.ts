import { body } from 'express-validator';

export const createAuthor = [
  body('name').isString(),
  body('surname').isString(),
];

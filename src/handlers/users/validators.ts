import { body, oneOf } from 'express-validator';

export const createUser = [
  body('email').isEmail(),
  body('password').isStrongPassword(),
  body('username').isString(),
  oneOf([
    body('role').optional().equals('BASIC'),
    body('role').optional().equals('ADMIN'),
  ]),
];

export const signIn = [body('email').isEmail(), body('password').isString()];

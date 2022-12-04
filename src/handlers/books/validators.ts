import { body } from 'express-validator';

export const createBook = [
  body(['title', 'authorID']).isString().isLength({ min: 1 }),
  body('description').isString().isLength({ min: 10 }),
  body(['price', 'year']).isInt(),
  body('genres').isArray({ min: 1 }),
  //   body('asset').optional().isString(),
];

export const getBooks = [
  body('offset').isInt().optional(),
  body('limit').isInt().optional(),
];

export const updateBook = [
  body('authorID').isString(),
  body('price').isInt().optional(),
  body('title').isString().optional(),
  body('description').isString().optional(),
];

export const deleteBook = body('authorID').isString();

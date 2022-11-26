import { body } from 'express-validator';

export const createBook = [
  body(['title', 'authorID', 'description']).isString(),
  body(['price', 'year']).isInt(),
  body('genres').isArray({ min: 1 }),
  //   body('asset').optional().isString(),
];

export const getBooks = [
  body('offset').isInt().optional(), // bookID
  body('limit').isInt().optional(),
];

export const getBookByID = [];

export const updateBook = [body('price').isInt(), body('bookId').isString()];

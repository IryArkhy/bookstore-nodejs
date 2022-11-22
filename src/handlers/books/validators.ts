import { body } from 'express-validator';

export type CreateBookRequestBody = {
  title: string;
  asset: string;
  authorID: string;
  description: string;
  genres: [];
  price: number;
  year: number;
};

export const createBook = [
  body(['title', 'authorID', 'description']).isString(),
  body(['price', 'year']).isInt(),
  body('genres').isArray({ min: 1 }),
  //   body('asset').optional().isString(),
];

export const getBookByID = [];

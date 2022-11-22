import { Router } from 'express';
import { body } from 'express-validator';

import { handleInputErrors } from './modules/middleware';
import { booksHandlers, booksValidators } from './handlers/books';

const router = Router();

/**
 * Books
 */
router.get('/book', booksHandlers.getBooks);
router.get('/book/:id', () => {});
router.post('/book', booksValidators.createBook, handleInputErrors, () => {});
router.put(
  '/book/:id',
  body('title').isString(),
  handleInputErrors,
  booksHandlers.updateBook,
);
router.delete('/book/:id', () => {});

/**
 * Orders
 */
router.get('/order', () => {});
router.get('/order/:id', () => {});
router.post('/order');
router.put('/order/:id', () => {}); // To update status

/**
 * Authors
 */
router.get('/author', () => {});
router.get('/author/:id', () => {});
router.post('/author');

/**
 * Genres
 */
router.get('/genre', () => {});
router.get('/genre/:id', () => {});
router.post('/book');

export default router;

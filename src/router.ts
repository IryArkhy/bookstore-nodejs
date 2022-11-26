import { Router } from 'express';

import { handleInputErrors } from './modules/middleware';
import { booksHandlers, booksValidators } from './handlers/books';
import { ordersValidators } from './handlers/orders';
import { authorHandlers, authorsValidators } from './handlers/authors';
import { genresHandlers, genresValidators } from './handlers/genres';

const router = Router();

/**
 * Books
 */
router.get(
  '/book',
  booksValidators.getBooks,
  handleInputErrors,
  booksHandlers.getBooks,
);
router.get('/book/:id', booksHandlers.getBookByID);
router.post(
  '/book',
  booksValidators.createBook,
  handleInputErrors,
  booksHandlers.createBook,
);
router.put(
  '/book/:id',
  booksValidators.updateBook,
  handleInputErrors,
  booksHandlers.updateBook,
);
router.delete('/book/:id', booksHandlers.deleteBook);

/**
 * Orders
 */
router.get('/order', () => {});
router.get('/order/:id', () => {});
router.post(
  '/order',
  ordersValidators.createOrder,
  handleInputErrors,
  () => {},
);
router.put(
  '/order/:id',
  ordersValidators.updateOrder,
  handleInputErrors,
  () => {},
); // To update status

/**
 * Authors
 */
router.get('/author', authorHandlers.getAuthors);
router.get('/author/:id', authorHandlers.getAuthorByID);
router.post(
  '/author',
  authorsValidators.createAuthor,
  handleInputErrors,
  authorHandlers.createAuthor,
);

/**
 * Genres
 */
router.get('/genre', genresHandlers.getGenres);
router.post(
  '/genre',
  genresValidators.createGenres,
  handleInputErrors,
  genresHandlers.createGenres,
);

export default router;

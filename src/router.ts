import { Router } from 'express';

import { handleInputErrors } from './modules/middleware';
import { booksHandlers, booksValidators } from './handlers/books';
import { orderHandlers, ordersValidators } from './handlers/orders';
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
router.get('/book/search', booksHandlers.searchBook);
router.get('/book/:id/:authorID', booksHandlers.getBookByID);
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
router.delete(
  '/book/:id',
  booksValidators.deleteBook,
  handleInputErrors,
  booksHandlers.deleteBook,
);

/**
 * Orders
 */
router.get('/order', orderHandlers.getUserOrders);
router.get('/order/:id', orderHandlers.getOrderByID);
router.post(
  '/order',
  ordersValidators.createOrder,
  handleInputErrors,
  orderHandlers.createOrder,
);
router.put(
  '/order/:id',
  ordersValidators.updateOrder,
  handleInputErrors,
  orderHandlers.updateOrder,
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

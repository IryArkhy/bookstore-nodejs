import { Router } from 'express';

import {
  catchError,
  checkUserRole,
  errorLogger,
  handleInputErrors,
  invalidPathHandler,
} from './modules/middleware';
import { booksHandlers, booksValidators } from './handlers/books';
import { orderHandlers, ordersValidators } from './handlers/orders';
import { authorHandlers, authorsValidators } from './handlers/authors';
import { genresHandlers, genresValidators } from './handlers/genres';
import { userHandlers } from './handlers/users';

const router = Router();

/**
 * Users
 */

router.get('/user', checkUserRole, userHandlers.getUsers);

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
  checkUserRole,
  booksHandlers.createBook,
);
router.put(
  '/book/:id',
  booksValidators.updateBook,
  handleInputErrors,
  checkUserRole,
  booksHandlers.updateBook,
);
router.delete(
  '/book/:id',
  booksValidators.deleteBook,
  handleInputErrors,
  checkUserRole,
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
  '/order/:id/:userID',
  ordersValidators.updateOrder,
  handleInputErrors,
  checkUserRole,
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
  checkUserRole,
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
  checkUserRole,
  genresHandlers.createGenres,
);

router.use(errorLogger);
router.use(invalidPathHandler);
router.use(catchError);

export default router;

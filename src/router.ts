import { Router } from 'express';

import * as books from './handlers/books/books';

const router = Router();

/**
 * Books
 */
router.get('/book', books.getBooks);
router.get('/book/:id', () => {});
router.post('/book');
router.put('/book/:id', () => {});
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

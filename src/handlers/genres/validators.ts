import { body } from 'express-validator';

export const createGenres = [body('genres').isArray({ min: 1 })];

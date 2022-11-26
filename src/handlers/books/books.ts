import { Request, Response } from 'express';

import { prisma } from '../../db';
import { RequestWithUser } from '../../modules/auth';

import {
  CreateBookReqBody,
  GetBooksReqBody,
  GetBooksReqQuery,
  UpdateBookReqBody,
} from './types';

export const getBooks = async (
  req: Request<any, any, GetBooksReqBody, GetBooksReqQuery>,
  res: Response,
) => {
  const { body, query } = req;
  const { offset = undefined, limit = 20 } = body;
  const { authorID, genre, year } = query;

  const parsedGenres = genre.replace('%', ' ').split(',');

  const books = await prisma.book.findMany({
    skip: offset,
    take: limit,
    orderBy: {
      title: 'asc',
    },
    where: {
      authorID,
      genres: {
        some: {
          genre: {
            name: {
              in: parsedGenres,
            },
          },
        },
      },
      year: year ? parseInt(year) : undefined,
    },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
      author: true,
    },
  });

  const count = await prisma.book.aggregate({
    _count: {
      _all: true,
    },
    where: {
      authorID,
      genres: {
        some: {
          genre: {
            name: {
              in: parsedGenres,
            },
          },
        },
      },
      year: year ? parseInt(year) : undefined,
    },
  });
  res.status(200);
  const newOffset = offset + limit;

  res.json({
    books,
    count: offset === count._count._all,
    limit,
    offset: newOffset === count._count._all ? null : newOffset,
  });
};

export const getBookByID = async (
  req: Request<{ bookID: string }>,
  res: Response,
) => {
  const { params } = req;
  const book = await prisma.book.findUnique({
    where: {
      id: params.bookID,
    },
  });

  if (!book) {
    res.status(404);
    res.json({ message: 'Book is not found' });
  }
};

export const createBook = async (
  req: RequestWithUser<any, any, CreateBookReqBody>,
  res: Response,
) => {
  const { body, user } = req;

  if (!user || user.role !== 'ADMIN') {
    res.status(401);
    res.json({
      message: 'No sufficient permissions.',
    });
  }

  try {
    const book = await prisma.book.create({
      data: {
        title: body.title,
        authorID: body.authorID,
        description: body.description,
        price: body.price,
        genres: {
          createMany: {
            data: body.genres.map(genre => ({
              genreID: genre,
            })),
          },
        },
        year: body.year,
      },
    });
    console.log({ book });
    res.status(201);
    res.json({
      book,
    });
  } catch (error) {
    console.log({ error });
    res.status(500);
    res.json(error);
  }
};

export const updateBook = async (
  req: RequestWithUser<any, any, UpdateBookReqBody>,
  res: Response,
) => {
  const { body } = req;
  const book = await prisma.book.update({
    where: {
      id: body.bookID,
    },
    data: {
      price: body.price,
    },
  });
  res.status(200);
  res.json({ message: 'Book updated', book });
};

export const deleteBook = async (
  req: RequestWithUser<{ bookID: string }>,
  res: Response,
) => {
  const { params } = req;
  const deletedBook = await prisma.book.delete({
    where: {
      id: params.bookID,
    },
  });
  res.json(200);
  res.json({ message: 'Book deleted', book: deletedBook });
};

/**
 * Harry Potter and the Chamber of Secrets
 * Where Love Has Gone
 * The Mysterious Affair at Styles
 * A Perfect Stranger
 * Appointment with Death
 * Harry Potter and the Philosopher's Stone
 * Harry Potter and the Prisoner of Azkaban
 * Jig-Saw
 */

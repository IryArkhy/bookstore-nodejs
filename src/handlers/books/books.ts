import { Request, Response } from 'express';

import { prisma } from '../../db';
import { RequestWithUser } from '../../modules/auth';

import {
  CreateBookReqBody,
  DeleteBookReqBody,
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

  const count = await prisma.book.count({
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
    count: offset === count,
    limit,
    offset: newOffset === count ? null : newOffset,
  });
};

export const getBookByID = async (
  req: Request<{ id: string; authorID: string }>,
  res: Response,
) => {
  const { params } = req;

  const book = await prisma.book.findUnique({
    where: {
      id_authorID: {
        id: params.id,
        authorID: params.authorID,
      },
    },
    include: {
      genres: true,
    },
  });

  if (!book) {
    res.status(404);
    return res.json({ message: 'Book is not found' });
  }
  res.status(200);
  res.json({
    book,
  });
};

export const searchBook = async (
  req: Request<any, any, any, { query: string }>,
  res: Response,
) => {
  const { query } = req;

  const parsedQuery = decodeURIComponent(query.query);

  const books = await prisma.book.findMany({
    where: {
      OR: [
        {
          description: {
            contains: parsedQuery,
            mode: 'insensitive',
          },
        },
        {
          title: {
            contains: parsedQuery,
            mode: 'insensitive',
          },
        },
      ],
    },
  });

  const count = await prisma.book.count({
    where: {
      OR: [
        {
          description: {
            contains: parsedQuery,
            mode: 'insensitive',
          },
        },
        {
          title: {
            contains: parsedQuery,
            mode: 'insensitive',
          },
        },
      ],
    },
  });

  res.status(200);
  res.json({ books, count });
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

    res.status(201);
    res.json({
      book,
    });
  } catch (error) {
    res.status(500);
    res.json(error);
  }
};

export const updateBook = async (
  req: RequestWithUser<
    {
      id: string;
    },
    any,
    UpdateBookReqBody
  >,
  res: Response,
) => {
  const { body, params } = req;

  if (Object.keys(body).length === 0) {
    res.status(400);
    res.json({
      errors: [
        {
          status: 400,
          message: 'No fields to update',
        },
      ],
    });
  } else {
    const book = await prisma.book.update({
      where: {
        id_authorID: {
          id: params.id,
          authorID: body.authorID,
        },
      },
      data: body,
    });
    res.status(200);
    res.json({ message: 'Book updated', book });
  }
};

// TODO: shoudl delete related items
export const deleteBook = async (
  req: RequestWithUser<{ id: string }, any, DeleteBookReqBody>,
  res: Response,
) => {
  const { params, user, body } = req;

  if (user.role !== 'ADMIN') {
    res.status(401);
    res.json({
      message: 'No sufficient permissions.',
    });

    return;
  }
  await prisma.book.update({
    where: {
      id_authorID: {
        id: params.id,
        authorID: body.authorID,
      },
    },
    data: {
      genres: {
        deleteMany: {},
      },
    },
  });

  const deletedBook = await prisma.book.delete({
    where: {
      id_authorID: {
        id: params.id,
        authorID: body.authorID,
      },
    },
  });

  res.status(200);
  res.json({ message: 'Book deleted', book: deletedBook });
};

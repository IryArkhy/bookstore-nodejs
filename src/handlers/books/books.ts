import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextFunction, Request, Response } from 'express';

import { prisma } from '../../db';
import { RequestWithUser } from '../../modules/auth';
import { CustomError, PrismaClientErrorCodes } from '../../types';

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
  next: NextFunction,
) => {
  try {
    const { body, query } = req;
    const { offset = undefined, limit = 20 } = body;
    const { authorID, genre = '', year } = query;

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
      count: count,
      limit,
      offset: newOffset === count ? null : newOffset,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookByID = async (
  req: Request<{ id: string; authorID: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { params } = req;

    const book = await prisma.book.findUniqueOrThrow({
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

    res.status(200);
    res.json({
      book,
    });
  } catch (error) {
    next(error);
  }
};

export const searchBook = async (
  req: Request<any, any, any, { query: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { query } = req;

    const parsedQuery = decodeURIComponent(query.query);

    if (!parsedQuery.length) {
      return res.status(200).json({
        count: 0,
        books: [],
      });
    }

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
  } catch (error) {
    next(error);
  }
};

export const createBook = async (
  req: RequestWithUser<any, any, CreateBookReqBody>,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;

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
    let err: CustomError | Error = error as Error;
    let errorMessage: string = error.message;

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PrismaClientErrorCodes.uniqueConstraint) {
        errorMessage = 'Book with such title already exists';
      }

      if (error.code === PrismaClientErrorCodes.foreignKeyConstraint) {
        errorMessage = `Invalid input. ${JSON.stringify(error.meta)}`;
      }

      err = new CustomError(errorMessage, 'custom', 400);
    }

    next(err);
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
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    let err: CustomError | Error = error as Error;
    let errorMessage: string = error.message;

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PrismaClientErrorCodes.notFoundOperator) {
        errorMessage = JSON.stringify(error.meta);
      }

      err = new CustomError(errorMessage, 'input');
    }

    next(err);
  }
};

export const deleteBook = async (
  req: RequestWithUser<{ id: string }, any, DeleteBookReqBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { params, body } = req;

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
  } catch (error) {
    let err: CustomError | Error = error as Error;
    let errorMessage: string = error.message;

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PrismaClientErrorCodes.notFoundOperator) {
        errorMessage = JSON.stringify(error.meta);
      }

      err = new CustomError(errorMessage, 'input');
    }

    next(err);
  }
};

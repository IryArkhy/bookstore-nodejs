import { NextFunction, Request, Response } from 'express';

import { prisma } from '../../db';
import { RequestWithUser } from '../../modules/auth';
import { CustomError } from '../../types';

import { CreateAuthorReqBody } from './types';

export const getAuthors = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authors = await prisma.author.findMany({
      orderBy: {
        surname: 'asc',
      },
    });
    res.status(200);
    res.json({ authors });
  } catch (error) {
    next(new CustomError(error, 'custom', error?.code));
  }
};

export const getAuthorByID = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { params } = req;

  try {
    const author = await prisma.author.findFirstOrThrow({
      where: {
        id: params.id,
      },
      include: {
        books: true,
      },
    });

    res.status(200);
    res.json({ author });
  } catch (error) {
    next(new CustomError(error, 'custom', 404));
  }
};

export const createAuthor = async (
  req: RequestWithUser<any, any, CreateAuthorReqBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body, user } = req;

    if (user.role !== 'ADMIN') {
      res.status(401).json({
        message: 'Insufficient permissions',
      });
    }

    const author = await prisma.author.create({
      data: {
        name: body.name,
        surname: body.surname,
      },
    });

    res.status(201);
    res.json({ author });
  } catch (error) {
    next(next);
  }
};

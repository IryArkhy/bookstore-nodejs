import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextFunction, Request, Response } from 'express';

import { prisma } from '../../db';
import { CustomError, PrismaClientErrorCodes } from '../../types';

import { CreateGenresReqBody } from './types';

export const getGenres = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    res.status(200);
    res.json({ genres });
  } catch (error) {
    next(error);
  }
};

export const createGenres = async (
  req: Request<any, any, CreateGenresReqBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req;

    await prisma.genre.createMany({
      data: body.genres.map(g => ({ name: g.toLowerCase() })),
    });

    res.status(201);
    res.json({ genres: body.genres.map(g => ({ name: g.toLowerCase() })) });
  } catch (error) {
    let err: CustomError | Error = error as Error;
    let errorMessage: string = error.message;

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PrismaClientErrorCodes.uniqueConstraint) {
        errorMessage = 'Genre already exists';
      }

      if (error.code === PrismaClientErrorCodes.valueTooLong) {
        errorMessage = 'Genre name exceeds 250 chars';
      }

      err = new CustomError(errorMessage, 'custom', 400);
    }

    next(err);
  }
};

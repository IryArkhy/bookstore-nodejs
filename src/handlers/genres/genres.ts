import { Request, Response } from 'express';

import { prisma } from '../../db';

import { CreateGenresReqBody } from './types';

export const getGenres = async (_: Request, res: Response) => {
  const genres = await prisma.genre.findMany();

  res.status(200);
  res.json({ genres });
};

export const createGenres = async (
  req: Request<any, any, CreateGenresReqBody>,
  res: Response,
) => {
  const { body } = req;

  const genres = await prisma.genre.createMany({
    data: body.genres.map(g => ({ name: g })),
  });

  res.status(201);
  res.json({ genres });
};

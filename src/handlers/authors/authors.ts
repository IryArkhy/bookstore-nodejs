import { Request, Response } from 'express';
import { prisma } from '../../db';
import { RequestWithUser } from '../../modules/auth';
import { CreateAuthorReqBody } from './types';

export const getAuthors = async (req: Request, res: Response) => {
  const authors = await prisma.author.findMany();
  res.status(200);
  res.json({ authors });
};

export const getAuthorByID = async (
  req: RequestWithUser<{ authorID: string }>,
  res: Response,
) => {
  const { params, user } = req;

  if (user.role !== 'ADMIN') {
    res.status(401);
    res.json({
      errors: [
        {
          code: 401,
          message: 'Insufficient permissions',
        },
      ],
    });
  }

  const author = await prisma.author.findUnique({
    where: {
      id: params.authorID,
    },
    include: {
      books: true,
    },
  });

  if (!author) {
    res.status(404);
    res.json({ message: 'Author is not found' });
  }

  res.status(200);
  res.json({ author });
};

export const createAuthor = async (
  req: Request<any, any, CreateAuthorReqBody>,
  res: Response,
) => {
  const { body } = req;

  const author = await prisma.author.create({
    data: {
      name: body.name,
      surname: body.surname,
    },
  });

  res.status(201);
  res.json({ author });
};

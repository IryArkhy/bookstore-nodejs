import { Request, Response } from 'express';

import { prisma } from '../../db';
import { comparePasswords, createJWT, hashPassword } from '../../modules/auth';

import { CreateUserRequestBody, SignInRequestBody } from './types';

export const createNewUser = async (
  req: Request<never, never, CreateUserRequestBody, never>,
  res: Response,
) => {
  const { body } = req;

  const userData: CreateUserRequestBody = {
    username: body.username,
    email: body.email,
    password: await hashPassword(body.password),
  };

  if (body.role) {
    userData.role = body.role;
  }

  const user = await prisma.user.create({
    data: userData,
  });

  const token = createJWT({ id: user.id, role: user.role });

  res.status(201);
  res.json({ token });
};

export const signIn = async (
  req: Request<any, any, SignInRequestBody>,
  res: Response,
) => {
  const { body } = req;
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  const isValid = await comparePasswords(body.password, user.password);

  if (!isValid) {
    res.status(401);
    res.json({ message: 'Credentials are not valid' });
  }

  const token = createJWT({ id: user.id, role: user.role });

  res.status(200);
  res.json({
    token,
  });
};

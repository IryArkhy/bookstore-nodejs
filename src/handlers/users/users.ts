import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextFunction, Request, Response } from 'express';

import { prisma } from '../../db';
import { comparePasswords, createJWT, hashPassword } from '../../modules/auth';
import { CustomError, PrismaClientErrorCodes } from '../../types';

import { CreateUserRequestBody, SignInRequestBody } from './types';

export const createNewUser = async (
  req: Request<never, never, CreateUserRequestBody, never>,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    let err: CustomError | Error = error;
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === PrismaClientErrorCodes.uniqueConstraint) {
        const metaString = error.meta
          ? `Check these fields: ${JSON.stringify(error.meta)}`
          : '';

        err = new CustomError(
          `Error: User with such credentials already exist. ${metaString}`,
          'custom',
          400,
        );
      }
    }
    next(err);
  }
};

export const signIn = async (
  req: Request<any, any, SignInRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req;

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: body.email,
      },
    });

    const isValid = await comparePasswords(body.password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Credentials are not valid' });
    }

    const token = createJWT({ id: user.id, role: user.role });

    res.status(200).json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

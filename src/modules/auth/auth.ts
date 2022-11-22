import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';

import type { ROLES as PrismaRole } from '.prisma/client';
import env from '../../env';

type JWTUserInfo = {
  role: PrismaRole;
  id: string;
};

interface IRequestWithUser extends Request {
  user: string | jwt.JwtPayload;
}

// TODO: implement rate limiting (it's added before the api on the network layer (proxy, api gateway))

export const createJWT = ({ id, role }: JWTUserInfo): string => {
  const token = jwt.sign({ id, role }, env.auth.jwtSecret);
  return token;
};

export const protectMiddleware = (
  req: IRequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const bearer = req.headers.authorization;

  const notifyNotAuthorized = (message: string) => {
    res.status(401);
    res.json({ message });
  };

  if (!bearer) {
    notifyNotAuthorized('Not authorized');
    return;
  }

  const [, token] = bearer.split(' ');

  if (!token) {
    notifyNotAuthorized('Not valid token');
    return;
  }

  try {
    const user = jwt.verify(token, env.auth.jwtSecret);

    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    notifyNotAuthorized('Not valid token');
    return;
  }
};

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 5);
};

export const comparePasswords = (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

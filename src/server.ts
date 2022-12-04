import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import env from './env';
import router from './router';
import { protectMiddleware } from './modules/auth';
import * as users from './handlers/users';
import { userValidators } from './handlers/users';
import {
  catchError,
  errorLogger,
  handleInputErrors,
  invalidPathHandler,
} from './modules/middleware';

const app = express();

// middleware
app.use(cors());
app.use(morgan(env.config.morganMode ?? 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.status(200);
  res.json({ message: 'The bookstore api is up and running' });
});

app.use('/api', protectMiddleware, router);
app.post(
  '/user',
  userValidators.createUser,
  handleInputErrors,
  users.createNewUser,
);
app.post('/signin', userValidators.signIn, handleInputErrors, users.signIn);

app.use(invalidPathHandler);
app.use(errorLogger);
app.use(catchError);

export default app;

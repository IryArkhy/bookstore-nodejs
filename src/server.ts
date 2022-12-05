import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import config from './config';
import router from './router';
import { protectMiddleware } from './modules/auth';
import { userHandlers, userValidators } from './handlers/users';
import {
  catchError,
  errorLogger,
  handleInputErrors,
  invalidPathHandler,
} from './modules/middleware';

const app = express();

app.use(cors());
app.use(morgan(config.morganMode));
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
  userHandlers.createNewUser,
);
app.post(
  '/signin',
  userValidators.signIn,
  handleInputErrors,
  userHandlers.signIn,
);

app.use(invalidPathHandler);
app.use(errorLogger);
app.use(catchError);

export default app;

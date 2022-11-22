import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import env from './env';
import router from './router';
import { protectMiddleware } from './modules/auth';
import * as users from './handlers/users';
import { userValidators } from './handlers/users';
import { handleInputErrors } from './modules/middleware';

const app = express();

// middleware
app.use(cors());
app.use(morgan(env.config.morganMode));
app.use(express.json()); // this allows a client to send us json; without it you'd have to convert the bits yourself
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

export default app;

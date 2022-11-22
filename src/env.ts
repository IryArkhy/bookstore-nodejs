import * as dotenv from 'dotenv';

dotenv.config();

export default {
  config: {
    port: process.env.PORT,
    morganMode: process.env.MORGAN_MODE,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
  },
};

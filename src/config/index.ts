import merge from 'lodash.merge';
import * as dotenv from 'dotenv';
dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const stage = process.env.STAGE || 'local';

let envConfig;

if (stage === 'production') {
  envConfig = require('./prod').default;
} else if (stage === 'testing') {
  envConfig = require('./testing').default;
} else {
  envConfig = require('./local').default;
}

const defaultConfig = {
  stage,
  env: process.env.NODE_ENV,
  port: 3001,
  morganMode: 'dev',
  secrets: {
    jwt: process.env.JWT_SECRET,
    dbUrl: process.env.DATABASE_URL,
  },
};

export default merge(defaultConfig, envConfig);

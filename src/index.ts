import config from './config';
import app from './server';

app.listen(config.port, () => {
  console.log({ config });
  console.log(`Hello on ${config.port}`);
});

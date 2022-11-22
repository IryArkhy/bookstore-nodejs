import env from './env';
import app from './server';

app.listen(env.config.port, () => {
  console.log(`hello on ${env.config.port}`);
});

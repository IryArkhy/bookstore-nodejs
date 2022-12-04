import supertest from 'supertest';

import app from '../server';

describe('GET /', () => {
  it('should', async () => {
    const res = await supertest(app).get('/');
    expect(res.body.message).toBe('The bookstore api is up and running');
  });
});

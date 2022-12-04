import * as users from '../users';

describe('user handlers', () => {
  it('should create a new user and return a token', async () => {
    expect.hasAssertions();
    const request = {
      body: {
        email: 'test@email.com',
        username: 'testuser',
        password: 'password-1-1-1-1-1Q_',
      },
    };

    const res = {
      json({ token }) {
        expect(token).toBeTruthy();
      },
    };
    //@ts-expect-error
    await users.createNewUser(request, res, () => {});
  });
});

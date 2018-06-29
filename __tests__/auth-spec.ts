import { Auth, IConfig } from '../src';
import { sign } from 'jsonwebtoken';

describe('Test Auth', () => {
  const config: IConfig = {
    messages: {
      errors: {
        empty_username: 'Username cannot be blank',
        empty_password: 'Password cannot be blank',
        username_already_in_use: 'The specified username is already in use.',
        username_not_registered: 'This username is not registered.',
        invalid_password: 'Invalid password',
        unauthorized: 'Unauthorized',
        invalid_token: 'Invalid token',
        no_permission: 'No permission to access',
      },
    },
    secret: 'This is a secret for fanrenjie s2',
    enableSimpleAuth: true,
    defaultRoles: ['user'],
    expiresIn: '10y',
  }

  const auth = new Auth(config);

  const DOC = {
    _id: 1,
    providers: [],
    roles: [],
  };
  const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsInByb3ZpZGVycyI6W10sInJvbGVzIjpbXSwiaWF0IjoxNTMwMjc5OTE2LCJleHAiOjMxMDgxNTk5MTZ9.9lbXuO4kDeDR2YAFItXoj2gOo-OQXmXm6MSvyie7Eeo';
  const JWT_EXPIRED = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsInByb3ZpZGVycyI6W10sInJvbGVzIjpbXSwiaWF0IjoxNTMwMjc5ODYxLCJleHAiOjE1MzAyNzk4NjJ9.5K4x86JqbQ5A4s6vCdDc7U66yry5GpoFrni3qtHWm9E';

  test('Should sign', () => {
    const jwt1 = auth.signToken(DOC, { });
    const jwt2 = sign(DOC, auth.config.secret, { });
    expect(jwt1).toBe(jwt2);
  });

  test('Should verify success', async () => {
    try {
      expect(await auth.verifyToken(JWT)).toBeTruthy();
    } catch(e) {
      fail(e);
    }
  });

  test('Should verify fail', async () => {
    try {
      expect(await auth.verifyToken('JWT')).toBeFalsy();
    } catch(e) {
      fail(e);
    }
  });



})


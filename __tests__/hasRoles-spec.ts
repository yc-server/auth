import { hasRoles, IConfig } from '../src';

console.error = jest.fn();
console.log = jest.fn();

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
};

test('should hasRoles', async () => {
  const auth: any = {
    config,
  };

  const fn = hasRoles.bind(auth)('a');

  let success: boolean;
  const next = async () => {
    success = true;
  };

  const ctx: any = {
    request: {
      auth: {
        roles: ['a', 'b', 'c'],
      },
    },
  };

  const ctx2: any = {
    request: {
      auth: {
        roles: [],
      },
    },
  };

  await fn(ctx, next);
  expect(success).toBe(true);

  await fn(ctx2, next);
  expect(ctx2.body.statusCode).toBe(403);
});

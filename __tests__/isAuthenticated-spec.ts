import { Auth, isAuthenticated, IConfig } from '../src'

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
}

test('should isAuthenticated', async () => {
  const auth: any = {
    model: {
      findById(id: any) {
        return {
          async exec() {
            return true;
          },
        };
      },
    },
  };

  const fn = isAuthenticated.bind(auth)();

  let success: boolean;
  const next = async () => {
    success = true;
  };

  const ctx: any = {
    request: {
      auth: true,
    },
  };

  await fn(ctx, next);
  expect(success).toBe(true);
});

test('should unauthorized', async () => {
  const auth: any = {
    model: {
      findById(id: any) {
        return {
          async exec() {
            return true;
          },
        };
      },
    },
    config,
  };

  const fn = isAuthenticated.bind(auth)();

  let success: boolean;
  const next = async () => {
    success = true;
  };

  const ctx: any = {
    request: {
      auth: false,
    },
  };

  await fn(ctx, next);
  expect(ctx.body.statusCode).toBe(401);
});

test('should notAcceptable', async () => {
  const auth: any = {
    model: {
      findById(id: any) {
        return {
          async exec() {
            return false;
          },
        };
      },
    },
    config,
  };

  const fn = isAuthenticated.bind(auth)();

  let success: boolean;
  const next = async () => {
    success = true;
  };

  const ctx: any = {
    request: {
      auth: true,
    },
  };

  await fn(ctx, next);
  expect(ctx.body.statusCode).toBe(406);
});
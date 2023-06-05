import * as sinon from 'ts-sinon';
import { IncomingHttpHeaders } from 'http';
import { Request, BaseResponse } from 'koa';
import { CannerPATAuthenticator } from '@vulcan-sql/serve/auth';
import { AuthResult, AuthStatus, KoaContext } from '@vulcan-sql/serve/models';

const wrappedAuthCredential = async (
  ctx: KoaContext,
  options: any,
  resolveValue: any = null
): Promise<AuthResult> => {
  const authenticator = new CannerPATAuthenticator({ options }, '');
  if (resolveValue) {
    sinon.default
      .stub(authenticator, <any>'fetchCannerUser')
      .resolves(resolveValue);
  }
  await authenticator.activate();
  return await authenticator.authCredential(ctx);
};

const getTokenInfo = async (
  ctx: KoaContext,
  options: any
): Promise<Record<string, any>> => {
  const authenticator = new CannerPATAuthenticator({ options }, '');
  await authenticator.activate();
  return await authenticator.getTokenInfo(ctx);
};

const expectIncorrect = {
  status: AuthStatus.INDETERMINATE,
  type: 'canner-pat',
};
const expectFailed = (
  message = 'authenticate user by "canner-pat" type failed.'
) => ({
  status: AuthStatus.FAIL,
  type: 'canner-pat',
  message,
});
const mockOptions = {
  'canner-pat': {
    host: 'mockHost',
    port: 3000,
    ssl: false,
  },
};
const invalidToken = Buffer.from('clientId:clientSecret').toString('base64');

it.each([
  { 'canner-pat': { host: 'mockHost' } },
  { 'canner-pat': { port: 3000 } },
  { 'canner-pat': { ssl: false } },
  { 'canner-pat': {} },
])('Should throw configuration error when options = %p', async (options) => {
  // Arrange
  const ctx = {
    ...sinon.stubInterface<KoaContext>(),
    request: {
      ...sinon.stubInterface<Request>(),
      headers: {
        authorization: 'Canner-PAT 1234567890',
      },
    },
  } as KoaContext;

  // Act, Assert
  await expect(wrappedAuthCredential(ctx, options)).rejects.toThrow(
    'please provide correct connection information to Canner Enterprise, including "host" and "port".'
  );
});
it('Test to auth credential failed when request header not exist "authorization" key', async () => {
  // Arrange
  const ctx = {
    ...sinon.stubInterface<KoaContext>(),
    request: {
      ...sinon.stubInterface<Request>(),
      headers: {
        ...sinon.stubInterface<IncomingHttpHeaders>(),
      },
    },
  } as KoaContext;

  // Act
  const result = await wrappedAuthCredential(ctx, mockOptions);

  // Assert
  expect(result).toEqual(expectIncorrect);
});

it('Should auth credential failed when request header "authorization" not start with "canner-pat"', async () => {
  // Arrange
  const ctx = {
    ...sinon.stubInterface<KoaContext>(),
    request: {
      ...sinon.stubInterface<Request>(),
      headers: {
        ...sinon.stubInterface<IncomingHttpHeaders>(),
        authorization: 'Incorrect-Prefix 1234567890',
      },
    },
  } as KoaContext;

  // Act
  const result = await wrappedAuthCredential(ctx, mockOptions);

  // Assert
  expect(result).toEqual(expectIncorrect);
});

it('Should auth credential failed when the PAT token in the authorization header does not pass the canner host', async () => {
  // Arrange
  const ctx = {
    ...sinon.stubInterface<KoaContext>(),
    request: {
      ...sinon.stubInterface<Request>(),
      headers: {
        ...sinon.stubInterface<IncomingHttpHeaders>(),
        authorization: `Canner-PAT ${invalidToken}`,
      },
    },
    set: sinon.stubInterface<BaseResponse>().set,
  };
  // Act
  const mockResolveValue = {
    status: 401,
    data: { error: 'invalid token from canner' },
  };
  const result = await wrappedAuthCredential(
    ctx,
    mockOptions,
    mockResolveValue
  );

  // Assert
  expect(result).toEqual(expectFailed('invalid token'));
});

it('Should auth credential failed when the canner host does not return the userMe', async () => {
  // Arrange
  const ctx = {
    ...sinon.stubInterface<KoaContext>(),
    request: {
      ...sinon.stubInterface<Request>(),
      headers: {
        ...sinon.stubInterface<IncomingHttpHeaders>(),
        authorization: `Canner-PAT ${invalidToken}`,
      },
    },
    set: sinon.stubInterface<BaseResponse>().set,
  };
  const mockResolveValue = {
    status: 200,
    // the expected response data should be { data: { userMe: { attrs... } } }
    data: { data: { notUserMe: null } },
  };

  // Act
  const result = await wrappedAuthCredential(
    ctx,
    mockOptions,
    mockResolveValue
  );

  // Assert
  expect(result).toEqual(
    expectFailed('Can not retrieve user info from canner server')
  );
});

it('Should auth credential successful when request header "authorization" pass the canner host', async () => {
  // Arrange
  const ctx = {
    ...sinon.stubInterface<KoaContext>(),
    request: {
      ...sinon.stubInterface<Request>(),
      headers: {
        ...sinon.stubInterface<IncomingHttpHeaders>(),
        authorization: `Canner-PAT eyValidToken`,
      },
    },
  } as KoaContext;
  const mockResolveValue = {
    status: 200,
    data: {
      data: {
        userMe: {
          email: 'myEmail@google.com',
          enabled: true,
          username: 'mockUser',
          attr1: 'value1',
        },
      },
    },
  };

  const expected = {
    status: AuthStatus.SUCCESS,
    type: 'canner-pat',
    user: {
      name: 'mockUser',
      attr: {
        email: 'myEmail@google.com',
        enabled: true,
        attr1: 'value1',
      },
    },
  } as AuthResult;

  // Act
  const result = await wrappedAuthCredential(
    ctx,
    mockOptions,
    mockResolveValue
  );

  // Assert
  expect(result).toEqual(expected);
});

// Token info
it('Should throw when use getTokenInfo with cannerPATAuthenticator', async () => {
  // Arrange
  const ctx = {
    ...sinon.stubInterface<KoaContext>(),
    request: {
      ...sinon.stubInterface<Request>(),
      body: {},
    },
  };

  // Act Assert
  await expect(getTokenInfo(ctx, mockOptions)).rejects.toThrow(
    'canner-pat does not support token generate.'
  );
});

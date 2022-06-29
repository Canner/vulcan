import faker from '@faker-js/faker';
import * as Koa from 'koa';
import * as supertest from 'supertest';
import { CorsOptions, CorsMiddleware } from '@middleware/built-in-middlewares';
import { Server } from 'http';

describe('Test cors middlewares', () => {
  let server: Server;
  const domain = faker.internet.domainName();
  beforeAll(async () => {
    // Should use koa app and supertest for testing, because it will call koa context method in cors middleware.
    const app = new Koa();

    const middleware = new CorsMiddleware({
      middlewares: {
        cors: {
          options: {
            origin: domain,
          } as CorsOptions,
        },
      },
    });
    // use middleware in koa app
    app.use(middleware.handle.bind(middleware));
    // Act
    server = app.listen(faker.internet.port());
  });

  afterAll(() => {
    server.close();
  });
  it('Should validate successfully when pass correct origin domain', async () => {
    // Arrange
    const request = supertest(server).get('/').set('Origin', domain);
    // Act
    const response = await request;
    // Assert
    expect(response.header['access-control-allow-origin']).toEqual(domain);
  });

  it('Should validate failed when pass incorrect origin domain', async () => {
    // Arrange
    const incorrectDomain = faker.internet.domainName();
    const request = supertest(server).get('/').set('Origin', incorrectDomain);
    // Act
    const response = await request;
    // Assert
    expect(response.header['access-control-allow-origin']).not.toEqual(
      incorrectDomain
    );
  });
});

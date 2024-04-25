import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    let prisma = app.get<PrismaService>(PrismaService);
    prisma.cleanDatabase();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register/ (POST)', () => {
    it('Registration successful - should return new user credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'testuserpass' })
        .expect(201)
        .expect((res) => {
          const data = JSON.parse(res.text);
          if (!data.jwt) throw new Error('Missing JWT!');
          token = data.jwt;
          if (data.username !== 'testuser')
            throw new Error('Username mismatch!');
          if (!data.success) throw new Error("Request wasn't successful!");
        });
    });

    it('Registration failed (user already exists) - should throw an error', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'testuser', password: 'testuserpass' })
        .expect(403);
    });
  });

  describe('/auth/login/ (POST)', () => {
    it(`Login failed (wrong password) - should throw an error`, () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' })
        .expect(403);
    });

    it(`Login failed (username doesn't exist) - should throw an error`, () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'thisuserdoesnotexist', password: 'testuserpass' })
        .expect(403);
    });

    it('Login successful - should return a logged in user credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser', password: 'testuserpass' })
        .expect(200)
        .expect((res) => {
          const data = JSON.parse(res.text);
          if (!data.jwt) throw new Error('Missing JWT!');
          token = data.jwt;
          if (data.username !== 'testuser')
            throw new Error('Username mismatch!');
          if (!data.success) throw new Error("Request wasn't successful!");
        });
    });
  });

  describe('/auth/verify/ (POST)', () => {
    it('JWT verification failed (JWT is missing)', () => {
      return request(app.getHttpServer())
        .post('/auth/verify')
        .send({})
        .expect(403);
    });

    it('JWT verification successful', () => {
      return request(app.getHttpServer())
        .post('/auth/verify')
        .send({
          jwt: token,
        })
        .expect(200);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        findOne: jest.fn(),
        save: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Un utilisateur peut s'inscrire avec des informations valides", async () => {
    authService.signUp.mockResolvedValue({
      id: '1',
      email: 'validuser@example.com',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'validuser@example.com',
        password: 'ValidPassword123!',
        firstname: 'John',
        lastname: 'Doe',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it("Un utilisateur ne peut pas s'inscrire avec un email déjà utilisé", async () => {
    authService.signUp.mockRejectedValue(new Error('Email existant'));

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'duplicateuser@example.com',
        password: 'ValidPassword123!',
        firstname: 'Jane',
        lastname: 'Doe',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Email existant');
  });

  it('Un utilisateur peut se connecter avec des informations valides', async () => {
    authService.signIn.mockResolvedValue({ access_token: 'some_token' });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'loginuser@example.com',
        password: 'ValidPassword123!',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');
  });

  it('Un utilisateur ne peut pas se connecter avec un mot de passe incorrect', async () => {
    authService.signIn.mockRejectedValue(new Error('Mot de passe incorrect'));

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'wrongpassworduser@example.com',
        password: 'WrongPassword123!',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Mot de passe incorrect');
  });
});

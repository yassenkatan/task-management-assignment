import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


describe('AdminUserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  async function getToken () {
    const adminUser = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const response = await request(app.getHttpServer())
    .post(`/dashboard/auth/login`)
    .send({ userName: adminUser, password: adminPassword})
    .expect(201)
    .expect((res) => {
      expect(res.body).toBeDefined();
    });

    const { body } = response;

    // For example, if the response contains a token, you can use it in the Authorization header for another request
    const token = body.accessToken;
    return token;
  }
  

  // Create user success
  it(`/dashboard/user/create-user (POST) - capture response`, async () => { 
    const token = await getToken();
    
    // check the db user table
    // Example usage:
    const randomNumbers = getRandomInt(1, 10000);
    return request(app.getHttpServer())
      .post(`/dashboard/user/create-user`)
      .set('Authorization', `Bearer ${token}`)
      .send(
        { 
          firstName: 'test',
          lastName: 'user',
          email: `test_${randomNumbers}@example.com`,
          password: 'P@ssw0rd123@@##$$',
          confirmPassword: 'P@ssw0rd123@@##$$'
         })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.fullName).toBe('test user');
      });
  });

  // Create user with exist email
  it(`/dashboard/user/create-user (POST) - exist user`, async () => {

    const token = await getToken();
    
    // check the db user table
    const adminUser = process.env.ADMIN_EMAIL;
    return request(app.getHttpServer())
      .post(`/dashboard/user/create-user`)
      .set('Authorization', `Bearer ${token}`)
      .send(
        { 
          firstName: 'test',
          lastName: 'user',
          email: adminUser,
          password: 'P@ssw0rd123@@##$$',
          confirmPassword: 'P@ssw0rd123@@##$$'
         })
      .expect(400)
      .expect((res) => {
        console.log(res.body); // Log the response body to see the error message
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBeDefined();
        expect(res.body.message).toContain('User exist by email');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';

describe('ClientUserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  async function getToken () {
    const userEmail = 'test@yopmail.com';
    const userPassword = 'P@ssw0rd123@@##$$';

    const response = await request(app.getHttpServer())
    .post(`/client/auth/login`)
    .send({ userName: userEmail, password: userPassword})
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
  it(`Create first user`, async () => { 
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
    const token = body.accessToken;

    const userResponse = await request(app.getHttpServer())
    .get(`/dashboard/user/users-list?order=desc&page=1&limit=10000`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect((res) => {
      expect(res.body).toBeDefined();
    });

    const userList = userResponse.body.response.users;
    const res = userList.filter(x => x.email == `test@yopmail.com`);
    if(res.count == 0) {
    // check the db user table
    return request(app.getHttpServer())
      .post(`/dashboard/user/create-user`)
      .set('Authorization', `Bearer ${token}`)
      .send(
         { 
           firstName: 'test',
           lastName: 'user',
           email: `test@yopmail.com`,
           password: 'P@ssw0rd123@@##$$',
           confirmPassword: 'P@ssw0rd123@@##$$'
          })
       .expect(201)
       .expect((res) => {
         expect(res.body).toHaveProperty('id');
         expect(res.body.fullName).toBe('test user');
      });
    }
  });

  // get user profile
  it(`/client/user/get-my-profile (Get) - capture data`, async () => {
      const token = await getToken();
      return request(app.getHttpServer())
      .get(`/client/user/get-my-profile`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        console.log(res.body);
        expect(res.body).toHaveProperty('id');
        expect(res.body.fullName).toBe('test user');
        expect(res.body.email).toBe('test@yopmail.com');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
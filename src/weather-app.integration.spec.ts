import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { WeatherAppController } from './controller/weather-app.controller';
import { WeatherAppService } from './service/weather-app.service';

describe('Weather Integration Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      controllers: [WeatherAppController],
      providers: [WeatherAppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/weather (POST) should return weather data', async () => {
    const city = 'London';
    const res = await request(app.getHttpServer())
      .post('/weather/weather')
      .send({ city });

    expect(res.status).toBe(201); // You can use 200 if that's your controller's response status
    expect(res.body).toHaveProperty('weather');
    expect(res.body.weather).toHaveProperty('location');
  });

  it('/weather/history (GET) should return search history', async () => {
    const res = await request(app.getHttpServer()).get('/weather/history');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

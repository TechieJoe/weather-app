import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { WeatherAppController } from 'src/controller/weather-app.controller';
import { WeatherAppService } from 'src/service/weather-app.service';

describe('WeatherController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({ isGlobal: true }),
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

  it('/weather/weather (POST) should return weather data', async () => {
    const response = await request(app.getHttpServer())
      .post('/weather/weather')
      .send({ city: 'London' });

    console.log('Weather response:', response.body);

    expect(response.status).toBe(201); // or 200 based on your controller
    expect(response.body.weather).toBeDefined();
    expect(response.body.weather).toHaveProperty('location');
  });

  it('/weather/history (GET) should return search history', async () => {
    const response = await request(app.getHttpServer()).get('/weather/history');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { WeatherAppService } from './weather-app.service';

describe('WeatherAppService', () => {
  let service: WeatherAppService;
  let httpService: Partial<HttpService>;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
    };

    configService = {
      get: jest.fn().mockReturnValue('dummy-api-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherAppService,
        { provide: HttpService, useValue: httpService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<WeatherAppService>(WeatherAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch weather and add city to history', async () => {
    const mockData = { location: { name: 'London' }, current: { temp_c: 20 } };
    (httpService.get as jest.Mock).mockReturnValue(of({ data: mockData }));

    const result = await service.getWeather('London');

    expect(result).toEqual(mockData);
    expect(service.getSearchHistory()).toContain('London');
  });

  it('should throw an exception if API fails', async () => {
    (httpService.get as jest.Mock).mockReturnValue(throwError(() => new Error('API error')));

    await expect(service.getWeather('InvalidCity')).rejects.toThrow(
      new HttpException('City not found or API error', HttpStatus.BAD_REQUEST),
    );
  });

  it('should not duplicate cities in history', async () => {
    service['searchHistory'] = ['Paris'];
    service.addToSearchHistory('Paris');
    expect(service.getSearchHistory()).toEqual(['Paris']);

    service.addToSearchHistory('Berlin');
    expect(service.getSearchHistory()).toEqual(['Paris', 'Berlin']);
  });
});

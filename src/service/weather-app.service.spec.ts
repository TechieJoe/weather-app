import { Test, TestingModule } from '@nestjs/testing';
import { WeatherAppService } from './weather-app.service';

describe('WeatherAppService', () => {
  let service: WeatherAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherAppService,
        {
          provide: 'HttpService',
          useValue: {}, // Provide a mock or actual implementation as needed
        },
        {
          provide: 'ConfigService',
          useValue: {}, // Provide a mock or actual implementation as needed
        },
      ],
    }).compile();

    service = module.get<WeatherAppService>(WeatherAppService);


  });

});

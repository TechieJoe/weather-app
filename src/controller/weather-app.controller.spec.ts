import { Test, TestingModule } from '@nestjs/testing';
import { WeatherAppController } from './weather-app.controller';
import { WeatherAppService } from '../service/weather-app.service';
describe('WeatherAppController', () => {
  let controller: WeatherAppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherAppController],
      providers: [WeatherAppService],
    }).compile();

    controller = module.get<WeatherAppController>(WeatherAppController);
  });

});

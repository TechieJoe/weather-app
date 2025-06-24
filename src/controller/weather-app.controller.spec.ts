import { Test, TestingModule } from '@nestjs/testing';
import { WeatherAppController } from './weather-app.controller';
import { WeatherAppService } from '../service/weather-app.service';


describe('WeatherController', () => {
  let controller: WeatherAppController;
  let service: Partial<WeatherAppService>;

  beforeEach(async () => {
    service = {
      getWeather: jest.fn(),
      getSearchHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherAppController],
      providers: [{ provide: WeatherAppService, useValue: service }],
    }).compile();

    controller = module.get<WeatherAppController>(WeatherAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should render the home page', () => {
    expect(controller.home()).toBeUndefined(); // since it's just rendering
  });

  it('should return weather data if service succeeds', async () => {
    const mockWeather = { temp: 22 };
    (service.getWeather as jest.Mock).mockResolvedValue(mockWeather);

    const result = await controller.getWeather('London');

    expect(service.getWeather).toHaveBeenCalledWith('London');
    expect(result).toEqual({ message: null, weather: mockWeather });
  });

  it('should return an error message if service fails', async () => {
    (service.getWeather as jest.Mock).mockRejectedValue(new Error('City not found'));

    const result = await controller.getWeather('Nowhere');

    expect(result).toEqual({ message: 'City not found', weather: null });
  });

  it('should return search history', () => {
    const history = ['Lagos', 'Berlin'];
    (service.getSearchHistory as jest.Mock).mockReturnValue(history);

    const result = controller.getSearchHistory();
    expect(result).toEqual(history);
  });
});

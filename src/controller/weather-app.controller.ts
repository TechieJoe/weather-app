import { Body, Controller, Get, Render, Post } from '@nestjs/common';
import { WeatherAppService } from 'src/service/weather-app.service';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('weather')
@Controller('weather')
export class WeatherAppController {
  constructor(private readonly weatherAppService: WeatherAppService) {}

  @Render('home')
  @Get('/')
  @ApiOperation({ summary: 'Render home page' })
  home() {}

  @Post('weather')
  @ApiOperation({ summary: 'Get weather for a city' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        city: { type: 'string', example: 'London' },
      },
      required: ['city'],
    },
  })
  @ApiResponse({ status: 200, description: 'Weather data returned.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getWeather(@Body('city') city: string) {
    try {
      const weather = await this.weatherAppService.getWeather(city);
      return { message: null, weather };
    } catch (error) {
      return { message: error.message, weather: null };
    }
  }

  @Get('history')
  @ApiOperation({ summary: 'Get search history' })
  @ApiResponse({ status: 200, description: 'Search history returned.' })
  getSearchHistory() {
    return this.weatherAppService.getSearchHistory();
  }
}

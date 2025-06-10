// filepath: /c:/Users/USER/weather app/app/src/services/weather.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WeatherAppService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.weatherapi.com/v1';
  private searchHistory: string[] = []; // In-memory storage for search history

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('WEATHER_API_KEY');
    if (!apiKey) {
      throw new Error('WEATHER_API_KEY is not defined in environment variables');
    }
    this.apiKey = apiKey;
  }

  async getWeather(city: string): Promise<any> {
    const url = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${city}`;
    try {
      const response = await lastValueFrom(this.httpService.get(url));
      this.addToSearchHistory(city);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'City not found or API error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  addToSearchHistory(city: string) {
    if (!this.searchHistory.includes(city)) {
      this.searchHistory.push(city);
    }
  }

  getSearchHistory(): string[] {
    return this.searchHistory;
  }
}
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';  
import { ConfigModule } from '@nestjs/config';
import { WeatherAppController } from './controller/weather-app.controller';
import { WeatherAppService } from './service/weather-app.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [WeatherAppController],
  providers: [WeatherAppService],
})
export class AppModule {}

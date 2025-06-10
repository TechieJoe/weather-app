import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherAppController } from 'src/controller/weather-app.controller';
import { WeatherAppService } from 'src/service/weather-app.service';
@Module({

  imports: [ HttpModule ],
  controllers: [WeatherAppController],
  providers: [WeatherAppService],

})
export class WeatherAppModule {}


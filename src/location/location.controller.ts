import { Controller, Get, Param, ParseFloatPipe, Query } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('reverse-geocoding')
  async getReverseGeocoding(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lon', ParseFloatPipe) lon: number,
  ) {
    return await this.locationService.getReverseGeocoding(lat, lon);
  }

  @Get('suggest')
  async getSuggestions(@Query('query') query: string) {
    return await this.locationService.getSuggestions(query);
  }

  @Get(':ip')
  async getLocationFromIp(@Param('ip') ip: string) {
    return await this.locationService.getLocationFromIp(ip);
  }
}

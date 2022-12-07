import { Controller, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.locationService.getLocationFromIp(id);
  }
}

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LocationService {
  async getLocationFromIp(ip: string) {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}`);

    const latLon = {
      lat: data.lat,
      lon: data.lon,
    };

    return latLon;
  }
}

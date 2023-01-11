import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ReverseGeocodingDto } from './dto/reverseGeocodingDto';
import { SuggestDto } from './dto/suggestDto';

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

  private formatReverseGeocoding(data: any): ReverseGeocodingDto {
    const { features } = data;

    return features.map((feature: any) => {
      const { place_name: name, center, properties } = feature;
      const { address } = properties;
      const [lon, lat] = center;

      return {
        lat,
        lon,
        name,
        address,
      };
    });
  }

  async getReverseGeocoding(lat: number, lon: number) {
    const { data } = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json`,
      {
        params: {
          access_token: process.env.MAPBOX_API_KEY,
          types: 'address',
        },
      },
    );

    return this.formatReverseGeocoding(data);
  }

  private formatSuggestions(data: any): SuggestDto[] {
    const { features } = data;

    return features.map((feature: any) => {
      const { place_name: address, center, text: name } = feature;
      const [lon, lat] = center;

      return {
        lat,
        lon,
        name,
        address,
      };
    });
  }

  async getSuggestions(query: string) {
    const { data } = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
      {
        params: {
          access_token: process.env.MAPBOX_API_KEY,
          session_token: 'session' + 'test',
          types: 'address',
          limit: 5,
          language: 'en',
          country: 'ro',
        },
      },
    );

    return this.formatSuggestions(data);
  }
}

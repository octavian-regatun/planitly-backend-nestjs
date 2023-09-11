import { Mapper, createMap, createMapper } from '@automapper/core';
import { PojosMetadataMap, pojos } from '@automapper/pojos';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { User } from '@prisma/client';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';

@Injectable()
export class MapperService implements OnModuleInit {
  mapper: Mapper;

  onModuleInit() {
    this.createUserMetadata();
    this.mapper = createMapper({ strategyInitializer: pojos() });

    createMap<User, PublicUserDto>(this.mapper, 'User', 'PublicUserDto');
  }

  private createUserMetadata() {
    PojosMetadataMap.create<User>('User', {
      id: Number,
      username: String,
      firstName: String,
      lastName: String,
      email: String,
      gender: String,
      picture: String,
      role: String,
      authProvider: String,
      updatedAt: Date,
      createdAt: Date,
    });

    PojosMetadataMap.create<PublicUserDto>('PublicUserDto', {
      id: Number,
      username: String,
      firstName: String,
      lastName: String,
      picture: String,
    });
  }
}

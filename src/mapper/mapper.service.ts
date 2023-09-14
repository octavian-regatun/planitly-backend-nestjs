import { Mapper, createMap, createMapper } from '@automapper/core';
import { PojosMetadataMap, pojos } from '@automapper/pojos';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Friendship, User } from '@prisma/client';
import { FriendshipDto } from 'src/friendships/dto/friendship.dto';
import { PublicUserDto } from 'src/users/dto/public-user.dto';

@Injectable()
export class MapperService implements OnModuleInit {
  mapper!: Mapper;

  onModuleInit() {
    this.createUserMetadata();
    this.createFriendshipMetadata();

    this.mapper = createMapper({ strategyInitializer: pojos() });

    createMap<User, PublicUserDto>(this.mapper, 'User', 'PublicUserDto');
    createMap<Friendship, FriendshipDto>(
      this.mapper,
      'Friendship',
      'FriendshipDto',
    );
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

  private createFriendshipMetadata() {
    PojosMetadataMap.create<Friendship & { requester: User; recipient: User }>(
      'Friendship',
      {
        id: Number,
        status: String,
        requesterId: Number,
        recipientId: Number,
        requester: 'User',
        recipient: 'User',
        createdAt: Date,
        updatedAt: Date,
      },
    );

    PojosMetadataMap.create<FriendshipDto>('FriendshipDto', {
      id: Number,
      status: String,
      requesterId: Number,
      recipientId: Number,
      requester: 'PublicUserDto',
      recipient: 'PublicUserDto',
      createdAt: Date,
      updatedAt: Date,
    });
  }
}

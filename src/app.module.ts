import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { FriendshipsModule } from './friendships/friendships.module';
import { GroupMembersModule } from './group-members/group-members.module';
import { GroupsModule } from './groups/groups.module';
import { HealthModule } from './health/health.module';
import { LocationModule } from './location/location.module';
import { MapperModule } from './mapper/mapper.module';
import { MapperService } from './mapper/mapper.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    EventsModule,
    LocationModule,
    FriendshipsModule,
    MapperModule,
    GroupsModule,
    GroupMembersModule,
    HealthModule,
  ],
  providers: [MapperService],
})
export class AppModule {}

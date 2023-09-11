import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { JwtModule } from './jwt/jwt.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { LocationModule } from './location/location.module';
import { FriendshipsModule } from './friendships/friendships.module';
import { MapperService } from './mapper/mapper.service';
import { MapperModule } from './mapper/mapper.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestJwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
      global: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    JwtModule,
    EventsModule,
    PassportModule,
    LocationModule,
    FriendshipsModule,
    MapperModule,
  ],
  providers: [MapperService],
})
export class AppModule {}

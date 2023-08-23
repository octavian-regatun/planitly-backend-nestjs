import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { JwtModule } from './jwt/jwt.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CalendarModule } from './calendar/calendar.module';
import { LocationModule } from './location/location.module';
import { FriendshipsModule } from './friendships/friendships.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    JwtModule,
    EventsModule,
    PassportModule,
    NestJwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
      global: true,
    }),
    CalendarModule,
    LocationModule,
    FriendshipsModule,
  ],
})
export class AppModule {}

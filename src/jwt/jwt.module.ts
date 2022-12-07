import { Global, Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  providers: [JwtStrategy],
})
export class JwtModule {}

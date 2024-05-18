import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [
    UserModule,
    JwtModule,
  ],
  providers: [AuthenticationService, JwtStrategy],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}
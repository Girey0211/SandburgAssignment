import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import SignupDto from './dto/signup.dto';
import { AuthenticationService } from './authentication.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  async register(@Body() data: SignupDto) {
    return this.authenticationService.register(data);
  }
}
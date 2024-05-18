import { Body, ClassSerializerInterceptor, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import SignupDto from './dto/signup.dto';
import { AuthenticationService } from './authentication.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import LogInDto from './dto/login.dto';
import RequestWithUser from './requsetWithUser.interface';

@ApiTags('Auth')
@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOperation({ summary: '회원가입 API' })
  @Post('signup')
  async register(@Body() dto: SignupDto) {
    return this.authenticationService.register(dto);
  }

  @ApiOperation({ summary: '로그인 API' })
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const token = this.authenticationService.createJwtToken(user.userId);
    return token
  }
}
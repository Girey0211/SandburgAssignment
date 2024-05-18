import {
  Body,
  ClassSerializerInterceptor,
  Controller, Delete, Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import SignupDto from './dto/signup.dto';
import { AuthenticationService } from './authentication.service';
import { ApiBody, ApiExtraModels, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requsetWithUser.interface';
import LogInDto from './dto/login.dto';
import JwtAuthenticationGuard from './JwtAuthenticationGuard';

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

  @Post('login')
  @ApiOperation({ summary: '로그인 API' })
  @ApiExtraModels(LogInDto)
  @ApiBody({
    schema: { $ref: getSchemaPath(LogInDto) },
  })
  @UseGuards(LocalAuthenticationGuard)
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.authenticationService.createJwtToken(user.userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiOperation({ summary: '유저 조회 API' })
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete()
  @ApiOperation({ summary: '유저 삭제 API' })
  async deletePost(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.authenticationService.deleteUser(user.userId)
  }
}
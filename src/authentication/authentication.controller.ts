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
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard';
import RequestWithUser from './requsetWithUser.interface';
import LogInDto from './dto/login.dto';
import JwtAuthenticationGuard from './guard/JwtAuthenticationGuard';
import { UserResponseDto } from '../user/dto/userResponse.dto';
import TokenDto from './dto/token.dto';

@ApiTags('Auth')
@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입 API' })
  @ApiOkResponse({ type: UserResponseDto, description: 'Successful response' })
  async register(@Body() dto: SignupDto): Promise<UserResponseDto> {
    return this.authenticationService.register(dto);
  }

  @Post('login')
  @UseGuards(LocalAuthenticationGuard)
  @ApiOperation({ summary: '로그인 API' })
  @ApiExtraModels(LogInDto)
  @ApiBody({ schema: { $ref: getSchemaPath(LogInDto) } })
  @ApiOkResponse({ type: TokenDto, description: 'Successful response' })
  async logIn(@Req() request: RequestWithUser): Promise<TokenDto> {
    const { user } = request;
    return new TokenDto(this.authenticationService.createJwtToken(user.userId));
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiOperation({ summary: '유저 조회 API' })
  @ApiOkResponse({ type: UserResponseDto, description: 'Successful response' })
  authenticate(@Req() request: RequestWithUser): UserResponseDto {
    return {
      email: request.user.email,
      id: request.user.id,
      role: request.user.role,
    };
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete()
  @ApiOperation({ summary: '유저 삭제 API' })
  @ApiOkResponse({ type: UserResponseDto, description: 'Successful response' })
  async deletePost(@Req() request: RequestWithUser): Promise<UserResponseDto> {
    const { user } = request;
    return this.authenticationService.deleteUser(user.userId)
  }
}
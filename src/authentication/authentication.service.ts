import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import SignupDto from './dto/signup.dto';
import { Prisma, Role } from '@prisma/client';
import { PrismaError } from '../util/prismaError';
import { UserAlreadyExist } from './exception/userAlreadyExsist.exception';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(dto: SignupDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = Role.USER
    try {
      const user = await this.usersService.create({
        ...dto,
        password: hashedPassword,
        role: role,
      });
      return {
        ...user,
        password: undefined,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaError.UniqueConstraintFailed
      ) {
        throw new UserAlreadyExist()
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import SignupDto from './dto/signup.dto';
import { Prisma, Role } from '@prisma/client';
import { PrismaError } from '../util/prismaError';
import { UserAlreadyExist } from './exception/userAlreadyExsist.exception';
import TokenPayload from './toeknPayload';
import { PasswordDoesNotMatchException } from './exception/passwordDoesNotMatch.exception';
import { UserNotFoundException } from '../user/exception/userNotFound.exception';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
  }

  public async register(dto: SignupDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = Role.USER;
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
        throw new UserAlreadyExist();
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public createJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    return this.jwtService.sign(payload);
  }

  async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundException();
      }
      throw error;
    }
  }

  private async verifyPassword(plainTextPassword: any, hashedPassword: any) {
    if (await bcrypt.compare(plainTextPassword, hashedPassword) == false) {
      throw new PasswordDoesNotMatchException();
    }
  }

  public async deleteUser(userId: number) {
    try {
      return await this.usersService.deleteUser(userId);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundException();
      }
      throw error;
    }
  }
}
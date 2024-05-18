import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserAlreadyExist } from '../authentication/exception/userAlreadyExsist.exception';
import { UserNotFoundException } from './exception/userNotFound.exception';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: CreateUserDto) {
    const { id, email, password, role } = user
    return this.prismaService.user.create({
      data: {
        id, email, password, role
      }
    });
  }

  async getById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
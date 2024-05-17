import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(user: CreateUserDto) {
    return this.prismaService.user.create({
      data: user,
    });
  }
}
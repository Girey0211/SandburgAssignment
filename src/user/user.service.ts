import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserAlreadyExist } from './exception/userNotFound.exception';
import Role from './enum/Role';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: CreateUserDto) {
    const { id, email, password} = user;
    const role = Role.USER

    const duplicate = await this.prismaService.user.findMany({
      where: { OR: [{ id }, { email }] }, // id, nickname 중 중복되는 것 찾기
    });
    if (duplicate.length != 0) throw new UserAlreadyExist();

    return this.prismaService.user.create({
      data: { id, email, password, role }
    });
  }
}
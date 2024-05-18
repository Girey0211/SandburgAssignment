import { Role } from '@prisma/client';

export class CreateUserDto {
  email: string;
  id: string;
  password: string;
  role?: Role
}
import { ConflictException } from '@nestjs/common';

export class UserAlreadyExist extends ConflictException {
  constructor() {
    super(`User already exist`);
  }
}
import { BadRequestException } from '@nestjs/common';

export class PasswordDoesNotMatchException extends BadRequestException {
  constructor() {
    super(`Password Does Not Match`);
  }
}
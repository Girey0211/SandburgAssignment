import { ForbiddenException } from '@nestjs/common';

export class NoPermissionException extends ForbiddenException {
  constructor() {
    super(`No Permission`);
  }
}
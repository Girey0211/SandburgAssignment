import { BadRequestException } from '@nestjs/common';

export class CategoryNoyFoundException extends BadRequestException {
  constructor() {
    super(`Category Noy Found`);
  }
}
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoryNoyFoundException } from './exception/categoryNoyFound.exception';

@Injectable()
export class CategoryPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const uppercasedValue = value.toUpperCase();

    if (!(uppercasedValue in Category))
      throw new CategoryNoyFoundException()

    return uppercasedValue;
  }
}
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseStatusPipe
  implements PipeTransform<string, boolean | string>
{
  transform(value: string, metadata: ArgumentMetadata): boolean | string {
    if (value === undefined) {
      // Valor por defecto cuando no se proporciona un valor
      throw new BadRequestException('Invalid boolean string'); // Puedes cambiar el valor por defecto según tus necesidades
    }
    return value;
  }
}

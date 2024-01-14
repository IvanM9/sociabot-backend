import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseStatusPipe implements PipeTransform<string, boolean> {
  transform(value: string, metadata: ArgumentMetadata): boolean {
    if (value === undefined) {
      // Valor por defecto cuando no se proporciona un valor
      return undefined; // Puedes cambiar el valor por defecto según tus necesidades
    }
    // El pipe intentará analizar el valor como booleano
    const parsedValue = value.toLowerCase() === 'true';
    if (parsedValue === undefined) {
      throw new BadRequestException('Invalid boolean string');
    }
    return parsedValue;
  }
}

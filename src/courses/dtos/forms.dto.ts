import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateFormsDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsArray()
  questionsAndAnswers: Object[];

  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  endDate: Date;
}

export class ComparateAnswersFormDTO {
  @ApiProperty()
  @IsString()
  formId: string;

  @ApiProperty()
  @IsArray()
  // eslint-disable-next-line @typescript-eslint/ban-types
  formContent: any[];
}

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
  formContent: Object[];

  @ApiProperty()
  @IsString()
  courseStudentId: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateFormsDTO {
  @ApiProperty()
  @IsString()
  moduleId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsObject()
  questionsAndAnswers: any[];

  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  endDate: Date;
}

export class UpdateFormsDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsObject()
  questionsAndAnswers: any[];

  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  endDate: Date;
}

export class CalificateFormDTO {
  @ApiProperty()
  @IsString()
  formId: string;

  @ApiProperty()
  @IsString()
  courseStudentId: string;

  @ApiProperty()
  @IsNumber()
  score: number;

  @ApiProperty()
  @IsString()
  observations: string;
}

export class ComparateAnswersFormDTO {
  @ApiProperty()
  @IsString()
  formId: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsObject()
  answers: any;

  @ApiProperty()
  @IsString()
  courseStudentId: string;

  @ApiProperty()
  @IsNumber()
  score: number;
}

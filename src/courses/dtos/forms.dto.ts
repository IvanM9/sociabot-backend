import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';


export class QuestionAndAnswer {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsNumber()
  correctAnswer: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  answers: string[];
}

export class CreateFormsDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [QuestionAndAnswer] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAndAnswer)
  questionsAndAnswers: QuestionAndAnswer[];

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

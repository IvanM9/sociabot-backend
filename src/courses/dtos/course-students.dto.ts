import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCourseStudentsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  studentId: string;

  @ApiProperty()
  @IsString()
  courseCode: string;
}

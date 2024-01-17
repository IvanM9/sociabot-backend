import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateModulesDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  goals: string;

  @ApiProperty()
  @IsBoolean()
  isPublic: boolean;
}

export class UpdateModulesDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  goals: string;

  @ApiProperty()
  @IsBoolean()
  isPublic: boolean;
}

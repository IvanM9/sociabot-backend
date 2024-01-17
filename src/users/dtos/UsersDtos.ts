import { ApiProperty, OmitType } from '@nestjs/swagger';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { GenderEnum } from '../enums/genders.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número',
    },
  )
  password: string;

  @ApiProperty({ enum: RoleEnum })
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty({ type: Date })
  @IsDateString({ strict: true })
  birth_date: string;

  @ApiProperty({ enum: GenderEnum })
  @IsEnum(GenderEnum)
  gender: string;
}

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'email',
  'role',
  'password',
]) {}

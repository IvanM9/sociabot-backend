import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { IsDateString, IsEmail, IsEnum, IsString, IsStrongPassword, Length } from 'class-validator';
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
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ type: Date })
  @IsDateString({ strict: true })
  birthDate: string;

  @ApiProperty({ enum: GenderEnum })
  @IsEnum(GenderEnum)
  gender: string;
}
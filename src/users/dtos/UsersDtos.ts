import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { IsDateString, IsEmail, IsEnum, IsString, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 20)
  // @IsStrongPassword({ minLength: 5, minLowercase: 1, minUppercase: 1, minNumbers: 1 },
  //   { message: 'La contraseña debe tener al menos 6 caracteres, 1 mayúscula, 1 minúscula y 1 número' })
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
  @IsDateString()
  birthDate: Date;

}
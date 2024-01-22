import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ChatUser } from '../enums/chat-user.enum';

export class CreateChatsDto {
  studentId?: string;

  @ApiProperty()
  @IsString()
  moduleId: string;
}

export class CreateInteractionsDto {
  @ApiProperty()
  @IsString()
  chatId: string;

  user?: ChatUser;
  date?: Date;

  @ApiProperty()
  @IsString()
  message: string;
}

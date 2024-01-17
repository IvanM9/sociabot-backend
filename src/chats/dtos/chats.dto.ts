import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
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

  @ApiProperty({ enum: ChatUser })
  @IsEnum(ChatUser)
  user: ChatUser;

  @ApiProperty()
  @IsString()
  message: string;
}

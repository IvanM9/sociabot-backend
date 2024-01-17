import { CreateChatsDto } from '@/chats/dtos/chats.dto';
import { ChatsService } from '@/chats/services/chats/chats.service';
import { CurrentUser } from '@/security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@/security/jwt-strategy/info-user.interface';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('chats')
@ApiTags('chats')
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class ChatsController {
  constructor(private service: ChatsService) {}

  @Post('create-chat')
  @Role(RoleEnum.STUDENT)
  async createChat(
    @Body() data: CreateChatsDto,
    @CurrentUser() { id }: InfoUserInterface,
  ) {
    data.studentId = id;
    return {
      data: {
        chatId: await this.service.joinChat(data),
      },
    };
  }

  @Get('get-chats/:moduleId')
  @Role(RoleEnum.STUDENT)
  async getChats(
    @CurrentUser() { id }: InfoUserInterface,
    @Param('moduleId') moduleId: string,
  ) {
    return {
      data: await this.service.getChats(id, moduleId),
    };
  }

  @Get('get-chat/:id')
  @Role(RoleEnum.STUDENT)
  async getChat(@Param('id') id: string) {
    return {
      data: await this.service.getChat(id),
    };
  }
}

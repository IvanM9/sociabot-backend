import { CreateChatsDto, CreateInteractionsDto } from '@/chats/dtos/chats.dto';
import { ChatUser } from '@/chats/enums/chat-user.enum';
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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('chats')
@ApiTags('chats')
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class ChatsController {
  constructor(private service: ChatsService) {}

  @Post('create-chat')
  @Role(RoleEnum.STUDENT)
  @ApiOperation({
    summary: 'Crear un nuevo chat',
  })
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
  @ApiOperation({
    summary: 'Obtener los chats del usuario logueado en un módulo',
  })
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
  @ApiOperation({
    summary: 'Obtener un chat y sus mensajes por su id',
  })
  @Role(RoleEnum.STUDENT)
  async getChat(@Param('id') id: string) {
    return {
      data: await this.service.getChat(id),
    };
  }

  @Post('new-message')
  @ApiOperation({
    summary: 'Crear un nuevo mensaje en un chat',
    description:
      'Crear un nuevo mensaje en un chat, el dato devuelto es el mensaje respuesta de la IA',
  })
  @Role(RoleEnum.STUDENT)
  async createInteraction(@Body() data: CreateInteractionsDto) {
    data.user = ChatUser.STUDENT;
    return {
      data: await this.service.newMessage(data),
    };
  }

  @Get('get-observations/:chatId')
  @ApiOperation({
    summary: 'Obtener las observaciones de un chat',
  })
  @Role(RoleEnum.STUDENT)
  async getObservations(@Param('chatId') chatId: string, @CurrentUser() { id }: InfoUserInterface) {
    return {
      data: await this.service.getObservations(chatId, id),
    };
  }
}

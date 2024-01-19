import { BotService } from '@/bot/bot.service';
import { CreateChatsDto, CreateInteractionsDto } from '@/chats/dtos/chats.dto';
import { ChatUser } from '@/chats/enums/chat-user.enum';
import { PrismaService } from '@/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ChatsService {
  constructor(
    private db: PrismaService,
    private botService: BotService,
  ) {}

  async getChats(studentId: string, moduleId: string) {
    return await this.db.chat.findMany({
      where: {
        courseStudent: {
          student: {
            id: studentId,
          },
        },
        moduleId,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getChat(id: string) {
    return await this.db.chat.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        interactions: {
          select: {
            id: true,
            user: true,
            message: true,
            date: true,
          },
          orderBy: {
            date: 'asc',
          },
        },
      },
    });
  }

  async joinChat(data: CreateChatsDto) {
    const { courseId } = await this.db.module
      .findUnique({
        where: { id: data.moduleId },
      })
      .catch(() => {
        throw new NotFoundException(`Error al obtener el módulo`);
      });

    const courseStudent = await this.db.courseStudent
      .findFirst({
        where: {
          studentId: data.studentId,
          courseId,
        },
      })
      .catch(() => {
        throw new NotFoundException(`Error al obtener el estudiante`);
      });

    return (
      await this.db.chat.create({
        data: {
          courseStudentId: courseStudent.id,
          moduleId: data.moduleId,
        },
      })
    ).id;
  }

  async newMessage(data: CreateInteractionsDto) {
    await this.db.chat
      .findUniqueOrThrow({
        where: { id: data.chatId },
      })
      .catch(() => {
        throw new NotFoundException(`Error al obtener el chat`);
      });

    const messages = await this.db.interaction.findMany({
      where: {
        chatId: data.chatId,
      },
      select: {
        message: true,
        user: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const historial = messages.map((message) => ({
      content: message.message,
      role: message.user,
    }));
    historial.push({ content: data.message, role: ChatUser.STUDENT });

    const request = await this.botService.newRequest(historial);
    const nowDate = new Date();

    await this.db.interaction
      .createMany({
        data: [
          {
            chatId: data.chatId,
            user: data.user,
            message: data.message,
            date: nowDate,
          },
          {
            chatId: data.chatId,
            user: ChatUser.BOT,
            message: request.choices[0].message.content,
            date: nowDate,
          },
        ],
      })
      .catch(() => {
        throw new BadRequestException(`Error al guardar los mensajes`);
      });

    await this.db.chat
      .update({
        where: {
          id: data.chatId,
        },
        data: {
          updatedAt: nowDate,
        },
      })
      .catch(() => {
        throw new BadRequestException(`Error al actualizar el chat`);
      });

    return request.choices[0].message.content;
  }
}

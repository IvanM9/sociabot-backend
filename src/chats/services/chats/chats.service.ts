import { CreateChatsDto, CreateInteractionsDto } from '@/chats/dtos/chats.dto';
import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ChatsService {
  constructor(private db: PrismaService) {}

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

    // TODO: Dependiendo de una valor random, la IA puede empezar la conversación

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
    const chat = await this.db.chat
      .findUniqueOrThrow({
        where: { id: data.chatId },
      })
      .catch(() => {
        throw new NotFoundException(`Error al obtener el chat`);
      });

    // TODO: Devolver el mensaje generado por la IA

    return await this.db.interaction.create({
      data: {
        user: data.user,
        message: data.message,
        chatId: chat.id,
        date: new Date(),
      },
    });
  }
}

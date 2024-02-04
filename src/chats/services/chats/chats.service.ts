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
  ) { }

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
        observations: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async getChat(id: string) {
    return await this.db.chat
      .findUniqueOrThrow({
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
          status: true,
        },
      })
      .catch(() => {
        throw new NotFoundException(`Error al obtener el chat`);
      });
  }

  async joinChat(data: CreateChatsDto) {
    const { courseId } = await this.db.module
      .findUniqueOrThrow({
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
    const { courseStudent } = await this.db.chat
      .findUniqueOrThrow({
        where: { id: data.chatId },
        select: {
          courseStudent: {
            select: {
              student: {
                select: {
                  firstName: true,
                }
              }
            }
          }
        }
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
        date: 'desc',
      },
      take: 4,
    });

    messages.reverse();

    const historial = this.getHistorial(messages, courseStudent.student.firstName);
    historial.push({ content: data.message, role: ChatUser.STUDENT });

    data.date = new Date();
    const request = await this.botService.newRequest(historial);
    const nowDate = new Date();

    await this.db.interaction
      .createMany({
        data: [
          {
            chatId: data.chatId,
            user: data.user,
            message: data.message,
            date: data.date,
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

    return {
      message: request.choices[0].message.content,
      user: ChatUser.BOT,
      date: nowDate,
    };
  }

  private getHistorial(messages: any[], name: string) {
    const historial = [
      {
        content:
          `Eres un estudiante de secundaria llamado Jamie, sólo debes actuar como él. Estás hablando con ${name}, un compañero nuevo en tu escuela. ${name} quiere practicar cómo hacer nuevos amigos, por lo que inicia una conversación casual con Jamie. Jamie escucha atentamente las respuestas de ${name} y haz preguntas de seguimiento para conocerlo mejor. La conversación debe sentirse natural y cómoda. Jamie practica la escucha activa y se enfoca en aprender más sobre los intereses y experiencias de ${name}. La meta es tener una agradable charla inicial que podría llevar a una nueva amistad.`,
        role: 'system',
      },
    ];
    historial.push(
      ...messages.map((message) => ({
        content: message.message,
        role: message.user,
      })),
    );

    return historial;
  }

  async getObservations(id: string, userId: string) {
    const messages = await this.db.interaction.findMany({
      where: {
        chatId: id,
      },
      select: {
        message: true,
        user: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 6,
    });

    if (messages.length === 0) {
      throw new BadRequestException(
        `No se puede dar observaciones en una conversación vacía`,
      );
    }

    await this.db.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    }).catch(() => {
      throw new NotFoundException(`Error al obtener el usuario`);
    });

    messages.reverse();
    const historial = messages.map((message) => ({
      content: message.message,
      role: message.user as string,
    }));

    historial.push({
      content:
        `Analiza la conversación y escribe tus observaciones. ¿Qué tan bien me enfoqué en ti y no en mí mismo? ¿Qué tan bien me enfoqué en tus intereses y experiencias? ¿Qué tan bien me enfoqué en tener una conversación natural y cómoda? ¿Qué tan bien me enfoqué en tener una conversación que podría llevar a una nueva amistad? ¿Qué recomendaciones me darías para mejorar su habilidad de hacer amigos?`,
      role: 'user',
    })

    const observations = await this.botService.newRequest(historial);

    await this.db.chat
      .update({
        where: {
          id,
        },
        data: {
          observations: observations.choices[0].message.content,
          status: false,
        },
      })
      .catch(() => {
        throw new BadRequestException(`Error al actualizar el chat`);
      });

    return observations.choices[0].message.content;
  }
}

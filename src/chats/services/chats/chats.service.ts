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
    const { courseStudent, module } = await this.db.chat
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
          },
          module: {
            select: {
              goals: true,
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
      take: 3,
    });

    messages.reverse();

    const historial = this.getHistorial(messages, courseStudent.student.firstName, module.goals);
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

  private getHistorial(messages: any[], name: string, goals: string) {
    const historial = [
      {
        content:
          `Eres un estudiante de secundaria llamado Jamie, sólo debes actuar como él. Estás hablando con ${name}, un compañero nuevo en tu colegio. El objetivo de esta conversa debe basarse en: '${goals}'. La conversación debe sentirse natural y cómoda.`,
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

    const {module} = await this.db.chat.findUnique({
      select: {
        module: {
          select: {
            goals: true,
          }
        }
      },
      where: {
        id,
      }
    })

    historial.push({
      content:
        `Analiza la conversación y escribe tus observaciones, basandote en lo sigiente: '${module.goals}'.¿Qué recomendaciones me darías para mejorar su habilidad de hacer amigos?`,
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

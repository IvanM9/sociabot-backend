import { AddObservationsDTO } from '@/chats/dtos/lessons.dto';
import { PrismaService } from '@/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class LessonsService {
  constructor(private db: PrismaService) {}

  async addObservations(lessonId: string, observations: AddObservationsDTO) {
    const { id } = await this.db.lesson
      .findUniqueOrThrow({
        where: { id: lessonId },
      })
      .catch(() => {
        throw new BadRequestException('Lección no encontrado');
      });

    await this.db.lesson
      .update({
        where: {
          id: lessonId,
        },
        data: {
          observations: observations.observations,
        },
      })
      .catch(() => {
        throw new BadRequestException(
          `Error al agregar las observaciones`,
        );
      });

    return { message: 'Observaciones agregadas correctamente' };
  }
}

import { UpdateCoursesDto } from './../../dtos/courses.dto';
import { CreateCoursesDto } from '@/courses/dtos/courses.dto';
import { PrismaService } from '@/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CoursesService {
  constructor(private db: PrismaService) {}

  async createCourse(dataCourse: CreateCoursesDto, userId: string) {
    await this.db.course
      .findUniqueOrThrow({
        where: { code: dataCourse.code },
      })
      .catch(() => {
        throw new BadRequestException('Código ya se encuentra en uso');
      });

    await this.db.course
      .create({
        data: {
          code: dataCourse.code,
          name: dataCourse.name,
          description: dataCourse.description,
          createdBy: userId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Error al crear el curso');
      });

    return { message: 'Creado correctamente' };
  }

  async listAllCoursesByStatus(status: boolean) {
    const courses = await this.db.course.findMany({
      where: {
        status,
      },
      select: {
        name: true,
        description: true,
        status: true,
        code: true,
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return courses;
  }

  async listMyCoursesByStatus(userId: string, status: boolean) {
    const courses = await this.db.course.findMany({
      where: {
        createdBy: userId,
        status,
      },
      select: {
        name: true,
        description: true,
        status: true,
        code: true,
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return courses;
  }

  async changeStatus(data: { courseId: string; userId }) {
    const course = await this.db.course
      .findFirstOrThrow({
        where: {
          id: data.courseId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Curso no encontrado');
      });

    await this.db.course
      .update({
        where: {
          id: course.id,
        },
        data: {
          status: !course.status,
          updatedAt: new Date(),
          updatedBy: data.userId,
        },
      })
      .catch(() => {
        throw new BadRequestException(
          `Error al ${!course.status ? 'activar' : 'desactivar'} el curso`,
        );
      });

    return { message: 'Estado del curso cambiado correctamente' };
  }

  async updateCourse(data: {
    course: UpdateCoursesDto;
    courseId: string;
    userId: string;
  }) {
    const course = await this.db.course
      .findFirstOrThrow({
        where: {
          id: data.courseId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Curso no encontrado');
      });

    await this.db.course
      .update({
        where: {
          id: course.id,
        },
        data: {
          name: data.course.name,
          description: data.course.description,
          updatedBy: data.userId,
          updatedAt: new Date(),
        },
      })
      .catch(() => {
        throw new BadRequestException(`Error al actualizar el curso`);
      });

    return { message: 'Curso actualizado correctamente' };
  }
}

import { UpdateCoursesDto } from './../../dtos/courses.dto';
import { CreateCoursesDto } from '@/courses/dtos/courses.dto';
import { PrismaService } from '@/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import generateLicenseKey from '@mcnaveen/license-gen';

@Injectable()
export class CoursesService {
  constructor(private db: PrismaService) {}

  async createCourse(dataCourse: CreateCoursesDto, userId: string) {
    await this.db.course
      .create({
        data: {
          code: generateLicenseKey(10, 5),
          name: dataCourse.name,
          description: dataCourse.description,
          created_by: userId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Error al crear el curso');
      });

    return { message: 'Creado correctamente' };
  }

  async listMyCoursesByStatus(userId: string, status: boolean) {
    const courses = await this.db.course.findMany({
      where: {
        created_by: userId,
        status: status,
      },
      select: {
        name: true,
        description: true,
        code: true,
        id: true,
        status: true,
        created_at: true,
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
          updated_at: new Date(),
          updated_by: data.userId,
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
          updated_by: data.userId,
          updated_at: new Date(),
        },
      })
      .catch(() => {
        throw new BadRequestException(`Error al actualizar el curso`);
      });

    return { message: 'Curso actualizado correctamente' };
  }
}

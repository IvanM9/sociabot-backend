import { CreateModulesDto, UpdateModulesDto } from '@/modules/dtos/modules.dto';
import { PrismaService } from '@/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ModulesService {
  constructor(private db: PrismaService) {}

  async createModule(
    dataModule: CreateModulesDto,
    userId: string,
    courseId: string,
  ) {
    const course = await this.db.course
      .findUniqueOrThrow({ where: { id: courseId } })
      .catch(() => {
        throw new NotFoundException(`No existe el curso`);
      });

    await this.db.module
      .create({
        data: {
          name: dataModule.name,
          goals: dataModule.goals,
          courses: { connect: { id: course.id } },
          is_public: dataModule.isPublic,
          updated_by: userId,
          created_by: userId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Error al crear el módulo');
      });

    return { message: 'Módulo creado correctamente' };
  }

  async getModulesByCourse(courseId: string, status: boolean) {
    const modules = await this.db.module.findMany({
      where: {
        course_id: courseId,
        status,
      },
      select: {
        id: true,
        name: true,
        goals: true,
        is_public: true,
        status: true,
        created_at: true,
        updated_at: true,
        courses: {
          select: {
            name: true,
            id: true,
            code: true,
            status: true,
          },
        },
      },
    });
    if (!modules.length) {
      throw new NotFoundException('No se encontraron módulos para este curso');
    }
    return modules;
  }

  async changeModuleStatus(data: { moduleId: string; userId }) {
    const module = await this.db.module
      .findFirstOrThrow({
        where: {
          id: data.moduleId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Módulo no encontrado');
      });

    await this.db.module
      .update({
        where: {
          id: module.id,
        },
        data: {
          status: !module.status,
          updated_at: new Date(),
          updated_by: data.userId,
        },
      })
      .catch(() => {
        throw new BadRequestException(
          `Error al ${!module.status ? 'activar' : 'desactivar'} el mpodulo`,
        );
      });

    return { message: 'Estado del módulo cambiado correctamente' };
  }

  async moveModuleToAnotherCourse(
    moduleId: string,
    newCourseId: string,
    userId: string,
  ) {
    await this.db.course
      .findFirstOrThrow({
        where: {
          id: newCourseId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Nuevo curso no encontrado');
      });

    await this.db.module
      .update({
        where: {
          id: moduleId,
        },
        data: {
          course_id: newCourseId,
          updated_at: new Date(),
          updated_by: userId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Módulo no encontrado');
      });
    return { message: 'Módulo se cambio de curso correctamente' };
  }

  async updateModule(data: {
    module: UpdateModulesDto;
    moduleId: string;
    userId: string;
  }) {
    const module = await this.db.module
      .findFirstOrThrow({
        where: {
          id: data.moduleId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Módulo no encontrado');
      });

    await this.db.module
      .update({
        where: {
          id: module.id,
        },
        data: {
          name: data.module.name,
          goals: data.module.goals,
          is_public: data.module.isPublic,
          updated_by: data.userId,
          updated_at: new Date(),
        },
      })
      .catch(() => {
        throw new BadRequestException(`Error al actualizar el módulo`);
      });

    return { message: 'Módulo actualizado correctamente' };
  }

  async listUserModules(userId: string, status: boolean) {
    const modules = await this.db.module.findMany({
      where: {
        created_by: userId,
        status,
      },
      select: {
        name: true,
        id: true,
        goals: true,
        courses: {
          select: {
            name: true,
            id: true,
            code: true,
            status: true,
          },
        },
        is_public: true,
        status: true,
        created_at: true,
      },
    });
    return modules;
  }
}

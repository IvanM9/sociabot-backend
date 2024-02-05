import {
  CalificateFormDTO,
  ComparateAnswersFormDTO,
  CreateFormsDTO,
} from '@/courses/dtos/forms.dto';
import { PrismaService } from '@/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FormsService {
  constructor(private db: PrismaService) {}

  async createForm(dataForm: CreateFormsDTO, userId: string) {
    await this.db.forms
      .create({
        data: {
          name: dataForm.name,
          questionsAndAnswers: dataForm.questionsAndAnswers,
          moduleId: dataForm.moduleId,
          startDate: dataForm.startDate,
          endDate: dataForm.endDate,
          createdBy: userId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Error al crear el formulario');
      });

    return { message: 'Creado correctamente' };
  }

  async listMyFormsByModule(moduleId: string, status: boolean) {
    const forms = await this.db.forms.findMany({
      where: {
        moduleId: moduleId,
        status,
      },
      select: {
        name: true,
        questionsAndAnswers: true,
        id: true,
        startDate: true,
        endDate: true,
        createdBy: true,
        createdAt: true,
      },
    });
    return forms;
  }

  async changeStatus(data: { formId: string; userId: string }) {
    const form = await this.db.forms
      .findFirstOrThrow({
        where: {
          id: data.formId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Formulario no encontrado');
      });

    await this.db.forms
      .update({
        where: {
          id: form.id,
        },
        data: {
          status: !form.status,
        },
      })
      .catch(() => {
        throw new BadRequestException('Error al cambiar el estado');
      });

    return { message: 'Estado cambiado correctamente' };
  }

  async calificateForm(data: CalificateFormDTO) {
    const form = await this.db.forms
      .findFirstOrThrow({
        where: {
          id: data.formId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Formulario no encontrado');
      });

    await this.db.lesson
      .create({
        data: {
          formId: form.id,
          courseStudentId: data.courseStudentId,
          score: data.score,
          observations: data.observations,
          date: new Date(),
        },
      })
      .catch(() => {
        throw new BadRequestException('Error al calificar el formulario');
      });

    return { message: 'Formulario calificado correctamente' };
  }

  async compareAnswers(data: ComparateAnswersFormDTO) {
    const form = await this.db.forms
      .findFirstOrThrow({
        where: {
          id: data.formId,
        },
      })
      .catch(() => {
        throw new BadRequestException('Formulario no encontrado');
      });

    const correctAnswers: any[] = form.questionsAndAnswers;

    let score = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
      if (correctAnswers[i].answer === data.answers[i].answer) {
        score += 1;
      }
    }

    await this.db.lesson
      .create({
        data: {
          formId: form.id,
          courseStudentId: data.courseStudentId,
          score: score,
          date: new Date(),
        },
      })
      .catch(() => {
        throw new BadRequestException('Error al responder el formulario');
      });

    return { message: 'Formulario respondido correctamente' };
  }
}

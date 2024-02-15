import {
    ComparateAnswersFormDTO,
    CreateFormsDTO
} from '@/courses/dtos/forms.dto';
import { PrismaService } from '@/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FormsService {
  constructor(private db: PrismaService) {}

  async createForm(dataForm: CreateFormsDTO, moduleId: string, userId: string) {
    console.log(dataForm);
    await this.db.forms
      .create({
        data: {
          name: dataForm.name,
          questionsAndAnswers: dataForm.questionsAndAnswers as any,
          moduleId: moduleId,
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

  async listMyFormsByModule(moduleId: string, status: boolean, userId: string) {
    const forms = await this.db.forms.findMany({
      where: {
        moduleId: moduleId,
        createdBy: userId,
        status,
      },
      select: {
        name: true,
        questionsAndAnswers: true,
        id: true,
        startDate: true,
        module: {
          select: {
            id: true,
            name: true,
          },
        },
        status: true,
        endDate: true,
        createdBy: true,
        createdAt: true,
      },
    });
    return forms;
  }

  async listMyForms(status: boolean, userId?: string) {
    const forms = await this.db.forms.findMany({
      where: {
        createdBy: userId,
        status,
      },
      select: {
        name: true,
        questionsAndAnswers: true,
        id: true,
        startDate: true,
        module: {
          select: {
            id: true,
            name: true,
          },
        },
        status: true,
        endDate: true,
        createdBy: true,
        createdAt: true,
      },
    });
    return forms;
  }

  //update form
  async updateForm(data: {
    form: CreateFormsDTO;
    formId: string;
    userId: string;
  }) {
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
          name: data.form.name,
          questionsAndAnswers: data.form.questionsAndAnswers as any,
          startDate: data.form.startDate,
          endDate: data.form.endDate,
          updatedBy: data.userId,
          updatedAt: new Date(),
        },
      })
      .catch(() => {
        throw new BadRequestException('Error al actualizar el formulario');
      });

    return { message: 'Formulario actualizado correctamente' };
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

  async getFormById(formId: string) {
    const form = await this.db.forms
      .findFirstOrThrow({
        where: {
          id: formId,
          status: true,
        },
        select: {
          name: true,
          questionsAndAnswers: true,
          startDate: true,
          endDate: true,
          createdBy: true,
          createdAt: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Formulario no encontrado');
      });

    return form;
  }
}

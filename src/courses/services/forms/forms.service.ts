import {
  ComparateAnswersFormDTO,
  CreateFormsDTO,
} from '@/courses/dtos/forms.dto';
import { PrismaService } from '@/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

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


  async listMyForms(status: boolean,moduleId:string, userId: string) {
    const forms = await this.db.forms.findMany({
      where: {
        createdBy: userId,
        status,
        moduleId:moduleId
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

  async viewAnswersByForm(formId: string) {
    const answer = await this.db.lesson.findMany({
      select: {
        courseStudentId: true,
        courseStudent: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                id: true,
              },
            },
            course: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        score: true,
        date: true,
      },
      where: {
        formId: formId,
      },
    });
  }
}

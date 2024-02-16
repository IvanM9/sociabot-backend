import {
  ComparateAnswersFormDTO,
  CreateFormsDTO,
} from '@/courses/dtos/forms.dto';
import { PrismaService } from '@/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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

  async listMyForms(status: boolean, moduleId: string, userId: string) {
    const forms = await this.db.forms.findMany({
      where: {
        createdBy: userId,
        status,
        moduleId: moduleId,
        endDate: {
          gte: new Date(),
        },
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

  async compareAnswers(data: ComparateAnswersFormDTO, userId: string) {
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

    const score =
      (correctAnswers.filter((answer, index) => {
        return (
          answer.correctAnswer ===
          (data.formContent[index] as any).positionAnswer
        );
      }).length *
        10) /
      correctAnswers.length;

    const courseStudent = await this.db.courseStudent.findFirst({
      where: {
        student: {
          id: userId,
        },
        course: {
          modules: {
            some: {
              id: form.moduleId,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    const questionsAndAnswers = data.formContent.map((qa) => {
      return {
        question: qa.question,
        selectedAnswer: qa.positionAnswer,
        answer: qa.answer,
      };
    });

    await this.db.lesson
      .create({
        data: {
          formId: form.id,
          courseStudentId: courseStudent.id,
          score: score,
          date: new Date(),
          questionsAndAnswers,
        },
      })
      .catch(() => {
        throw new BadRequestException('Error al responder el formulario');
      });

    return {
      data: {
        score,
      },
      message: 'Formulario respondido correctamente',
    };
  }

  async viewAnswersByForm(formId: string) {
    await this.db.lesson.findMany({
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

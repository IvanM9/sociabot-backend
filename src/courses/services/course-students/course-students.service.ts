import { CreateCourseStudentsDto } from '@/courses/dtos/course-students.dto';
import { PrismaService } from '@/prisma.service';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CourseStudentsService {
    constructor(private db: PrismaService) { }

    async joinCourse(data: CreateCourseStudentsDto) {
        const { id } = await this.db.course.findUniqueOrThrow({
            where: { code: data.courseCode },
        }).catch(() => { throw new BadRequestException('Courso encontrado'); });

        await this.db.user.findUniqueOrThrow({
            where: { email: data.studentId, role: RoleEnum.STUDENT },
        }).catch(() => { throw new BadRequestException('Estudiante no encontrado'); });

        const courseStudent = await this.db.courseStudent.findFirst({
            where: {
                studentId: data.studentId,
                courseId: id,
            },
        });

        if (courseStudent) {
            throw new BadRequestException('Ya se encuentra inscrito en el curso');
        }

        await this.db.courseStudent.create({
            data: {
                student: { connect: { id: data.studentId } },
                course: { connect: { id } },
            },

        }).catch(() => { throw new BadRequestException('Error al inscribirse al curso'); });

        return { message: 'Inscrito correctamente' };
    }


    async changeStatus(data: { studentId: string, courseId: string }) {
        const { id } = await this.db.course.findUniqueOrThrow({
            where: { id: data.courseId },
        }).catch(() => { throw new BadRequestException('Curso no encontrado'); });

        const courseStudent = await this.db.courseStudent.findFirst({
            where: {
                studentId: data.studentId,
                courseId: id,
            },
        });

        if (!courseStudent) {
            throw new BadRequestException('No se encuentra inscrito en el curso');
        }

        await this.db.courseStudent.update({
            where: {
                id: courseStudent.id,
            },
            data: {
                status: !courseStudent.status,
            },
        }).catch(() => { throw new BadRequestException(`Error al ${!courseStudent.status ? 'activar' : 'desactivar'} el estudiante de este curso`); });

        return { message: 'Estado del curso cambiado correctamente' };
    }

    async listStudentsByCourse(courseId: string, status: boolean) {
        const { id } = await this.db.course.findUniqueOrThrow({
            where: { id: courseId },
        }).catch(() => { throw new BadRequestException('Curso no encontrado'); });

        const courseStudents = await this.db.courseStudent.findMany({
            where: {
                courseId: id,
                status,
            },
            select: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        gender: true,
                        birthDate: true,
                    },
                },
                id: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return courseStudents;
    }

    async listCoursesByStudent(studentId: string, status: boolean) {
        const { id } = await this.db.user.findUniqueOrThrow({
            where: { id: studentId, role: RoleEnum.STUDENT },
        }).catch(() => { throw new BadRequestException('Estudiante no encontrado'); });

        const courseStudents = await this.db.courseStudent.findMany({
            where: {
                studentId: id,
                status,
                course: {
                    status: true,
                }
            },
            select: {
                course: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        teacher: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        }
                    },
                },
                id: true,
            },
        });

        return courseStudents;
    }
}

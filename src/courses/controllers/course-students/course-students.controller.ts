import { CreateCourseStudentsDto } from '@/courses/dtos/course-students.dto';
import { CourseStudentsService } from '@/courses/services/course-students/course-students.service';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Body, Controller, Get, Param, ParseBoolPipe, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('course-students')
@ApiTags('course-students')
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
export class CourseStudentsController {
    constructor(private service: CourseStudentsService) { }

    @Post()
    @ApiOperation({ summary: 'Inscribir un estudiante a un curso' })
    async joinCourse(@Body() body: CreateCourseStudentsDto) {
        return await this.service.joinCourse(body);
    }

    @Patch('status/:studentId/:courseId')
    @ApiOperation({ summary: 'Activar o desactivar un estudiante de un curso' })
    async changeStatus(@Param('studentId') studentId: string, @Param('courseId') courseId: string) {
        return await this.service.changeStatus({ studentId, courseId });
    }

    @Get(':courseId/students')
    @ApiQuery({ name: 'status', required: false })
    @ApiOperation({ summary: 'Obtener los estudiantes de un curso' })
    async getStudentsByCourse(@Param('courseId') id: string, @Query('status') status: boolean) {
        status = String(status) == "false" || undefined ? false : true;
        const data =  await this.service.listStudentsByCourse(id, status);

        return { data, message: 'Estudiantes encontrados' };
    }

    @Get(':studentId/courses')
    @ApiQuery({ name: 'status', required: false })
    @ApiOperation({ summary: 'Obtener los cursos de un estudiante' })
    async getCoursesByStudents(@Param('studentId') id: string, @Query('status') status: boolean) {
        status = String(status) == "false" || undefined ? false : true;
        const data =  await this.service.listCoursesByStudent(id, status);

        return { data, message: 'Cursos encontrados' };
    }

}

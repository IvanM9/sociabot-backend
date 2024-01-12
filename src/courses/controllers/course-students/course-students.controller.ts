import { CreateCourseStudentsDto } from '@/courses/dtos/course-students.dto';
import { CourseStudentsService } from '@/courses/services/course-students/course-students.service';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('course-students')
@ApiTags('course-students')
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

}

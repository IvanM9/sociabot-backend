import { CreateCourseStudentsDto } from '@/courses/dtos/course-students.dto';
import { CourseStudentsService } from '@/courses/services/course-students/course-students.service';
import { CurrentUser } from '@/security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@/security/jwt-strategy/info-user.interface';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { ParseStatusPipe } from '@/shared/pipes/parse-status.pipe';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@Controller('course-students')
@ApiTags('course-students')
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class CourseStudentsController {
  constructor(private service: CourseStudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Inscribir un estudiante a un curso' })
  async joinCourse(@Body() body: CreateCourseStudentsDto) {
    return await this.service.joinCourse(body);
  }

  @Patch('status/:studentId/:courseId')
  @ApiOperation({ summary: 'Activar o desactivar un estudiante de un curso' })
  async changeStatus(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ) {
    return await this.service.changeStatus({ studentId, courseId });
  }

  @Get(':courseId/students')
  @Role(RoleEnum.TEACHER)
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Obtener los estudiantes de un curso' })
  async getStudentsByCourse(
    @Param('courseId') id: string,
    @Query('status', ParseStatusPipe) status: boolean,
  ) {
    const data = await this.service.listStudentsByCourse(id, status);
    return { data, message: 'Estudiantes encontrados' };
  }

  @Get('my-courses')
  @Role(RoleEnum.STUDENT)
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Obtener los cursos de un estudiante' })
  async getCoursesByStudent(
    @CurrentUser() { id }: InfoUserInterface,
    @Query('status', ParseStatusPipe) status: boolean,
  ) {
    const data = await this.service.listCoursesByStudent(id, status);
    return { data, message: 'Cursos encontrados' };
  }
}

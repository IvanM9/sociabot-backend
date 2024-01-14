import { CreateCoursesDto, UpdateCoursesDto } from '@/courses/dtos/courses.dto';
import { CoursesService } from '@/courses/services/courses/courses.service';
import { CurrentUser } from '@/security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@/security/jwt-strategy/info-user.interface';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { ParseStatusPipe } from '@/users/pipes/parse-status.pipe';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
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

@Controller('courses')
@ApiTags('courses')
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class CoursesController {
  constructor(private service: CoursesService) {}

  @Post()
  @Role(RoleEnum.TEACHER)
  @ApiOperation({ summary: 'Crear un curso' })
  async joinCourse(
    @Body() body: CreateCoursesDto,
    @CurrentUser() { id }: InfoUserInterface,
  ) {
    return await this.service.createCourse(body, id);
  }

  @Patch('status/:courseId')
  @Role(RoleEnum.TEACHER)
  @ApiOperation({ summary: 'Activar o desactivar un curso' })
  async changeStatus(
    @CurrentUser() { id }: InfoUserInterface,
    @Param('courseId') courseId: string,
  ) {
    return await this.service.changeStatus({ courseId, userId: id });
  }

  @Get('my-courses')
  @Role(RoleEnum.TEACHER)
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Obtener los cursos de un profesor' })
  async getCoursesByStudent(
    @CurrentUser() { id }: InfoUserInterface,
    @Query('status', ParseStatusPipe) status: boolean,
  ) {
    const data = await this.service.listMyCoursesByStatus(id, status);
    return { data, message: 'Cursos encontrados' };
  }

  @Get()
  @Role(RoleEnum.STUDENT)
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Obtener todos los cursos' })
  async getAllCourses(@Query('status', ParseStatusPipe) status: boolean) {
    const data = await this.service.listAllCoursesByStatus(status);
    return { data, message: 'Cursos encontrados' };
  }

  @Put()
  @Role(RoleEnum.TEACHER)
  @ApiOperation({ summary: 'Actualizar informacion de un curso' })
  async updateCourse(
    @CurrentUser() { id }: InfoUserInterface,
    @Body() body: UpdateCoursesDto,
    @Param('courseId') courseId: string,
  ) {
    return await this.service.updateCourse({
      course: body,
      courseId,
      userId: id,
    });
  }
}

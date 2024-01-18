import { CreateCoursesDto } from '@/courses/dtos/courses.dto';
import { CreateModulesDto, UpdateModulesDto } from '@/courses/dtos/modules.dto';
import { ModulesService } from '@/courses/services/modules/modules.service';
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

@Controller('modules')
@ApiTags('modules')
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class ModulesController {
  constructor(private service: ModulesService) {}

  @Post()
  @Role(RoleEnum.TEACHER)
  @ApiQuery({ name: 'courseId', required: true })
  @ApiOperation({ summary: 'Crear un curso' })
  async createModule(
    @Body() body: CreateModulesDto,
    @CurrentUser() { id }: InfoUserInterface,
    @Query('courseId') courseId: string,
  ) {
    return await this.service.createModule(body, id, courseId);
  }

  @Patch(':moduleId/move')
  @Role(RoleEnum.TEACHER)
  @ApiQuery({ name: 'newCourseId', required: true })
  @ApiOperation({ summary: 'Mover un módulo a otro curso' })
  async moveModuleToAnotherCourse(
    @Param('moduleId') moduleId: string,
    @Query('newCourseId') newCourseId: string,
    @CurrentUser() { id }: InfoUserInterface,
  ) {
    return await this.service.moveModuleToAnotherCourse(
      moduleId,
      newCourseId,
      id,
    );
  }

  @Put(':moduleId')
  @Role(RoleEnum.TEACHER)
  @ApiOperation({ summary: 'Actualizar un módulo' })
  async updateModule(
    @Param('moduleId') moduleId: string,
    @Body() updateModulesDto: UpdateModulesDto,
    @CurrentUser() { id }: InfoUserInterface,
  ) {
    return await this.service.updateModule({
      module: updateModulesDto,
      moduleId: moduleId,
      userId: id,
    });
  }

  @Patch(':moduleId/status')
  @Role(RoleEnum.TEACHER)
  @ApiOperation({ summary: 'Cambiar el estado de un módulo' })
  async changeModuleStatus(
    @Param('moduleId') moduleId: string,
    @CurrentUser() { id }: InfoUserInterface,
  ) {
    return await this.service.changeModuleStatus({
      moduleId: moduleId,
      userId: id,
    });
  }

  @Get(':courseId')
  @Role(RoleEnum.TEACHER)
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Obtener módulos por curso' })
  async getModulesByCourse(
    @Param('courseId') courseId: string,
    @Query('status', ParseStatusPipe) status: boolean,
  ) {
    const data = await this.service.getModulesByCourse(courseId, status);
    return { data, message: 'Módulos encontrados' };
  }

  @Get()
  @Role(RoleEnum.TEACHER)
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Obtener módulos por usuario ' })
  async getModulesByUser(
    @CurrentUser() { id }: InfoUserInterface,
    @Query('status', ParseStatusPipe) status: boolean,
  ) {
    const data = await this.service.listUserModules(id, status);
    return { data, message: 'Módulos encontrados' };
  }
}

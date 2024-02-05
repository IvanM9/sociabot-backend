import { CalificateFormDTO, ComparateAnswersFormDTO, CreateFormsDTO } from '@/courses/dtos/forms.dto';
import { FormsService } from '@/courses/services/forms/forms.service';
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

@Controller('forms')
@ApiTags('forms')
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class FormsController {
  constructor(private formService: FormsService) {}

  @Post()
  @Role(RoleEnum.TEACHER)
  @ApiOperation({ summary: 'Crear un formulario' })
  async createForm(
    @Body() body: CreateFormsDTO,
    @CurrentUser() { id }: InfoUserInterface,
  ) {
    return await this.formService.createForm(body, id);
  }

  @Patch('status/:formId')
  @Role(RoleEnum.TEACHER)
  @ApiOperation({ summary: 'Activar o desactivar un formulario' })
  async changeStatus(
    @CurrentUser() { id }: InfoUserInterface,
    @Param('formId') formId: string,
  ) {
    return await this.formService.changeStatus({ formId, userId: id });
  }

  @Get(':moduleId/forms')
  @Role(RoleEnum.TEACHER)
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Obtener los formularios de un determinado modulo' })
  async getCoursesByStudent(
    @Param('moduleId') moduleId: string,
    @Query('status', ParseStatusPipe) status: boolean,
  ) {
    const data = await this.formService.listMyFormsByModule(moduleId, status);
    return { data, message: 'Formularios encontrados' };
  }

  @Post('calificate')
  @Role(RoleEnum.TEACHER)
  @ApiOperation({ summary: 'Calificar un formulario' })
  async calificateForm(
    @Body() body: CalificateFormDTO,
    @CurrentUser() { id }: InfoUserInterface,
  ) {
    return await this.formService.calificateForm(body);
  }

  @Post('compare-answer')
  @Role(RoleEnum.STUDENT)
  @ApiOperation({ summary: 'Comparar respuestas' })
  async compareAnswer(
    @Body() body: ComparateAnswersFormDTO,
    @CurrentUser() { id }: InfoUserInterface,
  ) {
    return await this.formService.compareAnswers(body);
  }
}

import {
  ComparateAnswersFormDTO,
  CreateFormsDTO,
} from '@/courses/dtos/forms.dto';
import { FormsService } from '@/courses/services/forms/forms.service';
import { CurrentUser } from '@/security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@/security/jwt-strategy/info-user.interface';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { OptionalBooleanPipe } from '@/shared/pipes/parse-bool-optional.pipe';
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
    @Query('moduleId') moduleId: string,
  ) {
    return await this.formService.createForm(body, moduleId, id);
  }

  @Patch(':formId/status')
  @Role(RoleEnum.TEACHER)
  @ApiOperation({ summary: 'Activar o desactivar un formulario' })
  async changeStatus(
    @CurrentUser() { id }: InfoUserInterface,
    @Param('formId') formId: string,
  ) {
    return await this.formService.changeStatus({ formId, userId: id });
  }

  @Get()
  @Role(RoleEnum.TEACHER, RoleEnum.STUDENT)
  @ApiQuery({ name: 'status', required: false })
  @ApiOperation({ summary: 'Obtener todos los formularios' })
  async getFormsAll(
    @Query('moduleId') moduleId: string,
    @Query('status', OptionalBooleanPipe) status: boolean,
    @CurrentUser() { id, role }: InfoUserInterface,
  ) {
    const data = await this.formService.listMyForms(
      status,
      moduleId,
      role == RoleEnum.TEACHER ? id : undefined,
    );

    return { data, message: 'Formularios encontrados' };
  }

  @Post('compare-answer')
  @Role(RoleEnum.STUDENT)
  @ApiOperation({ summary: 'Comparar respuestas' })
  async compareAnswer(
    @Body() body: ComparateAnswersFormDTO,
    @CurrentUser() { id }: InfoUserInterface,
  ) {
    return await this.formService.compareAnswers(body, id);
  }

  @Put(':formId')
  @Role(RoleEnum.TEACHER)
  @ApiOperation({ summary: 'Actualizar un formulario' })
  async updateForm(
    @Param('formId') formId: string,
    @Body() formUpdateData: CreateFormsDTO,
    @CurrentUser() { id }: InfoUserInterface,
  ) {
    return await this.formService.updateForm({
      form: formUpdateData,
      formId: formId,
      userId: id,
    });
  }

  @Get('getById/:formId')
  @Role(RoleEnum.STUDENT, RoleEnum.TEACHER)
  @ApiOperation({ summary: 'Obtener un formulario por id' })
  async getFormById(@Param('formId') formId: string) {
    return { data: await this.formService.getFormById(formId) };
  }
}

import { AddObservationsDTO } from '@/chats/dtos/lessons.dto';
import { LessonsService } from '@/chats/services/lessons/lessons.service';
import { CurrentUser } from '@/security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@/security/jwt-strategy/info-user.interface';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Body, Controller, Param, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('lessons')
@ApiTags('lessons')
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class LessonsController {

    constructor(private service: LessonsService) {}

    @Put('add-observation/:lessonId')
    @Role(RoleEnum.TEACHER)
    @ApiOperation({
      summary: 'Crear un nuevo chat',
    })
    async createChat(
      @Body() data: AddObservationsDTO,
      @Param('lessonId') lessonId: string,
      @CurrentUser() { id }: InfoUserInterface,
    ) {
      return {
        data: {
          chatId: await this.service.addObservations(lessonId, data),
        },
      };
    }

}

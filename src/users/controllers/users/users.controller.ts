import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from '@/users/services/users/users.service';
import { CreateUserDto } from '@/users/dtos/UsersDtos';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { CurrentUser } from '@/security/jwt-strategy/auth.decorator';
import { InfoUserInterface } from '@/security/jwt-strategy/info-user.interface';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ResponseHttpInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  @Post()
  @ApiOperation({ summary: 'Crear un usuario', description: 'Crea un usuario: el género debe ser "MALE" o "FEMALE" y el rol "TEACHER" o "STUDENT"' })
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get('profile')
  @Role(RoleEnum.STUDENT, RoleEnum.TEACHER)
  @ApiOperation({ summary: 'Obtener perfil de usuario' })
  async getProfile(@CurrentUser() { id }: InfoUserInterface) {
    return { data: await this.usersService.getProfile(id) };
  }
}

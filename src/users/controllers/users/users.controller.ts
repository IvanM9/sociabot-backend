import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from '@/users/services/users/users.service';
import { CreateUserDto } from '@/users/dtos/UsersDtos';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ResponseHttpInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  @Post()
  @ApiOperation({ summary: 'Crear un usuario', description: 'Crea un usuario: el género debe ser "MALE" o "FEMALE" y el rol "TEACHER" o "STUDENT"' })
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}

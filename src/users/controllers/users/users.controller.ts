import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '@/users/services/users/users.service';
import { CreateUserDto } from '@/users/dtos/UsersDtos';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    console.log(body);
    return this.usersService.create(body);
  }
}

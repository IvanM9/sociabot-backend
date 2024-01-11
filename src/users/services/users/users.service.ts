import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/users/dtos/UsersDtos';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {
  }

  async create(data: CreateUserDto) {
    try {
      return await this.db.user.create({ data });
    } catch (err) {
      console.log(err);
      throw new BadRequestException('No se puede crear el usuario');
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/users/dtos/UsersDtos';
import { PrismaService } from '@/prisma.service';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}

  async create(data: CreateUserDto) {
    try {
      data.password = hashSync(data.password, 10)
      return await this.db.user.create({ data });
    } catch (err) {
      console.log(err);
      throw new BadRequestException('No se puede crear el usuario');
    }
  }
}

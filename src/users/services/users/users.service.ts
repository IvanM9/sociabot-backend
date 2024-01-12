import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/users/dtos/UsersDtos';
import { PrismaService } from '@/prisma.service';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}

  async create(data: CreateUserDto) {
    try {
      const user = await this.db.user.findFirst({
        where: { email: data.email },
      });

      if (user) {
        throw new BadRequestException('El usuario ya existe');
      }
      
      data.password = hashSync(data.password, 10)
      await this.db.user.create({ data });

      return { message: 'Usuario creado correctamente' };
    } catch (err) {
      console.log(err);
      throw new BadRequestException('No se puede crear el usuario');
    }
  }
}

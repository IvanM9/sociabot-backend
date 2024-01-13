import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@/users/dtos/UsersDtos';
import { PrismaService } from '@/prisma.service';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) { }

  async create(data: CreateUserDto) {
    const user = await this.db.user.findFirst({
      where: { email: data.email },
    });

    if (user) {
      throw new BadRequestException('El usuario ya existe');
    }

    data.password = hashSync(data.password, 10)
    await this.db.user.create({ data }).catch((error) => { console.log(error); throw new BadRequestException(`Error al crear el usuario`); });

    return { message: 'Usuario creado correctamente' };
  }

  async getProfile(id: string) {
    return await this.db.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        birthDate: true,
        gender: true,
      },
    }).catch((error) => { throw new NotFoundException(`Error al obtener el usuario`) });
  }

  async updateProfile(id: string, data: UpdateUserDto) {
    const user = await this.db.user.findUniqueOrThrow({ where: { id } }).catch((error) => { throw new NotFoundException(`Error al obtener el usuario`) });

    await this.db.user.update({ where: { id }, data }).catch((error) => { throw new BadRequestException(`Error al actualizar el usuario`) });

    return { message: 'Usuario actualizado correctamente' };
  }

  async updateStatus(id: string) {
    const user = await this.db.user.findUniqueOrThrow({ where: { id } }).catch((error) => { throw new NotFoundException(`Error al obtener el usuario`) });

    await this.db.user.update({ where: { id }, data: { status: !user.status } }).catch((error) => { throw new BadRequestException(`Error al actualizar el usuario`) });

    return { message: 'Usuario actualizado correctamente' };
  }
}

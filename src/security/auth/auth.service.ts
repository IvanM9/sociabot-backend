import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '@/security/auth/dtos/LoginDto';
import { PrismaService } from '@/prisma.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private db: PrismaService,
  ) {}
  async login(payload: LoginDto) {
    const user = await this.db.user.findUnique({
      where: { email: payload.email },
    });

    if (!user.status)
      throw new UnauthorizedException('El usuario se encuentra desactivado');

    if (!(await compare(payload.password, user.password))) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return {
      token: this.jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        {
          expiresIn: '9h',
        },
      ),
      role: user.role,
    };
  }
}

import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from '@/prisma.service';
import { AppModule } from '@/app.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: 'sociabot2024',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, PrismaService],
})
export class SecurityModule {}

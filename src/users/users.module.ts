import { Module } from '@nestjs/common';
import { UsersController } from '@/users/controllers/users/users.controller';
import { UsersService } from '@/users/services/users/users.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [
  ],
})
export class UsersModule {}

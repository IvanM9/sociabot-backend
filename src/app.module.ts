import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecurityModule } from './security/security.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from '@/prisma.service';
import { BotModule } from './bot/bot.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [SecurityModule, UsersModule, BotModule, CoursesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}

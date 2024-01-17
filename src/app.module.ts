import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecurityModule } from './security/security.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from '@/prisma.service';
import { BotModule } from './bot/bot.module';
import { CoursesModule } from './courses/courses.module';
import { SharedModule } from './shared/shared.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    SecurityModule,
    UsersModule,
    BotModule,
    CoursesModule,
    SharedModule,
    CacheModule.register({ isGlobal: true }),
    ModulesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}

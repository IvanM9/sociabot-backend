import { PrismaService } from './../prisma.service';
import { Module } from '@nestjs/common';
import { ModulesController } from './controllers/modules/modules.controller';
import { ModulesService } from './services/modules/modules.service';

@Module({
  controllers: [ModulesController],
  providers: [ModulesService, PrismaService],
})
export class ModulesModule {}

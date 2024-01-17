import { Module } from '@nestjs/common';
import { ChatsController } from './controllers/chats/chats.controller';
import { LessonsController } from './controllers/lessons/lessons.controller';
import { LessonsService } from './services/lessons/lessons.service';
import { ChatsService } from './services/chats/chats.service';
import { PrismaService } from '@/prisma.service';

@Module({
  controllers: [ChatsController, LessonsController],
  providers: [LessonsService, ChatsService, PrismaService],
})
export class ChatsModule {}

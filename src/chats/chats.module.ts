import { Module } from '@nestjs/common';
import { ChatsController } from './controllers/chats/chats.controller';
import { LessonsController } from './controllers/lessons/lessons.controller';
import { LessonsService } from './services/lessons/lessons.service';
import { ChatsService } from './services/chats/chats.service';
import { PrismaService } from '@/prisma.service';
import { BotModule } from '@/bot/bot.module';

@Module({
  controllers: [ChatsController, LessonsController],
  providers: [LessonsService, ChatsService, PrismaService],
  imports: [BotModule],
})
export class ChatsModule {}

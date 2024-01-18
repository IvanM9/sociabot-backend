import { Module } from '@nestjs/common';
import { CourseStudentsController } from './controllers/course-students/course-students.controller';
import { CourseStudentsService } from './services/course-students/course-students.service';
import { PrismaService } from '@/prisma.service';
import { CoursesService } from './services/courses/courses.service';
import { CoursesController } from './controllers/courses/courses.controller';
import { ModulesController } from './controllers/modules/modules.controller';
import { ModulesService } from './services/modules/modules.service';

@Module({
  controllers: [CourseStudentsController, CoursesController, ModulesController],
  providers: [
    CourseStudentsService,
    PrismaService,
    CoursesService,
    ModulesService,
  ],
})
export class CoursesModule {}

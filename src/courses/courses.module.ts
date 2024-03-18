import { Module } from '@nestjs/common';
import { CourseStudentsController } from './controllers/course-students/course-students.controller';
import { CourseStudentsService } from './services/course-students/course-students.service';
import { PrismaService } from '@/prisma.service';
import { CoursesService } from './services/courses/courses.service';
import { CoursesController } from './controllers/courses/courses.controller';
import { ModulesController } from './controllers/modules/modules.controller';
import { ModulesService } from './services/modules/modules.service';
import { FormsController } from './controllers/forms/forms.controller';
import { FormsService } from './services/forms/forms.service';

@Module({
  controllers: [CourseStudentsController, CoursesController, ModulesController, FormsController],
  providers: [
    CourseStudentsService,
    PrismaService,
    CoursesService,
    ModulesService,
    FormsService,
  ],
})
export class CoursesModule {}

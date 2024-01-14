import { Module } from '@nestjs/common';
import { CourseStudentsController } from './controllers/course-students/course-students.controller';
import { CourseStudentsService } from './services/course-students/course-students.service';
import { PrismaService } from '@/prisma.service';
import { CoursesService } from './services/courses/courses.service';
import { CoursesController } from './controllers/courses/courses.controller';

@Module({
  controllers: [CourseStudentsController, CoursesController],
  providers: [CourseStudentsService, PrismaService, CoursesService],
})
export class CoursesModule {}

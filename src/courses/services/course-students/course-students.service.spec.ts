import { Test, TestingModule } from '@nestjs/testing';
import { CourseStudentsService } from './course-students.service';

describe('CourseStudentsService', () => {
  let service: CourseStudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseStudentsService],
    }).compile();

    service = module.get<CourseStudentsService>(CourseStudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

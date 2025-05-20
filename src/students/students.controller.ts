import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  getHello(): string {
    return 'Hello, the API is working!';
  }

  @Post()
  register(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.register(createStudentDto);
  }

  @Get('all')
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':registrationNumber')
  findOne(@Param('registrationNumber') registrationNumber: string) {
    return this.studentsService.findOne(registrationNumber);
  }

  @Patch(':registrationNumber')
  update(
    @Param('registrationNumber') registrationNumber: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(registrationNumber, updateStudentDto);
  }

  @Delete(':registrationNumber')
  remove(@Param('registrationNumber') registrationNumber: string) {
    return this.studentsService.remove(registrationNumber);
  }

  @Patch('update-password/:registrationNumber')
  async updatePassword(
    @Param('registrationNumber') registrationNumber: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.studentsService.updatePassword(registrationNumber, dto);
  }
}

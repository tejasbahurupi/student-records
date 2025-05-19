import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './entities/student.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    const newStudent = new this.studentModel({
      ...createStudentDto,
      password: hashedPassword,
    });

    return newStudent.save(); // ✅ Saves to MongoDB
  }

  findAll() {
    return `This action returns all students`;
  }

  async findOne(id: number) {
    console.log(id);
    const student = await this.studentModel.findOne({ registrationNo: id });
    return `This action returns a #${student} student`;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    await this.studentModel.updateOne({ registrationNo: id }, updateStudentDto);
    const student = await this.studentModel.findOne({ registrationNo: id });

    return `This action updates a #${student} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}

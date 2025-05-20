import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './entities/student.entity';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async register(createStudentDto: CreateStudentDto) {
    const existingStudent = await this.studentModel.findOne({
      registrationNumber: createStudentDto.registrationNumber,
    });

    if (existingStudent) {
      throw new HttpException(
        `Student with registration number ${createStudentDto.registrationNumber} already exists`,
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    const newStudent = new this.studentModel({
      ...createStudentDto,
      password: hashedPassword,
    });

    await newStudent.save();

    const { password, ...studentWithoutPassword } = newStudent.toObject();
    return studentWithoutPassword;
  }

  async findAll() {
    console.log('Fetching all students');
    const students = await this.studentModel.find().select('-password');

    if (students.length === 0) {
      throw new HttpException('No students found', HttpStatus.NOT_FOUND);
    }
    return students;
  }

  async findOne(id: string) {
    const student = await this.studentModel
      .findOne({ registrationNumber: id })
      .select('-password' + ' -_id' + ' -__v');
    if (!student) {
      throw new HttpException(
        `Student with registration number ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return `Student details:\n ${student}`;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    if ('registrationNumber' in updateStudentDto) {
      throw new HttpException(
        'registration number cannot be updated',
        HttpStatus.BAD_REQUEST,
      );
    }

    if ('password' in updateStudentDto) {
      throw new HttpException(
        'password cannot be updated using this endpoint',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedStudent = await this.studentModel
      .findOneAndUpdate({ registrationNumber: id }, updateStudentDto, {
        new: true,
      })
      .select('-password');

    if (!updatedStudent) {
      throw new HttpException(
        `Student with registration number ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return `Updated student :\n ${updatedStudent}`;
  }

  async remove(id: string) {
    const deletedStudent = await this.studentModel.findOneAndDelete({
      registrationNumber: id,
    });

    if (!deletedStudent) {
      throw new HttpException(
        `Student with registration number ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return `This action removes a #${id} student`;
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const student = await this.studentModel.findOne({ registrationNumber: id });
    if (!student) {
      throw new HttpException(
        `Student with registration number ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, student.password);
    if (!isMatch) {
      throw new HttpException(
        'Old password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    student.password = hashedPassword;
    await student.save();

    return { message: 'Password updated successfully' };
  }
}

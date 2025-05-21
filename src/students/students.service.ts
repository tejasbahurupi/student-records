import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './schemas/student.schema';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { successResponse } from 'src/shared/helpers/response.helper';

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
      throw new ConflictException(
        `Student with registration number ${createStudentDto.registrationNumber} already exists`,
      );
    }

    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    const newStudent = new this.studentModel({
      ...createStudentDto,
      password: hashedPassword,
    });

    await newStudent.save();

    const { password, ...studentWithoutPassword } = newStudent.toObject();
    return successResponse(
      'Student registered successfully',
      studentWithoutPassword,
    );
  }

  async findAll() {
    const students = await this.studentModel.find().select('-password');

    if (students.length === 0) {
      throw new NotFoundException('No students found');
    }

    return successResponse('Students found', students);
  }

  async findOne(id: string) {
    const student = await this.studentModel
      .findOne({ registrationNumber: id })
      .select('-password' + ' -_id' + ' -__v');

    if (!student) {
      throw new NotFoundException(
        `Student with registration number ${id} not found`,
      );
    }
    return successResponse(
      `Student with registration number ${id} found`,
      student,
    );
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    if ('registrationNumber' in updateStudentDto) {
      throw new BadRequestException('Registration number cannot be updated');
    }

    if ('password' in updateStudentDto) {
      throw new BadRequestException(
        'Password cannot be updated using this endpoint',
      );
    }

    const updatedStudent = await this.studentModel
      .findOneAndUpdate({ registrationNumber: id }, updateStudentDto, {
        new: true,
      })
      .select('-password' + ' -_id' + ' -__v');

    if (!updatedStudent) {
      throw new NotFoundException(
        `Student with registration number ${id} not found`,
      );
    }

    return successResponse(
      `Student with registration number ${id} updated successfully`,
      updatedStudent,
    );
  }

  async remove(id: string) {
    const deletedStudent = await this.studentModel.findOneAndDelete({
      registrationNumber: id,
    });

    if (!deletedStudent) {
      throw new NotFoundException(
        `Student with registration number ${id} not found`,
      );
    }

    return successResponse(
      `Student with registration number ${id} deleted successfully`,
    );
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const student = await this.studentModel.findOne({ registrationNumber: id });
    if (!student) {
      throw new NotFoundException(
        `Student with registration number ${id} not found`,
      );
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, student.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    student.password = hashedPassword;
    await student.save();

    return successResponse(
      `Password updated successfully for student with registration number ${id}`,
    );
  }
}

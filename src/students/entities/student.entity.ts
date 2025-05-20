import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  validSections,
  validStandards,
} from 'src/constants/students-constants';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  registrationNo: string;

  @Prop({ required: true, enum: validStandards })
  standard: string;

  @Prop({ required: true, enum: validSections })
  section: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

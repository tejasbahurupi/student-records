import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ required: true })
  standard: string;

  @Prop({ required: true })
  section: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

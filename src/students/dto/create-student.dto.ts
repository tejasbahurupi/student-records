import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  registrationNo: string;

  @IsNotEmpty()
  @IsString()
  standard: string;

  @IsNotEmpty()
  @IsString()
  section: string;
}

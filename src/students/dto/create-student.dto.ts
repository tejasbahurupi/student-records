import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly registrationNumber: string;

  @IsNotEmpty()
  @IsString()
  readonly standard: string;

  @IsNotEmpty()
  @IsString()
  readonly section: string;
}

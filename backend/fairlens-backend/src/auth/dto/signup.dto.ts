import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class SignupDto {
  @IsEmail({}, { message: 'Email must be valid (example@hello.com)' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  name: string;

  @IsEnum(Role, { message: 'Invalid role' })
  role: Role;
}

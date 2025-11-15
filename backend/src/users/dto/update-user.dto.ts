import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ser um endereço de email válido' })
  email?: string;

  @IsOptional()
  @IsString()
  profileId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

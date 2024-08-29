import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UserDto implements Omit<User, 'password'> {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  refreshToken: string;

  @ApiProperty()
  @IsEnum($Enums)
  role: $Enums.Role;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}

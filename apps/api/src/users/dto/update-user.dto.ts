import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  // @MinLength(8)
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
  //   message:
  //     'Password must contain uppercase, lowercase, number and special character',
  // })
  newPassword?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}

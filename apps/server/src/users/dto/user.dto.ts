import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';

export class UserDto implements Omit<User, 'password'> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  role: $Enums.Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

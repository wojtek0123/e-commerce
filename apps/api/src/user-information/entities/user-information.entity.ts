import { ApiProperty } from '@nestjs/swagger';

export class UserInformation {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  firstName: string;

  @ApiProperty({ type: String })
  lastname: string;

  @ApiProperty({ type: String })
  phone: string;

  @ApiProperty({ type: String })
  createdAt: string;

  @ApiProperty({ type: String })
  updatedAt: string;
}

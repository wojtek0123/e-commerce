import { ApiProperty } from '@nestjs/swagger';
import { Author } from '@prisma/client';

export class AuthorEntity implements Author {
  @ApiProperty({ type: String, readOnly: true })
  id: string;

  @ApiProperty({ type: String })
  name: string;
}

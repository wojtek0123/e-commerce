import { ApiProperty } from '@nestjs/swagger';
import { Author } from '@prisma/client';

export class AuthorEntity implements Author {
  @ApiProperty({ type: Number, readOnly: true })
  id: number;

  @ApiProperty({ type: String })
  name: string;
}

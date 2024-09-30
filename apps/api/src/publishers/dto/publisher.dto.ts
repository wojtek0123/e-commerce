import { ApiProperty } from '@nestjs/swagger';
import { Publisher } from '@prisma/client';

export class PublisherDto implements Publisher {
  @ApiProperty({ readOnly: true, type: String })
  id: string;

  @ApiProperty()
  name: string;
}

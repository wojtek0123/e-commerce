import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateFavouriteBooksListDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsUUID()
  userId: string;
}

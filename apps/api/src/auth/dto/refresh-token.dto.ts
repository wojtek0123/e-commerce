import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

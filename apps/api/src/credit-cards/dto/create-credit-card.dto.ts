import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCreditCardDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  number: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  securityCode: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  expirationDate: string;
}

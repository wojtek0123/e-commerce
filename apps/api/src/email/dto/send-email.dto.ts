import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ type: String, isArray: true })
  @IsEmail({}, { each: true })
  recipients: string[];

  @ApiProperty({ type: String })
  @IsString()
  subject: string;

  @ApiProperty({ type: String })
  @IsString()
  html: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  text?: string;
}

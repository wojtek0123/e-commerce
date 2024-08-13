import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  amount: number;

  @ApiProperty({ type: String })
  @IsString()
  provider: string;

  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  orderDetailsId: number;
}

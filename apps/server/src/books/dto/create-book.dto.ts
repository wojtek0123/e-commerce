import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateBook {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  coverImage: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsNumber()
  numberPages: number;

  @ApiProperty()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  price: number;

  // @ApiProperty()
  // @IsDate()
  // createdAt: Date;
  //
  // @ApiProperty()
  // @IsDate()
  // updatedAt: Date;

  @ApiProperty()
  @IsDate()
  publishingDate: Date;

  @ApiProperty()
  @IsNumber()
  publisherId: number;
}

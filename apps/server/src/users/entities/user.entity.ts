import { ApiProperty } from '@nestjs/swagger';
import { User as PrismaUser } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { UserAddress } from '../../user-addresses/entities/user-address.entity';
import { ShoppingSession } from '../../shopping-sessions/entities/shopping-session.entity';
import { OrderDetail } from '../../order-details/entities/order-detail.entity';
import { UserPayment } from '../../user-payments/entities/user-payment.entity';

export class User implements PrismaUser {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  houseNumber: string;

  @ApiProperty()
  homeNumber: string;

  @ApiProperty()
  role: 'ADMIN' | 'USER' | 'ROOT';

  @Exclude()
  password: string;

  @ApiProperty({
    isArray: true,
    required: false,
  })
  userDetails?: UserAddress[];
  @ApiProperty({
    required: false,
    nullable: true,
  })
  shoppingSession?: ShoppingSession | null;

  @ApiProperty({
    isArray: true,
    required: false,
  })
  OrderDetails?: OrderDetail[];

  @ApiProperty({
    isArray: true,
    required: false,
  })
  UserPayment?: UserPayment[];
}

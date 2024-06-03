import { PartialType } from '@nestjs/mapped-types';
import { CreateShoppingSessionDto } from './create-shopping-session.dto';

export class UpdateShoppingSessionDto extends PartialType(CreateShoppingSessionDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateShippingMethodDto } from './create-shipping-method.dto';

export class UpdateShippingMethodDto extends PartialType(
  CreateShippingMethodDto
) {}

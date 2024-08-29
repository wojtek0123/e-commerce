import { PartialType } from '@nestjs/mapped-types';
import { CreateProductInventoryDto } from './create-product-inventory.dto';

export class UpdateProductInventoryDto extends PartialType(CreateProductInventoryDto) {}

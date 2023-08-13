import { Injectable } from '@nestjs/common';
import { CreateProductInventoryDto } from './dto/create-product-inventory.dto';
import { UpdateProductInventoryDto } from './dto/update-product-inventory.dto';

@Injectable()
export class ProductInventoriesService {
  create(createProductInventoryDto: CreateProductInventoryDto) {
    return 'This action adds a new productInventory';
  }

  findAll() {
    return `This action returns all productInventories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productInventory`;
  }

  update(id: number, updateProductInventoryDto: UpdateProductInventoryDto) {
    return `This action updates a #${id} productInventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} productInventory`;
  }
}

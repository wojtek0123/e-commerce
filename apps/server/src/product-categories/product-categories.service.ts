import { Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductCategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createProductCategoryDto: CreateProductCategoryDto) {
    return this.prisma.productCategory.create({
      data: createProductCategoryDto,
    });
  }

  findAll() {
    return this.prisma.productCategory.findMany();
  }

  findOne(id: number) {
    return this.prisma.productCategory.findUnique({ where: { id } });
  }

  update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    return this.prisma.productCategory.update({
      where: { id },
      data: updateProductCategoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.productCategory.delete({ where: { id } });
  }
}

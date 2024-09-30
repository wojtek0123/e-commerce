import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll(opts: { nameLike?: string; page?: number; size?: number }) {
    return this.prisma.category
      .findMany({
        where: { name: { contains: opts.nameLike ?? '', mode: 'insensitive' } },
        skip: (opts.size || 20) * ((opts.page || 1) - 1),
        take: opts.size || 20,
      })
      .then((categories) =>
        categories.sort((a, b) => a.name.localeCompare(b.name)),
      );
  }

  findOne(id: Category['id']) {
    return `This action returns a #${id} category`;
  }

  update(id: Category['id'], updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: Category['id']) {
    return `This action removes a #${id} category`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category, Prisma } from '@prisma/client';
import { parseNumber } from '../common/utils/parse-number';
import { parseQueryParams } from '../common/utils/parse-query-params';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCategoryDto) {
    return this.prisma.category.create({ data });
  }

  async findAll(opts: {
    nameLike?: string;
    nameIn?: string;
    page?: string;
    size?: string;
  }) {
    const pageNumber = parseNumber(opts.page, 1);
    const sizeNumber = parseNumber(opts.size, 20);
    const nameIn = parseQueryParams(opts.nameIn);

    const whereClause: Prisma.CategoryWhereInput = {
      AND: [
        opts.nameLike
          ? { name: { contains: opts.nameLike, mode: 'insensitive' } }
          : {},
        nameIn.length > 0 ? { name: { in: nameIn } } : {},
      ],
    };

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where: whereClause,
        skip: sizeNumber * (pageNumber - 1),
        take: sizeNumber,
        orderBy: { name: 'asc' },
      }),
      this.prisma.category.count({ where: whereClause }),
    ]);

    return {
      items: categories,
      total,
      count: categories.length,
      page: pageNumber,
    };
  }

  async findOne(id: Category['id']) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Not found category with id: ${id}`);
    }

    return category;
  }

  async update(id: Category['id'], data: UpdateCategoryDto) {
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data,
    });

    if (!updatedCategory) {
      throw new NotFoundException(`Not found category with id: ${id}`);
    }

    return updatedCategory;
  }

  remove(ids: string) {
    const parsedIds = ids.split(',');

    return this.prisma.category.deleteMany({
      where: { id: { in: parsedIds } },
    });
  }
}

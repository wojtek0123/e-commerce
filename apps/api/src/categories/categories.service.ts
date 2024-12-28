import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category, Prisma } from '@prisma/client';
import { isUUID } from 'class-validator';

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
    const pageNumber = this.parseNumber(opts.page, 1);
    const sizeNumber = this.parseNumber(opts.size, 20);

    console.log(pageNumber, sizeNumber);

    const whereClause: Prisma.CategoryWhereInput = {
      AND: [
        opts.nameLike
          ? { name: { contains: opts.nameLike, mode: 'insensitive' } }
          : {},
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

  private parseNumber(value: string | undefined, fallback: number): number {
    const parsedValue = value ? parseInt(value, 10) : NaN;
    return isNaN(parsedValue) ? fallback : parsedValue;
  }
}

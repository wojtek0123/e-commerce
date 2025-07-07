import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Country } from '@prisma/client';

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCountryDto) {
    return this.prisma.country.create({ data });
  }

  findAll(query: { nameLike: string | undefined }) {
    return this.prisma.country.findMany({
      where: { name: { contains: query.nameLike, mode: 'insensitive' } },
    });
  }

  async findOne(id: Country['id']) {
    const country = await this.prisma.country.findUnique({ where: { id } });

    if (!country) {
      throw new NotFoundException('Not found a country with id: ' + id);
    }

    return country;
  }

  async update(id: Country['id'], data: UpdateCountryDto) {
    const country = await this.prisma.country.findUnique({ where: { id } });

    if (!country) {
      throw new NotFoundException('Not found a country with id: ' + id);
    }

    return this.prisma.country.update({ where: { id }, data });
  }

  async remove(id: Country['id']) {
    const country = await this.prisma.country.findUnique({ where: { id } });

    if (!country) {
      throw new NotFoundException('Not found a country with id: ' + id);
    }

    return this.prisma.country.delete({ where: { id } });
  }
}

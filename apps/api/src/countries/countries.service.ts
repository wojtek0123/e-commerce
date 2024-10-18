import { Injectable } from '@nestjs/common';
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

  findOne(id: Country['id']) {
    return this.prisma.country.findUnique({ where: { id } });
  }

  update(id: Country['id'], data: UpdateCountryDto) {
    return this.prisma.country.update({ where: { id }, data });
  }

  remove(id: Country['id']) {
    return this.prisma.country.delete({ where: { id } });
  }
}

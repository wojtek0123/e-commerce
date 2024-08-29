import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCountryDto) {
    return this.prisma.country.create({ data });
  }

  findAll() {
    return this.prisma.country.findMany();
  }

  findOne(id: number) {
    return this.prisma.country.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateCountryDto) {
    return this.prisma.country.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.country.delete({ where: { id } });
  }
}

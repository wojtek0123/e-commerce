import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  create(@Body() data: CreateCountryDto) {
    return this.countriesService.create(data);
  }

  @Get()
  @ApiQuery({ type: String, name: 'nameLike', required: false })
  findAll(@Query('nameLike') nameLike?: string) {
    return this.countriesService.findAll({ nameLike });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCountryDto) {
    return this.countriesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
}

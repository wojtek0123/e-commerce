import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';
import { Country } from './entities/country.entity';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({ description: 'Create an country' })
  @ApiCreatedResponse({ type: Country })
  create(@Body() data: CreateCountryDto) {
    return this.countriesService.create(data);
  }

  @Get()
  @ApiOkResponse({ type: Country, isArray: true })
  @ApiOperation({ description: 'Get countries' })
  @ApiQuery({ type: String, name: 'nameLike', required: false })
  findAll(@Query('nameLike') nameLike?: string) {
    return this.countriesService.findAll({ nameLike });
  }

  @Get(':id')
  @ApiOkResponse({ type: Country })
  @ApiOperation({ description: 'Get country' })
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: Country })
  @ApiOperation({ description: 'Update country' })
  @Roles([Role.ADMIN])
  update(@Param('id') id: string, @Body() data: UpdateCountryDto) {
    return this.countriesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @ApiOkResponse({ type: Country })
  @ApiOperation({ description: 'Delete country' })
  @Roles([Role.ADMIN])
  @ApiParam({ name: 'id', type: String, required: true })
  remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
}

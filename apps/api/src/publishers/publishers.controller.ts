import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PublishersService } from './publishers.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PublisherDto } from './dto/publisher.dto';
import { Prisma, Role } from '@prisma/client';
import { Roles, RolesGuard } from '../common/guards/role.guard';

@ApiTags('publishers')
@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a publisher' })
  @ApiCreatedResponse({ type: PublisherDto })
  @ApiBody({ description: '', type: PublisherDto })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  create(@Body() data: Prisma.PublisherCreateInput) {
    return this.publishersService.create(data);
  }

  @Get()
  @ApiOkResponse({ type: PublisherDto, isArray: true })
  @ApiOperation({ summary: 'Get publishers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'nameLike', required: false, type: String })
  @ApiQuery({ name: 'nameIn', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('nameLike') nameLike?: string,
    @Query('nameIn') nameIn?: string,
  ) {
    return this.publishersService.findAll({
      nameLike,
      nameIn,
      page: +page,
      size: +size,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific publisher' })
  @ApiOkResponse({ type: PublisherDto })
  findOne(@Param('id') id: string) {
    return this.publishersService.findOne({ id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a publisher' })
  @ApiCreatedResponse({ type: PublisherDto })
  @ApiBearerAuth()
  @ApiBody({ description: '', type: PublisherDto })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  update(@Param('id') id: string, @Body() data: Prisma.PublisherUpdateInput) {
    return this.publishersService.update({ id }, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a publisher' })
  @ApiOkResponse({ type: PublisherDto })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @ApiParam({ name: 'id', type: String, required: true })
  @Roles([Role.ADMIN])
  remove(@Param('id') id: string) {
    return this.publishersService.remove(id);
  }
}

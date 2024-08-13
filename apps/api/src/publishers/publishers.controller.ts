import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PublishersService } from './publishers.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PublisherDto } from './dto/publisher.dto';
import { Prisma } from '@prisma/client';

@ApiTags('publishers')
@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a publisher' })
  @ApiCreatedResponse({ type: PublisherDto })
  @ApiBody({ description: '', type: PublisherDto })
  create(@Body() data: Prisma.PublisherCreateInput) {
    return this.publishersService.create(data);
  }

  @Get()
  @ApiOkResponse({ type: PublisherDto, isArray: true })
  @ApiOperation({ summary: 'Get publishers' })
  findAll() {
    return this.publishersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific publisher' })
  @ApiOkResponse({ type: PublisherDto })
  findOne(@Param('id') id: string) {
    return this.publishersService.findOne({ id: +id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a publisher' })
  @ApiCreatedResponse({ type: PublisherDto })
  @ApiBody({ description: '', type: PublisherDto })
  update(@Param('id') id: string, @Body() data: Prisma.PublisherUpdateInput) {
    return this.publishersService.update({ id: +id }, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a publisher' })
  @ApiOkResponse({ type: PublisherDto })
  remove(@Param('id') id: string) {
    return this.publishersService.remove({ id: +id });
  }
}

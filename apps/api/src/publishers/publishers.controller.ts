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
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  create(@Body() data: Prisma.PublisherCreateInput) {
    return this.publishersService.create(data);
  }

  @Get()
  @ApiOkResponse({ type: PublisherDto, isArray: true })
  @ApiOperation({ summary: 'Get publishers' })
  @ApiQuery({ name: 'nameLike', type: String, required: false })
  findAll(@Query('nameLike') nameLike?: string) {
    return this.publishersService.findAll({ nameLike });
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
  @ApiBody({ description: '', type: PublisherDto })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  update(@Param('id') id: string, @Body() data: Prisma.PublisherUpdateInput) {
    return this.publishersService.update({ id }, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a publisher' })
  @ApiOkResponse({ type: PublisherDto })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  remove(@Param('id') id: string) {
    return this.publishersService.remove({ id });
  }
}

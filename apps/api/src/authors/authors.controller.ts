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
import { AuthorsService } from './authors.service';
import { Prisma, Author, Role } from '@prisma/client';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorDto } from './dto/author.dto';
import { Roles, RolesGuard } from '../common/guards/role.guard';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an author' })
  @ApiCreatedResponse({ type: AuthorDto })
  @ApiBody({ description: 'Create an author', type: AuthorDto })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  create(@Body() data: Prisma.AuthorCreateInput): Promise<Author> {
    return this.authorsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  @ApiOkResponse({ type: AuthorDto, isArray: true })
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
    return this.authorsService.findAll({
      page: +page,
      size: +size,
      nameLike,
      nameIn,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific author by id' })
  @ApiOkResponse({ type: AuthorDto })
  findOne(@Param('id') id: string) {
    return this.authorsService.findOne({ id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an author' })
  @ApiCreatedResponse({ type: AuthorDto })
  @ApiBody({ description: 'Update an author', type: AuthorDto })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  update(@Param('id') id: string, @Body() data: { name: string }) {
    return this.authorsService.update({ id }, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an author' })
  @ApiOkResponse({ type: AuthorDto })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  remove(@Param('id') id: string) {
    return this.authorsService.remove({ id });
  }
}

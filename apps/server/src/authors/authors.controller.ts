import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { Prisma, Author } from '@prisma/client';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorDto } from './dto/author.dto';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an author' })
  @ApiCreatedResponse({ type: AuthorDto })
  @ApiBody({ description: 'Create an author', type: AuthorDto })
  create(@Body() data: Prisma.AuthorCreateInput): Promise<Author> {
    return this.authorsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  @ApiOkResponse({ type: AuthorDto, isArray: true })
  findAll() {
    return this.authorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific author by id' })
  @ApiOkResponse({ type: AuthorDto })
  findOne(@Param('id') id: string) {
    return this.authorsService.findOne({ id: +id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an author' })
  @ApiCreatedResponse({ type: AuthorDto })
  @ApiBody({ description: 'Update an author', type: AuthorDto })
  update(@Param('id') id: string, @Body() data: { name: string }) {
    return this.authorsService.update({ id: +id }, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an author' })
  @ApiOkResponse({ type: AuthorDto })
  remove(@Param('id') id: string) {
    return this.authorsService.remove({ id: +id });
  }
}

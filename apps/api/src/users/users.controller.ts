import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { Roles, RolesGuard } from '../common/guards/role.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @ApiCreatedResponse({ type: User })
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get users' })
  @ApiOkResponse({ type: User, isArray: true })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @ApiBearerAuth()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get unique user' })
  @ApiOkResponse({ type: User })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN, Role.USER])
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiCreatedResponse({ type: User })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN, Role.USER])
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.usersService.update(authHeader, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ type: User })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN, Role.USER])
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

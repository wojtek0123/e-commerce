import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { UserAddressDto } from './dto/user-address.dto';

@ApiTags('user addresses')
@Controller('user-addresses')
export class UserAddressesController {
  constructor(private readonly userAddressesService: UserAddressesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserAddressDto })
  create(@Body() data: Prisma.UserAddressCreateInput) {
    return this.userAddressesService.create(data);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserAddressDto, isArray: true })
  findAll() {
    return this.userAddressesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserAddressDto })
  findOne(@Param('id') id: Prisma.UserAddressWhereUniqueInput) {
    return this.userAddressesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserAddressDto })
  update(
    @Param('id') id: Prisma.UserAddressWhereUniqueInput,
    @Body() data: Prisma.UserAddressUpdateInput
  ) {
    return this.userAddressesService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserAddressDto })
  remove(@Param('id') id: Prisma.UserAddressWhereUniqueInput) {
    return this.userAddressesService.remove(id);
  }
}

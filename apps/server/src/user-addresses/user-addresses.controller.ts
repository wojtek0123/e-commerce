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
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user addresses')
@Controller('user-addresses')
export class UserAddressesController {
  constructor(private readonly userAddressesService: UserAddressesService) {}

  @Post()
  create(@Body() createUserAddressDto: CreateUserAddressDto) {
    return this.userAddressesService.create(createUserAddressDto);
  }

  @Get()
  findAll() {
    return this.userAddressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAddressesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserAddressDto: UpdateUserAddressDto
  ) {
    return this.userAddressesService.update(+id, updateUserAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAddressesService.remove(+id);
  }
}

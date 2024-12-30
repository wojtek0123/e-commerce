import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { UserAddressDto } from './dto/user-address.dto';
import { UserAddressCreateDto } from './dto/user-address-create.dto';
import { UserAddress } from './entities/user-addresses.entity';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { UserAddressUpdateDto } from './dto/user-address-update.dto';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';

@ApiTags('user-addresses')
@Controller('user-addresses')
export class UserAddressesController {
  constructor(private readonly userAddressesService: UserAddressesService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([Role.USER])
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserAddress })
  @ApiOperation({ summary: 'create user address' })
  create(
    @Body() body: UserAddressCreateDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.userAddressesService.create(authHeader, body);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserAddressDto })
  @ApiOperation({ summary: 'get user addrresses of specific user' })
  find(@Headers('authorization') authHeader: string) {
    return this.userAddressesService.findAll(authHeader);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ type: UserAddressDto })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get specific user address' })
  findOne(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ) {
    return this.userAddressesService.findOne(authHeader, id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([Role.USER])
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserAddressDto })
  @ApiOperation({ summary: 'update user address' })
  update(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Body() data: UserAddressUpdateDto,
  ) {
    return this.userAddressesService.update(authHeader, id, data);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([Role.USER])
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserAddressDto })
  @ApiOperation({ summary: 'delete user address' })
  remove(@Param('id') id: string) {
    return this.userAddressesService.remove(id);
  }
}

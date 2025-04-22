import {
  Controller,
  Get,
  Headers,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserInformationsService } from './user-informations.service';
import { CreateUserInformationDto } from './dto/create-user-information.dto';
import { UpdateUserInformationDto } from './dto/update-user-information.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserInformation } from './entities/user-information.entity';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';

@Controller('user-informations')
export class UserInformationsController {
  constructor(
    private readonly userInformationsService: UserInformationsService,
  ) {}

  @Post()
  create(@Body() createUserInformationDto: CreateUserInformationDto) {
    return this.userInformationsService.create(createUserInformationDto);
  }

  @Get()
  findAll() {
    return this.userInformationsService.findAll();
  }

  @Get()
  @ApiOperation({ summary: 'Get unique user' })
  @ApiOkResponse({ type: UserInformation })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN, Role.USER])
  @ApiBearerAuth()
  findOne(@Headers('authorization') authHeader: string) {
    return this.userInformationsService.findOne(authHeader);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserInformationDto: UpdateUserInformationDto,
  ) {
    return this.userInformationsService.update(+id, updateUserInformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userInformationsService.remove(+id);
  }
}

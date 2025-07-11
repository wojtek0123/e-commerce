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
import { UserInformationService } from './user-information.service';
import { CreateUserInformationDto } from './dto/create-user-information.dto';
import { UpdateUserInformationDto } from './dto/update-user-information.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserInformation } from './entities/user-information.entity';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';

@Controller('user-information')
@ApiTags('user-information')
export class UserInformationController {
  constructor(
    private readonly userInformationService: UserInformationService,
  ) {}

  @Post()
  create(@Body() createUserInformationDto: CreateUserInformationDto) {
    return this.userInformationService.create(createUserInformationDto);
  }

  @Get()
  findAll() {
    return this.userInformationService.findAll();
  }

  @Get()
  @ApiOperation({ summary: 'Get unique user' })
  @ApiOkResponse({ type: UserInformation })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN, Role.USER])
  @ApiBearerAuth()
  findOne(@Headers('authorization') authHeader: string) {
    return this.userInformationService.findOne(authHeader);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserInformationDto: UpdateUserInformationDto,
  ) {
    return this.userInformationService.update(+id, updateUserInformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userInformationService.remove(+id);
  }
}

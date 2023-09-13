import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { MapperService } from 'src/mapper/mapper.service';
import { PublicUserDto } from './dto/publicUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiSecurity('jwt')
@ApiTags('users')
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private mapperService: MapperService,
  ) {}

  @ApiResponse({
    status: 200,
    type: [PublicUserDto],
  })
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    return this.mapperService.mapper.mapArray<User, PublicUserDto>(
      users,
      'User',
      'PublicUserDto',
    );
  }

  @ApiResponse({
    status: 200,
    type: [PublicUserDto],
  })
  @Get('search')
  async search(@Req() req: Request, @Query('query') query: string) {
    const users = await this.usersService.search(query, req.user!.id);

    return this.mapperService.mapper.mapArray<User, PublicUserDto>(
      users,
      'User',
      'PublicUserDto',
    );
  }

  @Get('me')
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  async me(@Req() req: Request) {
    return await this.usersService.findById(req.user!.id);
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }
}

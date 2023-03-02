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
import { JwtGuard } from 'src/jwt/jwt.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { SameUserGuard } from './sameUser.guard';
import { UsersService } from './users.service';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(@Req() req: Request) {
    return await this.usersService.getAll(req.user.id);
  }

  @Get('search')
  async search(@Req() req: Request, @Query('query') query: string) {
    return await this.usersService.search(query, req.user.id);
  }

  @UseGuards(SameUserGuard)
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.get(id);
  }

  @UseGuards(SameUserGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }
}

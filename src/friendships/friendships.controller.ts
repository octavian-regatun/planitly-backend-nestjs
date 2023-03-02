import {
  Controller,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common/decorators';
import { Request } from 'express';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { CreateFriendshipDto } from './dto/createFriendship.dto';
import { FriendshipStatus } from './entities/FriendshipStatus';
import { FriendshipType } from './entities/FriendshipType';
import { FriendshipsService } from './friendships.service';

@UseGuards(JwtGuard)
@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Get('users/:id')
  async findByUserId(@Req() req: Request, @Param('id') id: string) {
    console.log(req.user.id, id);
    return await this.friendshipsService.findByUserId(req.user.id, id);
  }

  @Get()
  async findAll(
    @Query('status') status: FriendshipStatus,
    @Query('type') type: FriendshipType,
    @Req() req: Request,
  ) {
    return await this.friendshipsService.getAll(req.user.id, { status, type });
  }

  @Post()
  async create(
    @Req() req: Request,
    @Body() createFriendshipDto: CreateFriendshipDto,
  ) {
    try {
      return await this.friendshipsService.create(
        req.user.id,
        createFriendshipDto,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch()
  async update(
    @Req() req: Request,
    @Body()
    updateFriendshipDto: {
      requesterId: string;
    },
  ) {
    try {
      return await this.friendshipsService.accept(
        parseInt(updateFriendshipDto.requesterId),
        req.user.id,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    try {
      return await this.friendshipsService.delete(id, req.user.id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}

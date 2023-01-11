import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Body, Delete, Get, Patch, Req } from '@nestjs/common/decorators';
import { Request } from 'express';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { CreateFriendshipDto } from './dto/createFriendship.dto';
import { FriendshipsService } from './friendships.service';

@UseGuards(JwtGuard)
@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Get()
  async findAll(@Req() req: Request) {
    return await this.friendshipsService.getAll(req.user.id);
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

  @Delete()
  async delete(
    @Req() req: Request,
    @Body()
    deleteFriendshipDto: {
      requesterId: string;
    },
  ) {
    try {
      return await this.friendshipsService.decline(
        parseInt(deleteFriendshipDto.requesterId),
        req.user.id,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}

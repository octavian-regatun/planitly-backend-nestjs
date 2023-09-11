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
  Req,
  Res,
} from '@nestjs/common/decorators';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { CreateFriendshipDto } from './dto/createFriendship.dto';
import { FriendshipsService } from './friendships.service';
import { FriendshipDto } from './dto/friendship.dto';
import { UpdateFriendshipDto } from './dto/updateFriendship.dto';

@ApiSecurity('jwt')
@ApiTags('friendships')
@UseGuards(JwtGuard)
@Controller('friendships')
export class FriendshipsController {
  constructor(private friendshipsService: FriendshipsService) {}

  @ApiResponse({
    status: 200,
    type: [FriendshipDto],
  })
  @Get()
  async find(@Req() req: Request, @Res() res: Response) {
    const friendships = await this.friendshipsService.find(req.user.id, {
      status: 'ALL',
      type: 'ALL',
    });

    if (friendships) {
      return res.status(HttpStatus.OK).json(friendships);
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get('users/:id')
  async findByUserId(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const friendship = await this.friendshipsService.findByUserId(
      req.user.id,
      id,
    );

    if (friendship) {
      return res.status(HttpStatus.OK).json(friendship);
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @ApiResponse({
    status: 200,
    type: [FriendshipDto],
  })
  @Post()
  async create(
    @Req() req: Request,
    @Body() { recipientId }: CreateFriendshipDto,
  ) {
    try {
      return await this.friendshipsService.create(req.user.id, recipientId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiResponse({
    status: 200,
    type: FriendshipDto,
  })
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.friendshipsService.accept(id);
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

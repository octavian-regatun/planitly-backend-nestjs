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
  Res,
} from '@nestjs/common/decorators';
import { ApiQuery, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { CreateFriendshipDto } from './dto/createFriendship.dto';
import { FriendshipDto } from './dto/friendship.dto';
import { FriendshipsService } from './friendships.service';
import { MapperService } from 'src/mapper/mapper.service';

@ApiSecurity('jwt')
@ApiTags('friendships')
@UseGuards(JwtGuard)
@Controller('friendships')
export class FriendshipsController {
  constructor(
    private friendshipsService: FriendshipsService,
    private mapperService: MapperService,
  ) {}

  @ApiResponse({
    status: 200,
    type: [FriendshipDto],
  })
  @ApiQuery({
    name: 'status',
    enum: ['ALL', 'ACCEPTED', 'PENDING'],
    required: false,
  })
  @ApiQuery({
    name: 'type',
    enum: ['ALL', 'INCOMING', 'OUTGOING'],
    required: false,
  })
  @Get()
  async find(
    @Req() req: Request,
    @Res() res: Response,
    @Query('status') status: string,
    @Query('type') type: string,
  ) {
    if (status !== 'ALL' && status !== 'ACCEPTED' && status !== 'PENDING')
      throw new HttpException(
        'Invalid status query, must be of value "ALL", "ACCEPTED", "PENDING".',
        HttpStatus.BAD_REQUEST,
      );
    if (type !== 'ALL' && type !== 'INCOMING' && type !== 'OUTGOING')
      throw new HttpException(
        'Invalid type query, must be of value "ALL", "INCOMING", "OUTGOING".',
        HttpStatus.BAD_REQUEST,
      );

    const friendships = await this.friendshipsService.find(req.user!.id, {
      status: 'ALL',
      type: 'ALL',
    });

    if (friendships) {
      return res
        .status(HttpStatus.OK)
        .json(
          this.mapperService.mapper.mapArray(
            friendships,
            'Friendship',
            'FriendshipDto',
          ),
        );
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
      req.user!.id,
      id,
    );

    const friendshipDto = this.mapperService.mapper.map(
      friendship,
      'Friendship',
      'FriendshipDto',
    );

    if (friendship) {
      return res.status(HttpStatus.OK).json(friendshipDto);
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
      return await this.friendshipsService.create(req.user!.id, recipientId);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiResponse({
    status: 200,
    type: FriendshipDto,
  })
  @Patch(':id')
  async update(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    try {
      return await this.friendshipsService.accept(req.user!.id, id);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    try {
      return await this.friendshipsService.delete(id, req.user!.id);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

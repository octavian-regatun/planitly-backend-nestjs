import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { CreateGroupDto } from './dto/createGroup.dto';
import { GroupDto } from './dto/group.dto';
import { GroupsService } from './groups.service';

@ApiSecurity('jwt')
@ApiTags('groups')
@UseGuards(JwtGuard)
@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @ApiResponse({
    status: 200,
    type: GroupDto,
  })
  @Post()
  async create(@Req() req: Request, @Body() createGroupDto: CreateGroupDto) {
    try {
      return await this.groupsService.create(req.user.id, createGroupDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiResponse({
    status: 200,
    type: [GroupDto],
  })
  @Get()
  async find(@Req() req: Request) {
    try {
      return await this.groupsService.find(req.user.id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}

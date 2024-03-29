import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupDto } from './dto/group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
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
      return await this.groupsService.create(req.user!.id, createGroupDto);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    try {
      return await this.groupsService.update(req.user!.id, updateGroupDto, id);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiResponse({
    status: 200,
    type: [GroupDto],
  })
  @Get()
  async find(@Req() req: Request) {
    return await this.groupsService.find(req.user!.id);
  }

  @ApiResponse({
    status: 200,
    type: GroupDto,
  })
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: number) {
    return await this.groupsService.findById(req.user!.id, id);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: number) {
    try {
      return await this.groupsService.delete(req.user!.id, id);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

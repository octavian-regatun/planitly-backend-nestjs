import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { GroupMembersService } from './group-members.service';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { GroupMemberDto } from 'src/groups/dto/group-member.dto';

@ApiSecurity('jwt')
@ApiTags('group-members')
@UseGuards(JwtGuard)
@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @ApiOperation({
    summary: 'Create group member',
  })
  @ApiResponse({
    status: 200,
    type: GroupMemberDto,
  })
  @Post()
  async create(@Req() req: Request, @Body() body: CreateGroupMemberDto) {
    return await this.groupMembersService.create(
      req.user!.id,
      body.groupId,
      body.userId,
    );
  }

  @ApiOperation({
    summary: 'Delete group member',
  })
  @Delete(':id')
  async deleteById(@Req() req: Request, @Param('id') id: number) {
    return await this.groupMembersService.deleteById(req.user!.id, id);
  }

  @ApiOperation({
    summary: 'Find all group members by group id',
  })
  @Get('groups/:id/me')
  async findMeByGroupId(@Req() req: Request, @Param('id') id: number) {
    const members = await this.groupMembersService.findByGroupId(
      req.user!.id,
      id,
    );

    return members.find((member) => member.userId === req.user!.id);
  }

  @ApiOperation({
    summary: 'Accept group member request',
  })
  @Patch(':id')
  async update(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    try {
      return await this.groupMembersService.accept(req.user!.id, id);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

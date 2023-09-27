import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { GroupMembersService } from './group-members.service';
import { JwtGuard } from 'src/jwt/jwt.guard';

@ApiSecurity('jwt')
@ApiTags('group-members')
@UseGuards(JwtGuard)
@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Delete(':id')
  async deleteById(@Req() req: Request, @Param('id') id: number) {
    return await this.groupMembersService.deleteById(req.user!.id, id);
  }

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

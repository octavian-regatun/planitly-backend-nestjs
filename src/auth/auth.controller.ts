import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleLogin(@Body() body: { code: string }, @Res() res: Response) {
    const { code } = body;

    try {
      const jwt = await this.authService.authenticate(code);
      return res.json(jwt);
    } catch (e: any) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtGuard)
  @Get()
  checkAuth(): HttpStatus {
    return HttpStatus.OK;
  }
}

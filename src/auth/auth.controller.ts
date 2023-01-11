import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleLogin(
    @Body() body: { code: string },
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const { code } = body;

    let jwt: string;
    try {
      jwt = await this.authService.authenticate(code);
    } catch (e: any) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    return res.json(jwt);
  }

  @UseGuards(JwtGuard)
  @Get()
  checkAuth(): HttpStatus {
    return HttpStatus.OK;
  }
}

import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserPayload, UsersService } from 'src/users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This method is empty because @UseGuards(AuthGuard('google')) automatically redirects the user to the Google login page
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const userPayload = req.user as UserPayload;

    const user = await this.userService.findOrCreate(userPayload);
    const jwt = await this.jwtService.sign(user);

    return res
      .cookie('jwt', jwt, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .redirect('http://localhost:3000');
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  checkAuth(@Res() res: Response) {
    return res.status(HttpStatus.OK).send();
  }
}

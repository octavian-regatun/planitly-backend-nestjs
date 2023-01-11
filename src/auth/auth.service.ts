import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { customAlphabet } from 'nanoid';
import { Gender } from 'src/users/entities/gender.enum';
import { UsersService } from 'src/users/users.service';
import { Provider } from './entities/provider.enum';
import { Role } from './entities/role.enum';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client({
      clientId: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      redirectUri: 'postmessage',
    });
  }

  async authenticate(code: string) {
    const payload = await this.validateGoogleToken(code);

    const user = await this.findOrCreateUser(payload);

    const token = this.jwtService.sign(user);

    return token;
  }

  private async validateGoogleToken(code: string) {
    const { tokens } = await this.googleClient.getToken(code);

    const ticket = await this.googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();

    return payload;
  }

  private async findOrCreateUser(payload: TokenPayload) {
    const user = await this.userService.findByEmail(payload.email);

    if (user) return user;

    const newUser: User = {
      id: undefined,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      gender: Gender.UNKNOWN,
      createdAt: new Date(),
      updatedAt: new Date(),
      username: this.generateRandomUsername(),
      authProvider: Provider.GOOGLE,
      role: Role.BASIC,
      birthday: null,
      locale: null,
      picture: payload.picture || null,
    };

    return this.userService.create(newUser);
  }

  private generateRandomUsername() {
    const usernameGenerator = customAlphabet('1234567890abcdef', 10);
    const randomUsername = usernameGenerator();

    return randomUsername;
  }
}

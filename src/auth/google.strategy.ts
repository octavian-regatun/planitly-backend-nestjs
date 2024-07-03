import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UserPayload } from 'src/users/users.service';

type Callback = (err: null | Error, user: UserPayload | null) => void;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken,
    refreshToken,
    profile: Profile,
    callback: Callback,
  ) {
    const { id, name, emails, photos, provider } = profile;

    if (!emails?.[0].value) {
      callback(new Error('No email found'), null);
      return;
    }

    if (!photos?.[0].value) {
      callback(new Error('No photo found'), null);
      return;
    }

    if (!name?.givenName) {
      callback(new Error('No first name found'), null);
      return;
    }

    const user: UserPayload = {
      id,
      firstName: name?.givenName,
      middleName: name?.middleName,
      lastName: name?.familyName,
      email: emails?.[0].value,
      picture: photos?.[0].value,
      provider,
    };

    callback(null, user);
  }
}

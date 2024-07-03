import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Provider } from 'src/auth/entities/provider.enum';
import { Role } from 'src/auth/entities/role.enum';
import { customAlphabet } from 'nanoid';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async find({ ids }: { ids?: number[] } = {}) {
    const query = { where: {} };

    if (ids) {
      query.where = {
        id: {
          in: ids,
        },
      };
    }

    return await this.prismaService.user.findMany(query);
  }

  async search(query: string, loggedUserId: number) {
    return this.prismaService.user.findMany({
      where: {
        id: {
          not: loggedUserId,
        },
        OR: [
          {
            username: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            firstName: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    const { username, firstName, lastName } = data;

    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        username,
        firstName,
        lastName,
      },
    });
  }

  findById(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  findByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }

  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.prismaService.user.create({
      data: user,
    });
  }

  async findOrCreate(payload: UserPayload) {
    const user = await this.findByEmail(payload.email as string);

    if (user) return user;

    const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      email: payload.email as string,
      firstName: payload.firstName,
      middleName: payload.middleName || null,
      lastName: payload.lastName || null,
      gender: Gender.UNKNOWN,
      username: this.generateRandomUsername(),
      authProvider: Provider.GOOGLE,
      role: Role.BASIC,
      picture: payload.picture,
    };

    return this.create(newUser);
  }

  generateRandomUsername() {
    const usernameGenerator = customAlphabet('1234567890abcdef', 10);
    const randomUsername = usernameGenerator();

    return randomUsername;
  }
}

export type UserPayload = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  email: string;
  picture: string;
  provider: string;
};

export enum Gender {
  UNKNOWN = 'UNKNOWN',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

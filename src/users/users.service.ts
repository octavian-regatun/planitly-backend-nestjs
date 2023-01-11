import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async get(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
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

  create(user: User) {
    return this.prismaService.user.create({
      data: user,
    });
  }
}

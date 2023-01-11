import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFriendshipDto } from './dto/createFriendship.dto';

@Injectable()
export class FriendshipsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async checkIfFriendshipExists(
    requesterId: number,
    recipientId: number,
  ) {
    return await this.prismaService.friendship.findFirst({
      where: {
        requesterId,
        recipientId,
      },
    });
  }

  async getAll(recipientId: number) {
    return await this.prismaService.friendship.findMany({
      where: {
        recipientId,
      },
    });
  }

  async create(requesterId: number, createFriendshipDto: CreateFriendshipDto) {
    const recipientId = parseInt(createFriendshipDto.recipientId);

    if (await this.checkIfFriendshipExists(requesterId, recipientId))
      throw new Error('Friendship already exists');

    return await this.prismaService.friendship.create({
      data: {
        requesterId,
        recipientId,
        status: 'PENDING',
      },
    });
  }

  async accept(requesterId: number, recipientId: number) {
    const friendship = await this.checkIfFriendshipExists(
      requesterId,
      recipientId,
    );

    if (!friendship) throw new Error('Friendship does not exist');

    return await this.prismaService.friendship.update({
      where: {
        id: friendship.id,
      },
      data: {
        status: 'ACCEPTED',
      },
    });
  }

  async decline(requesterId: number, recipientId: number) {
    const friendship = await this.checkIfFriendshipExists(
      requesterId,
      recipientId,
    );

    if (!friendship) throw new Error('Friendship does not exist');

    try {
      return await this.prismaService.friendship.delete({
        where: {
          id: friendship.id,
        },
      });
    } catch (e) {
      throw new Error('Could not delete friendship');
    }
  }
}

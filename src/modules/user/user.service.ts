import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        preferences: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(id: string, dto: UpdateUserDto) {
    const { preferences, ...rest } = dto;
    
    // If preferences are sent, we perform a shallow merge with existing ones
    // in a production app, you might want a deep merge logic
    const currentUser = await this.findOne(id);
    const newPreferences = preferences 
      ? { ...(currentUser.preferences as object), ...preferences }
      : currentUser.preferences;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        preferences: newPreferences || {},
      },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        preferences: true,
      },
    });
  }

  async updateAvatar(id: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id },
      data: { avatar: avatarUrl },
      select: { avatar: true },
    });
  }

  async getRideHistory(userId: string) {
    return this.prisma.ride.findMany({
      where: { userId },
      include: {
        driver: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteAccount(id: string) {
    // Basic deletion, might need cascading cleanup in complex apps
    return this.prisma.user.delete({
      where: { id },
    });
  }
}

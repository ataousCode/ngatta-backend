import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { RideStatus } from '@prisma/client';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class RideService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService,
  ) {}

  async createRide(userId: string, dto: CreateRideDto) {
    const ride = await this.prisma.ride.create({
      data: {
        userId,
        ...dto,
        status: RideStatus.PENDING,
      },
    });

    // Notify nearby/online drivers
    const onlineDrivers = await this.prisma.driver.findMany({
      where: { isOnline: true },
    });

    onlineDrivers.forEach((driver) => {
      this.socketService.emitToDriver(driver.id, 'new_ride_request', ride);
    });

    return ride;
  }

  async acceptRide(driverUserId: string, rideId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { userId: driverUserId },
    });

    if (!driver) throw new NotFoundException('Driver profile not found');

    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Ride not found');
    if (ride.status !== RideStatus.PENDING) {
      throw new BadRequestException('Ride is no longer available');
    }

    const updatedRide = await this.prisma.ride.update({
      where: { id: rideId },
      data: {
        driverId: driver.id,
        status: RideStatus.ACCEPTED,
      },
      include: { driver: true, user: true },
    });

    // Notify user that driver accepted
    this.socketService.emitToUser(ride.userId, 'ride_accepted', updatedRide);

    return updatedRide;
  }

  async updateStatus(rideId: string, status: RideStatus) {
    const ride = await this.prisma.ride.update({
      where: { id: rideId },
      data: { status },
      include: { driver: true, user: true },
    });

    // Notify both user and driver about the status change
    this.socketService.emitToUser(ride.userId, 'ride_status_updated', ride);
    if (ride.driverId) {
      this.socketService.emitToDriver(ride.driverId, 'ride_status_updated', ride);
    }

    return ride;
  }

  async getRide(id: string) {
    const ride = await this.prisma.ride.findUnique({
      where: { id },
      include: { driver: true, user: true },
    });
    if (!ride) throw new NotFoundException('Ride not found');
    return ride;
  }
}

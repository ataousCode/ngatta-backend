import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateDriverProfileDto } from './dto/update-profile.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { DriverStatus } from '@prisma/client';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class DriverService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async getMe(userId: string) {
    let driver = await this.prisma.driver.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!driver) {
      driver = await this.prisma.driver.create({
        data: { userId },
        include: { user: true },
      });
    }

    return driver;
  }

  async apply(userId: string, idCardFile: Express.Multer.File, licenseFile: Express.Multer.File) {
    const idCard = (await this.cloudinary.uploadFile(idCardFile, 'ngatta/drivers/id_cards')) as UploadApiResponse;
    const license = (await this.cloudinary.uploadFile(licenseFile, 'ngatta/drivers/licenses')) as UploadApiResponse;

    return this.prisma.driver.update({
      where: { userId },
      data: {
        idCardUrl: idCard.secure_url,
        licenseUrl: license.secure_url,
        status: DriverStatus.PENDING,
      },
    });
  }

  async updateStatus(userId: string, isOnline: boolean) {
    const driver = await this.prisma.driver.findUnique({ where: { userId } });
    
    if (!driver) throw new NotFoundException('Driver profile not found');
    
    if (isOnline && (driver.status !== DriverStatus.APPROVED)) {
      throw new ForbiddenException('Your account must be APPROVED before you can go online');
    }

    return this.prisma.driver.update({
      where: { userId },
      data: { isOnline },
    });
  }

  async updateProfile(userId: string, dto: UpdateDriverProfileDto) {
    return this.prisma.driver.upsert({
      where: { userId },
      update: { ...dto },
      create: { 
        userId,
        ...dto
      },
    });
  }

  // --- Admin Logic ---

  async getPending() {
    return this.prisma.driver.findMany({
      where: { status: DriverStatus.PENDING },
      include: { user: true },
    });
  }

  async verify(id: string, status: DriverStatus, rejectionReason?: string) {
    return this.prisma.driver.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === DriverStatus.REJECTED ? rejectionReason : null,
        isVerified: status === DriverStatus.APPROVED,
      },
    });
  }
}

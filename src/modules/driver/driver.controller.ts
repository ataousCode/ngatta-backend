import { 
  Body, 
  Controller, 
  Get, 
  Patch, 
  Post, 
  Param,
  UseGuards, 
  UseInterceptors, 
  UploadedFiles,
  BadRequestException
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, DriverStatus } from '@prisma/client';
import { DriverService } from './driver.service';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UpdateDriverProfileDto } from './dto/update-profile.dto';
import { DriverApplyDto } from './dto/driver-apply.dto';

@ApiTags('Driver')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('me')
  @Roles(Role.DRIVER, Role.ADMIN)
  @ApiOperation({ summary: 'Get current driver profile' })
  async getMe(@GetUser('sub') userId: string) {
    return this.driverService.getMe(userId);
  }

  @Post('apply')
  @Roles(Role.DRIVER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: DriverApplyDto })
  @ApiOperation({ summary: 'Submit driver documents for verification' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'idCard', maxCount: 1 },
    { name: 'license', maxCount: 1 },
  ]))
  async apply(
    @GetUser('sub') userId: string,
    @UploadedFiles() files: { idCard?: Express.Multer.File[], license?: Express.Multer.File[] },
  ) {
    if (!files.idCard?.[0] || !files.license?.[0]) {
      throw new BadRequestException('Both ID Card and License are required');
    }
    return this.driverService.apply(userId, files.idCard[0], files.license[0]);
  }

  @Post('status')
  @Roles(Role.DRIVER)
  @ApiOperation({ summary: 'Toggle online/offline status' })
  async updateStatus(
    @GetUser('sub') userId: string,
    @Body('isOnline') isOnline: boolean,
  ) {
    return this.driverService.updateStatus(userId, isOnline);
  }

  @Patch('profile')
  @Roles(Role.DRIVER)
  @ApiOperation({ summary: 'Update vehicle and location info' })
  @ApiBody({ type: UpdateDriverProfileDto })
  async updateProfile(
    @GetUser('sub') userId: string,
    @Body() dto: UpdateDriverProfileDto,
  ) {
    return this.driverService.updateProfile(userId, dto);
  }

  // --- Admin Verification Endpoints ---

  @Get('admin/pending')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all pending driver applications' })
  async getPending() {
    return this.driverService.getPending();
  }

  @Patch('admin/:id/verify')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Approve or reject a driver application' })
  async verify(
    @Param('id') id: string,
    @Body('status') status: DriverStatus,
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    return this.driverService.verify(id, status, rejectionReason);
  }
}

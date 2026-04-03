import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, RideStatus } from '@prisma/client';
import { RideService } from './ride.service';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { CreateRideDto } from './dto/create-ride.dto';

@ApiTags('Ride')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post('request')
  @Roles(Role.USER)
  @ApiBody({ type: CreateRideDto })
  @ApiOperation({ summary: 'Request a new ride' })
  async createRide(@GetUser('sub') userId: string, @Body() dto: CreateRideDto) {
    return this.rideService.createRide(userId, dto);
  }

  @Post(':id/accept')
  @Roles(Role.DRIVER)
  @ApiOperation({ summary: 'Accept a ride request' })
  async acceptRide(@GetUser('sub') userId: string, @Param('id') rideId: string) {
    return this.rideService.acceptRide(userId, rideId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update ride status' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        status: { type: 'string', enum: Object.values(RideStatus) } 
      } 
    } 
  })
  async updateStatus(
    @Param('id') rideId: string,
    @Body('status') status: RideStatus,
  ) {
    return this.rideService.updateStatus(rideId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ride details' })
  async getRide(@Param('id') rideId: string) {
    return this.rideService.getRide(rideId);
  }
}

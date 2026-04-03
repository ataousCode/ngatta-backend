import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VehicleType } from '@prisma/client';

export class UpdateDriverProfileDto {
  @ApiProperty({ enum: VehicleType, example: 'CAR' })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  licensePlate: string;

  @ApiPropertyOptional({ example: 4.88 })
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional({ example: 2.22 })
  @IsOptional()
  lng?: number;
}

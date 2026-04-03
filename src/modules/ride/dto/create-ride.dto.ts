import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateRideDto {
  @ApiProperty({ example: 48.8566 })
  @IsNumber()
  fromLat: number;

  @ApiProperty({ example: 2.3522 })
  @IsNumber()
  fromLng: number;

  @ApiProperty({ example: 48.8584 })
  @IsNumber()
  toLat: number;

  @ApiProperty({ example: 2.2945 })
  @IsNumber()
  toLng: number;
}

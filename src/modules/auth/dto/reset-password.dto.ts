import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Phone number' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone: string;

  @ApiProperty({ description: 'The 4-digit OTP code received' })
  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  code: string;

  @ApiProperty({ description: 'The new password to set (min 6 characters)' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  newPassword: string;
}

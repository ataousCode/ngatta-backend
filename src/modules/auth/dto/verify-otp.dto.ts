import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 4, { message: 'OTP must be exactly 4 digits' })
  code: string;
}

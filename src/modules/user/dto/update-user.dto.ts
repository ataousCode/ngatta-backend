import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'johndoe@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Passionate traveler and foodie.' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ 
    example: { language: 'en', darkMode: true, notifications: true },
    description: 'User preferences as a JSON object'
  })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;
}

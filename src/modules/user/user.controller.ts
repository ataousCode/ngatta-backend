import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile and preferences' })
  async getMe(@GetUser('sub') userId: string) {
    return this.userService.findOne(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user name, email, bio, and preferences' })
  @ApiBody({ type: UpdateUserDto })
  async updateProfile(
    @GetUser('sub') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(userId, dto);
  }

  @Post('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload and update profile photo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @GetUser('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Avatar file is required');
    }
    const result = await this.cloudinaryService.uploadFile(file, 'ngatta/users/avatars');
    return this.userService.updateAvatar(userId, (result as any).secure_url);
  }

  @Get('rides')
  @ApiOperation({ summary: 'Get user ride history' })
  async getRideHistory(@GetUser('sub') userId: string) {
    return this.userService.getRideHistory(userId);
  }

  @Delete('account')
  @ApiOperation({ summary: 'Permanently delete user account' })
  async deleteAccount(@GetUser('sub') userId: string) {
    return this.userService.deleteAccount(userId);
  }
}

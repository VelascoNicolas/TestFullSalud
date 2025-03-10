import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  AuthUserDto, UserDto } from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from './guards/auth.guard';
import { Role } from '../../domain/enums';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('/login')
  // async loginUser(@Body() loginDto: AuthUserDto): Promise<UserDto & { accessToken: string/*; refreshToken: string*/ }> {
  //   return await this.authService.loginUser(loginDto);
  // }
  @Post('/login')
  async loginUser(@Body() loginDto: AuthUserDto): Promise<UserDto & { accessToken: string; refreshToken: string }> {
    return await this.authService.loginUser(loginDto);
  }

  @Post('/refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<{ accessToken: string }> {
    return await this.authService.refreshToken(refreshToken);
  }
  
  @Post('/create')
  @Roles(Role.ADMIN)
  async createAdmin(@Body() createUserDto: AuthUserDto) {
    return this.authService.createAdmin(createUserDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    const url = await this.authService.uploadImage(file);
    return { url };
  }

}
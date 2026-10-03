import { Controller, Post, Get, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  RefreshTokenRequestSchema,
  RegisterRequestDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
} from '@studypal/contracts';
import { AppException, InternalAuthGuard, CurrentUser, Public } from '@studypal/service-kit';
import { InternalAuthContext } from '@studypal/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: any) {
    const parsed = RegisterRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw AppException.validationFailed('Invalid registration data', parsed.error.format());
    }
    const result = await this.authService.register(parsed.data as RegisterRequestDto);
    return { success: true, data: result };
  }

  @Public()
  @Post('login')
  async login(@Body() body: any) {
    const parsed = LoginRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw AppException.validationFailed('Invalid login data', parsed.error.format());
    }
    const result = await this.authService.login(parsed.data as LoginRequestDto);
    return { success: true, data: result };
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: any) {
    const parsed = RefreshTokenRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw AppException.validationFailed('Invalid refresh token payload', parsed.error.format());
    }
    const result = await this.authService.refreshToken(parsed.data.refreshToken);
    return { success: true, data: result };
  }

  @Public()
  @Post('logout')
  async logout(@Body() body: any) {
    const token = body?.refreshToken;
    await this.authService.logout(token);
    return { success: true, message: 'Logged out successfully' };
  }

  @Public()
  @Get('jwks')
  getJwks() {
    return this.authService.getPublicKeys();
  }

  @UseGuards(InternalAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: InternalAuthContext) {
    const profile = await this.authService.getUserProfile(user.userId);
    return { success: true, data: profile };
  }

  @UseGuards(InternalAuthGuard)
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    const profile = await this.authService.getUserProfile(id);
    return { success: true, data: profile };
  }
}

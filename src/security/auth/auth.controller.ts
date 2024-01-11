import { Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from '@/security/auth/auth.service';
import { ApiHeader } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @ApiHeader({ name: 'email', required: true })
  @ApiHeader({ name: 'password', required: true })
  async login(@Headers() { email, password }: any) {
    const token = await this.authService.login({ email, password });
    return { token, message: 'logged' };
  }
}

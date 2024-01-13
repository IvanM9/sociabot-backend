import { Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from '@/security/auth/auth.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiHeader({ name: 'email', required: true })
  @ApiHeader({ name: 'password', required: true })
  async login(@Headers() { email, password }: any) {
    const token = await this.authService.login({ email, password });
    return { data: token, message: 'logged' };
  }
}
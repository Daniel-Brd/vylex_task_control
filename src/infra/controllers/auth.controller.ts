import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthenticateUserUseCase } from 'src/@core/application/auth/usecases/auth-user.use-case';
import { AuthCredentialsInputDto } from 'src/@core/contracts/auth/auth-credentials.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUserUseCase: AuthenticateUserUseCase) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() authCredentialsDto: AuthCredentialsInputDto) {
    return this.authUserUseCase.execute(authCredentialsDto);
  }
}

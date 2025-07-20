import { AuthTokenOutputDto } from 'src/@core/contracts/auth/auth-token.dto';
import { IAuthTokenGenerator } from 'src/@core/domain/auth/auth-token.port';
import { IPasswordHasher } from 'src/@core/domain/auth/password-hasher.port';
import { IUserRepository } from 'src/@core/domain/user';
import { InvalidCredentialsError } from 'src/@core/errors/index.error';
import { AuthUserCommand } from '../commands/auth-user.command';

export class AuthenticateUserUseCase {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly authTokenGenerator: IAuthTokenGenerator,
  ) {}

  async execute(command: AuthUserCommand): Promise<AuthTokenOutputDto> {
    const { email, password } = command;
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.authTokenGenerator.generate({
      sub: user.id.toString(),
      email: user.email,
    });

    return { access_token: accessToken };
  }
}

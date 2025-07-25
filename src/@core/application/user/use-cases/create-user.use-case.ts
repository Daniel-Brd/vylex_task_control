import { CreateUserOutputDto } from 'src/@core/contracts/user/create-user.dto';
import { IUserRepository, User } from 'src/@core/domain/user';
import { CreateUserCommand } from '../commands/create-user.command';
import { IPasswordHasher } from 'src/@core/domain/auth/password-hasher.port';
import { EmailAlreadyExistsError } from 'src/@core/errors/index.error';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IPasswordHasher,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserOutputDto> {
    const { email, name, password } = command;

    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) throw new EmailAlreadyExistsError();

    const user = await User.create({ email, name, password }, this.hasher);

    await this.userRepository.create(user);

    return {
      userId: user.id,
    };
  }
}

import { CreateUserOutputDto } from 'src/@core/contracts/user/create-user.dto';
import { IUserRepository, User } from 'src/@core/domain/user';
import { CreateUserCommand } from '../commands/create-user.command';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(command: CreateUserCommand): Promise<CreateUserOutputDto> {
    const { email, name, password } = command;

    const user = User.create({ email, name, password });

    await this.userRepository.create(user);

    return {
      userId: user.id,
    };
  }
}

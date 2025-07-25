import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserCommand } from 'src/@core/application/user/commands/create-user.command';
import { CreateUserUseCase } from 'src/@core/application/user/use-cases/create-user.use-case';
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from 'src/@core/contracts/user/create-user.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Public()
  @Post()
  async create(@Body() dto: CreateUserInputDto): Promise<CreateUserOutputDto> {
    const command: CreateUserCommand = {
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };

    return this.createUserUseCase.execute(command);
  }
}

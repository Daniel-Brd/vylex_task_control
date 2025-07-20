import { IsUUID, IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserInputDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class CreateUserOutputDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;
}

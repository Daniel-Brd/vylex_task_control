import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class AuthCredentialsInputDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

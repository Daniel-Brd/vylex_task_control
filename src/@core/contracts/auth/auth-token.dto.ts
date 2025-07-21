import { IsString, IsNotEmpty } from 'class-validator';

export class AuthTokenOutputDto {
  @IsString()
  @IsNotEmpty()
  access_token!: string;
}

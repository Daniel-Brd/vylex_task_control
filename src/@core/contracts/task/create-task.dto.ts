import { IsUUID, IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateTaskInputDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDate()
  @IsNotEmpty()
  dueDate!: Date;
}

export class CreateTaskOutputDto {
  @IsUUID()
  @IsNotEmpty()
  taskId!: string;
}

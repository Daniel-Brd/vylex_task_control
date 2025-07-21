import { Type } from 'class-transformer';
import { IsString, IsDate, IsOptional } from 'class-validator';

export class UpdateTaskDetailsInputDto {
  @IsString()
  @IsOptional()
  title!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate!: Date;
}

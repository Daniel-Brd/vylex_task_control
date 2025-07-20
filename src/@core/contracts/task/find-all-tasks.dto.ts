import { IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  TaskStatus,
  SortOrder,
  SortBy,
  NullsOrder,
} from 'src/@core/domain/task';

class Filters {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

class OrderBy {
  @IsEnum(SortOrder)
  sortOrder: SortOrder;

  @IsEnum(SortBy)
  sortBy: SortBy;

  @IsOptional()
  @IsEnum(NullsOrder)
  nulls?: NullsOrder;
}

export class FindAllTasksQueryDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => Filters)
  filters?: Filters;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderBy)
  orderBy?: OrderBy;
}

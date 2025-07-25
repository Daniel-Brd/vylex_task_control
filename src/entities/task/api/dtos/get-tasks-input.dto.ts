import type { TaskStatus } from '../../model/types';

type NullsOrder = 'first' | 'last';

type SortOrder = 'asc' | 'desc';
type SortBy = 'createdAt' | 'completedAt' | 'dueDate' | 'status' | 'title' | 'description';

export type GetTasksFilters = {
  status?: TaskStatus;
};

export type GetTasksOrderBy = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  nulls?: NullsOrder;
};

export type GetTaskInputDto = {
  filters?: GetTasksFilters;
  orderBy?: GetTasksOrderBy;
};

import type { TaskStatus } from '../../model/types';

type SortOrder = 'asc' | 'desc';

type NullsOrder = 'first' | 'last';

type SortBy = 'createdAt' | 'completedAt' | 'dueDate' | 'status' | 'title' | 'description';

type GetTasksFilters = {
  status?: TaskStatus;
};

type GetTasksOrderBy = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  nulls?: NullsOrder;
};

export type GetTaskInputDto = {
  filters?: GetTasksFilters;
  orderBy?: GetTasksOrderBy;
};

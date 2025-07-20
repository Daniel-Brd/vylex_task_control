export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum NullsOrder {
  FIRST = 'first',
  LAST = 'last',
}

export enum SortBy {
  CREATED_AT = 'createdAt',
  COMPLETED_AT = 'completedAt',
  DUE_DATE = 'dueDate',
  STATUS = 'status',
  TITLE = 'title',
  DESCRIPTION = 'description',
}

export type TaskOrderBy = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  nulls?: NullsOrder;
};
